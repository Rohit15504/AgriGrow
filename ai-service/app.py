import flask
import pickle
import numpy as np
import pandas as pd
import json
import io
from PIL import Image
import tensorflow as tf
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app) # Enable CORS so Node.js can communicate with it

# --- 1. Load All Models and Encoders ---
print("[INFO] Loading all AI models and resources...")

try:
    # Crop Prediction Model (RandomForest)
    crop_model = pickle.load(open('crop_prediction.pkl', 'rb'))
    
    # Fertilizer Recommendation Model & Encoders
    fertilizer_model = pickle.load(open('fertilizer_model.pkl', 'rb'))
    soil_encoder = pickle.load(open('soil_encoder.pkl', 'rb'))
    crop_encoder = pickle.load(open('crop_encoder.pkl', 'rb'))
    fertilizer_encoder = pickle.load(open('fertilizer_encoder.pkl', 'rb'))
    
    # Crop Yield Model & Feature Columns
    yield_model = pickle.load(open('yield_model.pkl', 'rb'))
    with open('model_columns.json', 'r') as f:
        model_columns = json.load(f)
        
    # Disease Detection Model (.keras format)
    disease_model = tf.keras.models.load_model('trained_model.keras')
    
    print("[INFO] All models loaded successfully.")
except Exception as e:
    print(f"[ERROR] Failed to load models: {e}")
    exit()

# --- 2. Helper Data for Frontend Dropdowns ---
YIELD_CROPS = [col.replace('Crop_', '') for col in model_columns if col.startswith('Crop_')]
YIELD_SEASONS = [col.replace('Season_', '') for col in model_columns if col.startswith('Season_')]
FERT_SOIL_TYPES = list(soil_encoder.classes_)
FERT_CROP_TYPES = list(crop_encoder.classes_)

# 38 Classes for Plant Village Dataset
DISEASE_CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot', 
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 
    'Tomato___healthy'
]

# --- 3. API Endpoints ---

@app.route('/', methods=['GET'])
def home():
    return "AgriGrow Flask AI Server is Online."

@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    data = request.get_json()
    features = np.array([[data['N'], data['P'], data['K'], data['temperature'], 
                          data['humidity'], data['ph'], data['rainfall']]])
    prediction = crop_model.predict(features)
    return jsonify({'prediction_text': f'The Recommended Crop is {prediction[0]}'})

@app.route('/predict_fertilizer', methods=['POST'])
def predict_fertilizer():
    data = request.get_json()
    soil_encoded = soil_encoder.transform([data['Soil_Type']])[0]
    crop_encoded = crop_encoder.transform([data['Crop_Type']])[0]
    features = np.array([[data['Temperature'], data['Humidity'], data['Moisture'], 
                          soil_encoded, crop_encoded, data['Nitrogen'], 
                          data['Potassium'], data['Phosphorous']]])
    prediction = fertilizer_model.predict(features)
    result = fertilizer_encoder.inverse_transform(prediction)[0]
    return jsonify({'prediction_text': f'The Recommended Fertilizer is {result}'})

@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    data = request.get_json()
    area = float(data['Area'])
    data_row = pd.Series(0, index=model_columns)
    data_row['Crop_Year'], data_row['Area'] = int(data['Crop_Year']), area
    
    if f"Season_{data['Season']}" in data_row.index: data_row[f"Season_{data['Season']}"] = 1
    if f"Crop_{data['Crop']}" in data_row.index: data_row[f"Crop_{data['Crop']}"] = 1
    
    prediction = yield_model.predict(pd.DataFrame([data_row]))[0]
    return jsonify({
        'total_production': f'{prediction:,.2f} Tonnes',
        'yield_per_hectare': f'{(prediction/area):,.2f} Tonnes/Hectare'
    })

@app.route('/get_dropdown_data', methods=['GET'])
def get_dropdown_data():
    return jsonify({
        'yield_crops': YIELD_CROPS, 'yield_seasons': YIELD_SEASONS,
        'fert_soil_types': FERT_SOIL_TYPES, 'fert_crop_types': FERT_CROP_TYPES
    })

@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    if 'file' not in request.files: return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['file']
    img = Image.open(io.BytesIO(file.read())).resize((128, 128)) # Resizing to 128x128 as trained
    img_array = tf.expand_dims(tf.keras.preprocessing.image.img_to_array(img), 0)
    
    # Predict
    predictions = disease_model.predict(img_array)
    result_class = DISEASE_CLASSES[np.argmax(predictions[0])]
    display_name = result_class.replace('___', ' - ').replace('_', ' ')
    return jsonify({'prediction_text': display_name})

if __name__ == '__main__':
    # host='0.0.0.0' is required for the cloud environment
    app.run(host='0.0.0.0', port=7860)