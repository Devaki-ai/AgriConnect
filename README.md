# 🌾 AgriConnect

AI-powered crop recommendation system based on soil and climate data.

## Project Structure

```
AgriConnect/
├── backend/            ← Python + Flask + ML
│   ├── app.py          ← REST API server
│   ├── train_model.py  ← Model training script
│   ├── crop.csv        ← Dataset (2200 samples, 22 crops)
│   └── model.pkl       ← Trained RandomForest model
├── frontend/           ← Plain HTML + CSS + JS (no frameworks)
│   ├── index.html      ← Main UI
│   ├── style.css       ← Styles
│   └── script.js       ← API calls & rendering
└── README.md
```

## How to Run

### 1. Start the Backend
```bash
cd backend
pip install flask flask-cors scikit-learn pandas
python app.py
```
Backend runs at `http://127.0.0.1:5000`

### 2. Open the Frontend
Just open `frontend/index.html` in your browser. No install needed.

## How It Works

Enter 7 soil/climate values → click Predict → get top 3 crop recommendations with variety, duration, water needs, profit, and benefits.

## Tech Stack
- **Backend:** Python, Flask, scikit-learn (RandomForest)
- **Frontend:** HTML, CSS, JavaScript (no frameworks)
- **Dataset:** 2200 samples, 22 crop types
