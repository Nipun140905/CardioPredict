# CardioPredict — Clinical CVD Risk Prediction Platform

A full-stack web application for cardiovascular disease risk prediction using 4 trained ML models on the UCI Cleveland Heart Disease dataset.

**Live Demo:** [cardiopredict.vercel.app](https://cardiopredict.vercel.app) *(add after deployment)*

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ML API | Python · FastAPI · Scikit-learn · XGBoost |
| Backend | Node.js · Express · JWT · bcrypt · Nodemailer |
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

- **Email OTP Verification** — accounts require verified email before access
- **4 ML Models** — real inference via FastAPI, not a demo
- **Prediction History** — every prediction saved per user in MongoDB
- **Model Comparison** — interactive Chart.js bar chart with full metrics
- **Youden's J Thresholds** — mathematically optimized decision boundaries
- **13 Clinical Features** — all required, none optional, field-level validation
- **Delete Account** — full data wipe including prediction history

---

## Project Structure

CardioPredict/

├── fastapi/          # ML API — FastAPI serving 4 pkl models

├── backend/          # Node/Express — Auth, predictions, history

├── frontend/         # React/Vite — Full UI

└── notebooks/        # 4 Jupyter notebooks — model training


## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local) or MongoDB Atlas URI

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
# Create .env file (see .env.example)
npm run dev
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

EMAIL_USER=your_gmail@gmail.com

EMAIL_PASS=your_gmail_app_password
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

---

## Author

**Nipun Garg**
B.Tech CSE (AI & ML) · SRM Institute of Science & Technology, Delhi-NCR · Batch 2023–2027

[LinkedIn](https://linkedin.com/in/nipungarg1409)