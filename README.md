# 🌾 AgriConnect

AI-powered crop recommendation system based on soil and climate data.

## Project Structure

```
AgriConnect/
├── backend/          # Flask API + ML model
│   ├── app.py        # REST API server
│   ├── train_model.py# Model training script
│   ├── crop.csv      # Dataset (2200 samples, 22 crops)
│   └── model.pkl     # Trained RandomForest model
├── frontend/         # Next.js UI (React + Tailwind)
│   └── app/
│       └── page.tsx  # Main AgriConnect UI
├── index.html        # Standalone HTML version (no build needed)
├── script.js         # JS for standalone version
└── style.css         # CSS for standalone version
```

## How to Run

### Backend (Flask)
```bash
cd backend
pip install flask flask-cors scikit-learn pandas
python app.py
```
Server runs at `http://127.0.0.1:5000`

### Frontend — Option A: Standalone (simplest)
Just open `index.html` in your browser. No install needed.

### Frontend — Option B: Next.js
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:3000`

## How It Works

Enter 7 soil/climate values (N, P, K, Temperature, Humidity, pH, Rainfall) and the model predicts the **top 3 best crops** to grow, along with variety, duration, water needs, profit estimate, and benefits.

## Tech Stack
- **Backend:** Python, Flask, scikit-learn (RandomForestClassifier)
- **Frontend:** Next.js 16, React, Tailwind CSS
- **Dataset:** 2200 samples across 22 crop types
