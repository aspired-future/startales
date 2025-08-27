# Startales Demo Server Startup Script for Windows
# Run this script to start all demos including the new Population & Demographics Engine

Write-Host "🚀 Starting Startales Demo Server..." -ForegroundColor Green
Write-Host ""

Write-Host "📋 Available Systems:" -ForegroundColor Yellow
Write-Host "✅ Sprint 1: Core Simulation Engine"
Write-Host "✅ Sprint 2: Persistence & Event Sourcing"
Write-Host "✅ Sprint 3: Policies & Advisors"
Write-Host "✅ Sprint 4: Trade & Economy"
Write-Host "✅ Sprint 5: Population & Demographics Engine"
Write-Host ""

Write-Host "🎮 Demo Endpoints:" -ForegroundColor Cyan
Write-Host "• Main HUD Demo: http://localhost:4010/demo/hud"
Write-Host "• Persistence Demo: http://localhost:4010/demo/persistence"
Write-Host "• Policies Demo: http://localhost:4010/demo/policies"
Write-Host "• Trade Demo: http://localhost:4010/demo/trade"
Write-Host "• Population Demo: http://localhost:4010/demo/population"
Write-Host ""

Write-Host "🔗 API Endpoints:" -ForegroundColor Magenta
Write-Host "• Population Health: http://localhost:4010/api/population/health"
Write-Host "• Population Demographics: http://localhost:4010/api/population/demographics"
Write-Host "• Trade Prices: http://localhost:4010/api/trade/prices"
Write-Host "• Policies: http://localhost:4010/api/policies"
Write-Host ""

Write-Host "🔧 Starting demo server on port 4010..." -ForegroundColor Green
Write-Host ""

# Change to src directory and start the server
Set-Location -Path "src"

# Set environment variables
$env:PORT = "4010"
$env:NODE_ENV = "development"

# Start the demo server
try {
    Write-Host "Demo server has been removed. Use main server instead."
    exit 0
    # npx tsx demo/index.ts
}
catch {
    Write-Host "❌ Failed to start demo server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're in the project root directory"
    Write-Host "2. Run 'npm install' to ensure dependencies are installed"
    Write-Host "3. Check that port 4010 is available"
    Write-Host "4. Try running directly: cd src && npx tsx demo/index.ts"
    exit 1
}
