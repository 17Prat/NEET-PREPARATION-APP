@echo off
title PrepWise NEET Preparation Platform
echo ======================================================================
echo           PREPWISE — NEET-UG PRACTICE & TEST PLATFORM
echo               Practice. Test. Analyze. Improve.
echo ======================================================================
echo.
echo Starting backend server on http://localhost:8000 ...
echo.

start "" "http://localhost:8000"
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

pause
