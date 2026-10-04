@echo off
title Medicqube NEET Preparation Platform
echo ======================================================================
echo           MEDICQUBE — NEET-UG PRACTICE & TEST PLATFORM
echo               Practice. Test. Analyze. Improve.
echo ======================================================================
echo.
echo Starting backend server on http://localhost:8000 ...
echo.

start "" "http://localhost:8000"
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

pause
