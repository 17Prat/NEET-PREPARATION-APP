Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "          MEDICQUBE — NEET-UG PRACTICE & TEST PLATFORM" -ForegroundColor Cyan
Write-Host "              Practice. Test. Analyze. Improve." -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting backend server on http://localhost:8000 ..." -ForegroundColor Green

Start-Process "http://localhost:8000"
if (Test-Path ".venv\Scripts\python.exe") {
    & .venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
} else {
    python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
}
