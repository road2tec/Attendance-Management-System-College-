# Vidya Rakshak - AI-Powered Attendance System 🎓🛡️

Vidya Rakshak is a modern, AI-driven attendance management system designed for educational institutions. It uses face recognition technology to automate attendance tracking and provide real-time monitoring and analytics.

## 🚀 Features
- **Face Recognition Attendance**: Automated marking via webcam (Threshold 0.45).
- **Security Alerts**: Real-time alerts for unknown person detection during live monitoring.
- **Dual Dashboards**: Dedicated interfaces for both Admin (Overview & Management) and Students (History & Profile).
- **Live Updates**: Real-time polling for instant attendance visibility on both dashboards.
- **Indoor Navigation**: Graph-based shortest path finder (Dijkstra's Algo) with interactive map visualization.
- **Robust Backend**: FastAPI server with MongoDB and MediaPipe integration.
- **Modern UI**: Clean, responsive frontend built with Next.js 15, DaisyUI, and Tailwind CSS.
- **Campus Gallery**: Integrated gallery for campus and sports events.

## 📁 Project Structure
- `/src`: Frontend application (Next.js 15).
- `/backend`: Core logic, API routes, and AI models.
- `/public/gallery`: Institutional and event photos.
- `/public/uploads`: Storage for student profile photos.
- `start_backend.bat`: Launches the FastAPI server (Port 8001).
- `DEMO_SCRIPT.md`: Step-by-step guide for project demonstration.

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (Running on `localhost:27017`)

### 1. Backend Setup
Navigate to the root directory and run:
```bash
pip install -r backend/requirements.txt
```
> [!NOTE]
> We use `protobuf==3.20.3` to ensure compatibility with MediaPipe in Windows environments.

### 2. Frontend Setup
Navigate to the root directory and run:
```bash
npm install
```

### 3. Running the Project

#### **Option A: Automated Start (Recommended)**
Run the batch files provided in the root directory:
1. Run `.\start_backend.bat` to start the FastAPI server.
2. In a separate terminal, run `npm run dev` to start the Next.js frontend.

#### **Option B: Manual Start**
**Backend:**
```bash
cd backend
python -m uvicorn app:app --reload --port 8001
```

**Frontend:**
```bash
npm run dev
```

### 4. Accessing the System
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8001/docs](http://localhost:8001/docs)

## ⚙️ Configuration
The system uses an `.env` file for configuration. Ensure the `MONGO_URI` is correctly set to your MongoDB instance.

## 🔒 Security
The project uses `PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python` to ensure compatibility across different Windows environments. Automated alerts are triggered when unverified individuals are detected.

---
Built with ❤️ for SBPCOE.
