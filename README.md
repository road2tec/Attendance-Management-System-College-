# SCOE - AI-Powered Attendance System 🎓🛡️

**Sinhgad College Of Engineering - Attendance Management System** is a modern, AI-driven platform designed for automated student tracking. It utilizes face recognition technology (MediaPipe) to provide seamless attendance and real-time monitoring.

## 🚀 Features
- **Face Recognition Attendance**: Automated marking via webcam (Optimized Threshold: 0.45).
- **Security Alerts**: Real-time unknown person detection alerts.
- **Dual Dashboards**: Dedicated Admin and Student interfaces for comprehensive management.
- **Smart Charts**: Visual analytics for daily and weekly attendance trends.
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and DaisyUI for a premium experience.

## 📁 Project Structure
- `/src`: Next.js 15 Frontend.
- `/backend`: FastAPI (Python) server & AI logic.
- `/public/uploads`: Storage for student profile photos.
- `.env`: Global environment configuration.

## 🛠️ Setup & Run

### 1. Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB (Running on `localhost:27017`)

### 2. Backend Installation & Start
From the **root folder**, run:
```powershell
# Install dependencies
pip install -r backend/requirements.txt

# Start the server (Port 8001)
python -m uvicorn backend.app:app --reload --port 8001
```
### 3. Frontend Installation & Start
From the **root folder**, run:
```powershell
# Install dependencies
npm install

# Start the application (Port 3000)
npm run dev
```

## 🔒 Default Credentials
Access the Admin Dashboard using:
- **Email**: `admin@jspmntc.edu.in`
- **Password**: `Admin@123`

## ⚙️ Configuration
The system uses an `.env` file. Ensure `MONGO_URI` is correctly set. The API is configured to use `127.0.0.1:8001` for maximum compatibility on Windows.

---
Developed for **Sinhgad College Of Engineering, Pune**.
