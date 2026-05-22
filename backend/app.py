from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

model = pickle.load(open("model.pkl", "rb"))

# 📂 Load CSV safely
df = pd.read_csv("crop.csv")
column_name = df.columns[-1]   # last column usually label
all_crops = df[column_name].unique()

# 🌾 REAL DATA
real_crop_info = {
    "rice": {"variety": "IR64", "duration": "120 days", "water": "High 💧", "profit": "₹25,000/acre", "benefits": ["Staple food"]},
    "wheat": {"variety": "HD-2967", "duration": "110 days", "water": "Medium 💧", "profit": "₹20,000/acre", "benefits": ["High demand"]},
    "mango": {"variety": "Alphonso", "duration": "3-5 years", "water": "Medium 💧", "profit": "₹60,000/acre", "benefits": ["Premium fruit"]},
    "banana": {"variety": "Cavendish", "duration": "300 days", "water": "High 💧", "profit": "₹50,000/acre", "benefits": ["Export demand"]}
}

# 🤖 Default
def generate_default_info(crop):
    return {
        "variety": f"{crop.capitalize()} variety",
        "duration": "90-180 days",
        "water": "Medium 💧",
        "profit": "₹30,000 approx",
        "benefits": [f"{crop.capitalize()} farming", "Market demand"]
    }

# 🌐 Fallback
def fetch_from_api(crop):
    return {
        "variety": f"{crop.capitalize()} Hybrid",
        "duration": "100-150 days",
        "water": "Medium 💧",
        "profit": "₹35,000 approx",
        "benefits": [f"{crop.capitalize()} demand high"]
    }

# 🔄 Build info
crop_info = {}

for crop in all_crops:
    c = str(crop).lower()

    if c in real_crop_info:
        crop_info[c] = real_crop_info[c]
    else:
        crop_info[c] = generate_default_info(c)

# 🔮 API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # safe extraction
        N = data.get("N")
        P = data.get("P")
        K = data.get("K")
        temp = data.get("temperature")
        hum = data.get("humidity")
        ph = data.get("ph")
        rain = data.get("rainfall")

        if None in [N, P, K, temp, hum, ph, rain]:
            return jsonify({"error": "Missing input values"})

        features = [[N, P, K, temp, hum, ph, rain]]

        # handle model types
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features)[0]
            top3_indices = probs.argsort()[-3:][::-1]
            top3_crops = [model.classes_[i] for i in top3_indices]
        else:
            top3_crops = model.predict(features)

        result_details = {}

        for crop in top3_crops:
            c = str(crop).lower()

            if c in crop_info:
                result_details[crop] = crop_info[c]
            else:
                result_details[crop] = fetch_from_api(c)

        return jsonify({
            "top3": list(top3_crops),
            "details": result_details
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)