# CardioPredict — Clinical CVD Risk Prediction Platform

A full-stack web application for cardiovascular disease risk prediction using 4 trained ML models on the UCI Cleveland Heart Disease dataset.

**Live Demo:** [cardio-predict-lyart.vercel.app](https://cardio-predict-lyart.vercel.app/)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ML API | Python · FastAPI · Scikit-learn · XGBoost |
| Backend | Node.js · Express · JWT · Google OAuth 2.0 · Mongoose |
| Frontend | React (Vite) · Bootstrap 5 · Chart.js |
| Database | MongoDB Atlas |
| Deployment | Vercel (React) · Render (FastAPI + Node) |

---

## ML Models

All models trained on the UCI Cleveland Heart Disease dataset (303 records, 13 clinical features). Thresholds optimized using Youden's J Index.

| Model | Accuracy | AUROC | Threshold |
|-------|----------|-------|-----------|
| Random Forest | 86.7% | 0.924 | 0.4064 |
| SVM | 91.7% | 0.927 | 0.3636 |
| XGBoost | 88.3% | 0.944 | 0.3575 |
| **Hybrid Ensemble** | **91.7%** | **0.946** | **0.5204** |

Hybrid Ensemble = RF + SVM + XGBoost base models with Logistic Regression meta-learner (StackingClassifier, passthrough=True, 10-fold StratifiedKFold).

---

## Features

- **Google OAuth 2.0** — sign in with any Google account, no password needed
- **4 ML Models** — real inference via FastAPI, not a demo
- **Prediction History** — every prediction saved per user in MongoDB Atlas
- **Model Comparison** — interactive Chart.js bar chart with full metrics
- **Youden's J Thresholds** — mathematically optimized decision boundaries
- **13 Clinical Features** — all required, none optional, field-level validation
- **Delete Account** — full data wipe including prediction history

---

## Project Structure

CardioPredict/
- ├── fastapi/          # ML API — FastAPI serving 4 pkl models
- ├── backend/          # Node/Express — Auth, predictions, history
- ├── frontend/         # React/Vite — Full UI
- └── notebooks/        # 4 Jupyter notebooks — model training

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas URI
- Google OAuth 2.0 Client ID and Secret

### FastAPI (ML API)
```bash
cd fastapi
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> PKL files must be present in `fastapi/pkl_files/`. Run the notebooks in `notebooks/` to generate them.

### Node Backend
```bash
cd backend
npm install
# Create .env file (see Environment Variables below)
node server.js
```

### React Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### `backend/.env`

MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
PORT=5000
FASTAPI_URL=http://localhost:8000
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

---

## Model Training

Notebooks in `notebooks/` folder:
- `HEART_DISEASE_RF.ipynb` — Random Forest with GridSearchCV
- `HEART_DISEASE_SVM.ipynb` — SVM Pipeline with StandardScaler
- `HEART_DISEASE_XGBOOST.ipynb` — XGBoost Pipeline
- `HEART_DISEASE_HYBRID.ipynb` — StackingClassifier ensemble

Run all 4 to regenerate pkl files. Requires Kaggle API key for dataset download.

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| React Frontend | Vercel | Auto-deploys on push to main |
| Node Backend | Render | Web Service |
| FastAPI ML API | Render | Web Service |
| Database | MongoDB Atlas | M0 Free Tier |

> **Note:** Render free tier services spin down after 15 minutes of inactivity. First request after idle takes 30–60 seconds. This is expected — the ML service is not broken.

---

## Author

**Nipun Garg**  
B.Tech CSE (AI & ML) · SRM Institute of Science & Technology, Delhi-NCR · Batch 2023–2027

[LinkedIn](https://linkedin.com/in/nipungarg1409) · [GitHub](https://github.com/Nipun140905) · gargnipun4@gmail.com