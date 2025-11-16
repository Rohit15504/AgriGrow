import flask
import pickle
import numpy as np
import pandas as pd
import json

# Initialize the Flask app
app = flask.Flask(__name__, template_folder='templates')

# --- Load Models and Columns ---
try:
    # Load the yield prediction model
    model = pickle.load(open('yield_model.pkl', 'rb'))
    
    # Load the list of feature columns
    with open('model_columns.json', 'r') as f:
        model_columns = json.load(f)
except FileNotFoundError:
    print("ERROR: Model or column files not found.")
    print("Please run the Jupyter notebook cells to save 'yield_model.pkl' and 'model_columns.json' first.")
    exit()

# --- Define Lists for Dropdowns ---
# These are from cells 3 and 14 of your notebook
CROPS = ['rice', 'banana', 'maize', 'mungbean', 'cotton', 'chickpea',
         'grapes', 'mango', 'orange', 'papaya', 'pomegranate', 'pigeonpeas',
         'jute', 'blackgram', 'mothbeans', 'coffee', 'watermelon', 'lentil',
         'kidneybeans', 'apple']

SEASONS = ['Autumn', 'Kharif', 'Rabi', 'Summer', 'Whole Year', 'Winter']


@app.route('/')
def home():
    """Renders the home page with the input form."""
    return flask.render_template('index_yield.html', crops=CROPS, seasons=SEASONS)

@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    """Handles the form submission and predicts the yield."""
    if flask.request.method == 'POST':
        try:
            # Get user inputs from the form
            year = int(flask.request.form['Crop_Year'])
            season = flask.request.form['Season']
            crop = flask.request.form['Crop']
            area = float(flask.request.form['Area'])

            if area <= 0:
                error_msg = "Area must be a positive number."
                return flask.render_template('index_yield.html', crops=CROPS, seasons=SEASONS, error=error_msg)

            # --- Prepare the input for the model ---
            # Create a single row of zeros, matching the model's columns
            data_row = pd.Series(0, index=model_columns)
            
            # Set the values from user input
            data_row['Crop_Year'] = year
            data_row['Area'] = area
            
            # Set the one-hot encoded columns
            season_col = 'Season_' + season
            if season_col in data_row.index:
                data_row[season_col] = 1
                
            crop_col = 'Crop_' + crop
            if crop_col in data_row.index:
                data_row[crop_col] = 1

            # Convert the Series to a DataFrame for prediction
            data_df = pd.DataFrame([data_row])
            
            # --- Make Prediction ---
            prediction = model.predict(data_df)[0]
            
            # Calculate yield (Production / Area)
            yield_per_area = prediction / area
            
            # Render the result page
            return flask.render_template('result_yield.html', 
                                         prediction=f"{prediction:,.2f}", 
                                         yield_val=f"{yield_per_area:,.2f}",
                                         crop=crop,
                                         area=area)

        except ValueError:
            error_msg = "Please enter valid numbers for Year and Area."
            return flask.render_template('index_yield.html', crops=CROPS, seasons=SEASONS, error=error_msg)
        except Exception as e:
            error_msg = f"An error occurred: {e}"
            return flask.render_template('index_yield.html', crops=CROPS, seasons=SEASONS, error=error_msg)

if __name__ == '__main__':
    app.run(debug=True)