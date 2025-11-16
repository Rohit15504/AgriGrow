import flask
import pickle
import numpy as np
import pandas as pd
import json
from flask import request, jsonify
from flask_cors import CORS # Import CORS

# Initialize the Flask app
app = flask.Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- Load All Models and Encoders ---
print("[INFO] Loading models and encoders...")

try:
    # --- Crop Prediction Model ---
    crop_model = pickle.load(open('crop_prediction.pkl', 'rb'))
    print("[INFO] Crop Prediction model loaded.")

    # --- Fertilizer Recommendation Model ---
    fertilizer_model = pickle.load(open('fertilizer_model.pkl', 'rb'))
    soil_encoder = pickle.load(open('soil_encoder.pkl', 'rb'))
    crop_encoder = pickle.load(open('crop_encoder.pkl', 'rb'))
    fertilizer_encoder = pickle.load(open('fertilizer_encoder.pkl', 'rb'))
    print("[INFO] Fertilizer Recommendation model and encoders loaded.")

    # --- Crop Yield Model ---
    yield_model = pickle.load(open('yield_model.pkl', 'rb'))
    with open('model_columns.json', 'r') as f:
        model_columns = json.load(f)
    print("[INFO] Crop Yield model and columns loaded.")
    
    # --- Get Class Names for Yield Dropdowns ---
    # We will pass these to the Node.js server later
    YIELD_CROPS = [col.replace('Crop_', '') for col in model_columns if col.startswith('Crop_')]
    YIELD_SEASONS = [col.replace('Season_', '') for col in model_columns if col.startswith('Season_')]
    
    # --- Get Class Names for Fertilizer Dropdowns ---
    FERT_SOIL_TYPES = soil_encoder.classes_
    FERT_CROP_TYPES = crop_encoder.classes_

    print("[INFO] All resources loaded successfully.")

except FileNotFoundError as e:
    print(f"[ERROR] Could not load a file. Make sure all .pkl and .json files are in the root directory.")
    print(e)
    exit() # Exit if we can't load the models

# --- API Routes ---

# Test Route
@app.route('/', methods=['GET'])
def home():
    return "Flask AI API Server is running."

# --- 1. CROP PREDICTION ROUTE ---
@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    try:
        # Get data from the JSON request
        data = request.get_json()
        
        # Extract features in the correct order
        features = [
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
        final_features = [np.array(features)]
        prediction = crop_model.predict(final_features)
        
        # Return the prediction as JSON
        return jsonify({'prediction_text': f'The Recommended Crop is {prediction[0]}'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- 2. FERTILIZER RECOMMENDATION ROUTE ---
@app.route('/predict_fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        data = request.get_json()

        # Encode categorical features
        soil_encoded = soil_encoder.transform([data['Soil_Type']])[0]
        crop_encoded = crop_encoder.transform([data['Crop_Type']])[0]

        # Create the feature array
        features = np.array([[
            float(data['Temperature']),
            float(data['Humidity']),
            float(data['Moisture']),
            soil_encoded,
            crop_encoded,
            float(data['Nitrogen']),
            float(data['Potassium']),
            float(data['Phosphorous'])
        ]])

        # Predict
        prediction_encoded = fertilizer_model.predict(features)
        
        # Decode
        prediction_text = fertilizer_encoder.inverse_transform(prediction_encoded)[0]
        
        return jsonify({'prediction_text': f'The Recommended Fertilizer is {prediction_text}'})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- 3. CROP YIELD ROUTE ---
@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    try:
        data = request.get_json()
        
        # User inputs
        year = int(data['Crop_Year'])
        season = data['Season']
        crop = data['Crop']
        area = float(data['Area'])

        if area <= 0:
            return jsonify({'error': 'Area must be a positive number.'}), 400

        # Prepare the one-hot encoded row
        data_row = pd.Series(0, index=model_columns)
        data_row['Crop_Year'] = year
        data_row['Area'] = area
        
        season_col = 'Season_' + season
        if season_col in data_row.index:
            data_row[season_col] = 1
            
        crop_col = 'Crop_' + crop
        if crop_col in data_row.index:
            data_row[crop_col] = 1
        
        data_df = pd.DataFrame([data_row])

        # Predict
        prediction_val = yield_model.predict(data_df)[0]
        yield_per_area = prediction_val / area

        return jsonify({
            'total_production': f'{prediction_val:,.2f} Tonnes',
            'yield_per_hectare': f'{yield_per_area:,.2f} Tonnes/Hectare'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- Helper route to get dropdown values for the frontend ---
@app.route('/get_dropdown_data', methods=['GET'])
def get_dropdown_data():
    return jsonify({
        'yield_crops': YIELD_CROPS,
        'yield_seasons': YIELD_SEASONS,
        'fert_soil_types': list(FERT_SOIL_TYPES),
        'fert_crop_types': list(FERT_CROP_TYPES)
    })

# --- Run the app ---
if __name__ == '__main__':
    # We use port 5000 by default for Flask
    app.run(debug=True, port=5000)