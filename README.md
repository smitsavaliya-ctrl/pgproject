# 🏡 StayNest - Full-Stack PG & Hostel Finder Application

StayNest is a modern full-stack web application designed for students and working professionals to find verified PGs, Hostels, and Co-living spaces across major Indian cities.

---

## 🌟 Key Features
- 🏙️ **1,200 Total PGs Across 6 Major Cities** (Bengaluru: 200, Delhi: 200, Pune: 200, Jaipur: 200, Ahmedabad: 200, Mumbai: 200).
- 📸 **Realistic Indian PG Photos**: 3 unique high-resolution photos per property (3,600 unique photo URLs total).
- 🎨 **Vibrant Purple & Indigo UI Theme** with smooth micro-animations.
- 🔍 **Filter & Search Engine**: Filter by City, Area, Gender (Boys, Girls, Co-Living), and Budget Range.
- 📱 **Interactive Details View**: Complete amenities, room availability, image gallery modal, and direct owner contact widget.
- ⚡ **Full-Stack Integration**: Pure JS frontend supported by a Django REST backend powered by an SQLite database (`db.sqlite3`).

---

## 🚀 How to Run in VS Code

### 1. Running the Frontend
- Open `StayNest_FullStack_App/frontend/index.html` in VS Code.
- Right-click and choose **Open with Live Server** (or open `index.html` directly in any web browser).

### 2. Running the Django Backend
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
venv\Scripts\Activate.ps1

pip install django djangorestframework django-cors-headers
python manage.py runserver
```
The Django REST API will start running at `http://127.0.0.1:8000/`.

---

## 📁 Project Structure
```
StayNest_FullStack_App/
│
├── frontend/                     # Pure JS / CSS / HTML Frontend
│   ├── index.html                # Main Application Entrypoint
│   ├── css/                      # Stylesheets & Purple Theme System
│   └── js/                       # Dynamic Components & Datasets
│
├── backend/                      # Python Django REST Backend
│   ├── db.sqlite3                # Pre-seeded SQLite Database (1,200 PGs)
│   ├── dataset.json              # Raw Data JSON (1,200 PGs)
│   └── staynest_backend/         # Django Config & API Routes
│
└── README.md                     # Project Setup Guide
```
