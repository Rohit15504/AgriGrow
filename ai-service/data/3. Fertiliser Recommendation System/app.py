import flask
import pickle
import numpy as np

# Initialize the Flask app
app = flask.Flask(__name__, template_folder='templates')

# --- Load the Model and Encoders ---
# We load them here at the start so they are in memory and ready
try:
    model = pickle.load(open('fertilizer_model.pkl', 'rb'))
    soil_encoder = pickle.load(open('soil_encoder.pkl', 'rb'))
    crop_encoder = pickle.load(open('crop_encoder.pkl', 'rb'))
    fertilizer_encoder = pickle.load(open('fertilizer_encoder.pkl', 'rb'))
    
    print("[INFO] Model and encoders loaded successfully.")
    
    # Get the class names from the encoders for the dropdowns
    SOIL_TYPES = soil_encoder.classes_
    CROP_TYPES = crop_encoder.classes_

except FileNotFoundError as e:
    print(f"[ERROR] Could not load model or encoder files. Make sure they are in the root directory.")
    print(e)
    # If files aren't found, set empty lists for dropdowns
    SOIL_TYPES = []
    CROP_TYPES = []

# --- Routes ---

@app.route('/')
def home():
    """Renders the home page with dropdowns."""
    return flask.render_template('index.html', 
                                 soil_types=SOIL_TYPES, 
                                 crop_types=CROP_TYPES)

@app.route('/predict', methods=['POST'])
def predict():
    """Handles the form submission and makes a prediction."""
    if flask.request.method == 'POST':
        try:
            # Get all 8 inputs from the form
            temp = float(flask.request.form['Temperature'])
            humidity = float(flask.request.form['Humidity'])
            moisture = float(flask.request.form['Moisture'])
            soil = flask.request.form['Soil Type']
            crop = flask.request.form['Crop Type']
            nitrogen = float(flask.request.form['Nitrogen'])
            potassium = float(flask.request.form['Potassium'])
            phosphorous = float(flask.request.form['Phosphorous'])

            # Encode the categorical features (Soil and Crop)
            # .transform() expects an array, so we pass [soil] and take the first element [0]
            soil_encoded = soil_encoder.transform([soil])[0]
            crop_encoded = crop_encoder.transform([crop])[0]

            # Create the feature array in the correct order
            # Order must be exactly what the model was trained on
            features = np.array([[
                temp, 
                humidity, 
                moisture, 
                soil_encoded, 
                crop_encoded, 
                nitrogen, 
                potassium, 
                phosphorous
            ]])

            # Make the prediction
            prediction_encoded = model.predict(features)
            
            # Decode the prediction (e.g., [2]) back into text (e.g., "Urea")
            prediction_text = fertilizer_encoder.inverse_transform(prediction_encoded)[0]

            # Render the result page
            return flask.render_template('result.html', prediction=prediction_text)

        except ValueError:
            error_msg = "Please enter valid numbers for all fields."
            return flask.render_template('index.html', 
                                         soil_types=SOIL_TYPES, 
                                         crop_types=CROP_TYPES, 
                                         error=error_msg)
        except Exception as e:
            # Catch errors if a new/unknown value is passed to the encoder
            error_msg = f"An error occurred: {e}"
            return flask.render_template('index.html', 
                                         soil_types=SOIL_TYPES, 
                                         crop_types=CROP_TYPES, 
                                         error=error_msg)

if __name__ == '__main__':
    # Run the app
    app.run(debug=True)