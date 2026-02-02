@echo off
SET PYTHONPATH=%cd%
python -m uvicorn backend.app:app --reload --host 0.0.0.0 --port 8001
pause
