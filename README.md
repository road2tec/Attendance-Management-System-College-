# Vidya Rakshak - AI-Powered attendance System 🎓🛡️

Vidya Rakshak is a modern, AI-driven attendance management system designed for educational institutions. It uses face recognition technology to automate attendance tracking and provide real-time monitoring and analytics.

## 🚀 Features
- **Face Recognition Attendance**: Automated marking via webcam (Threshold 0.45).
- **Dual Dashboards**: Dedicated interfaces for both Admin (Overview & Management) and Students (History & Profile).
- **Live Updates**: Real-time polling for instant attendance visibility on both dashboards.
- **Indoor Navigation**: Graph-based shortest path finder (Dijkstra's Algo) with interactive map visualization.
- **Robust Backend**: FastAPI server with MongoDB and MediaPipe integration.
- **Modern UI**: Clean, responsive frontend built with Next.js 15, DaisyUI, and Tailwind CSS.

## 📁 Project Structure
- `/src`: Frontend application (Next.js 15).
- `/backend`: Core logic, API routes, and AI models.
- `/public/uploads`: Storage for student profile photos.
- `start_backend.bat`: Launches the FastAPI server (Port 8001).
- `DEMO_SCRIPT.md`: Step-by-step guide for project demonstration.

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (Running on `localhost:27017`)

### 1. Backend Setup
```bash
pip install -r backend/requirements.txt
```

### 2. Frontend Setup
```bash
npm install
```

### 3. Running the Project
- **Step 1 (Backend)**: Run `.\start_backend.bat`.
- **Step 2 (Frontend)**: Run `npm run dev`.
- **Access**: Go to `http://localhost:3000` in your browser.

## ⚙️ Configuration
The system uses an `.env` file for configuration. Ensure the `MONGO_URI` is correctly set to your MongoDB instance.

## 🔒 Security
The project uses `PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python` to ensure compatibility across different Windows environments.

---
Built with ❤️ for SBPCOE.
