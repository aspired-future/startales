# PowerShell script to open the Comprehensive HUD in Windows browser
Write-Host "🚀 Opening Witty Galaxy Comprehensive HUD in Windows browser..."
Write-Host ""
Write-Host "🌐 URL: http://localhost:5174"
Write-Host "📋 This will open the complete Witty Galaxy Command Center"
Write-Host ""

# Open in default browser
Start-Process "http://localhost:5174"

Write-Host "✅ Browser should now be opening!"
Write-Host ""
Write-Host "🎮 WHAT YOU SHOULD SEE:"
Write-Host "  🌌 Witty Galaxy Command Center header"
Write-Host "  🏛️ Left panel with all major systems (Government, Economy, Security, etc.)"
Write-Host "  🎭 Center panel with character communications and Game Master events"
Write-Host "  📊 Right panel with live metrics and alerts"
Write-Host ""
Write-Host "🔧 NAVIGATION:"
Write-Host "  • Click any system in the left panel to explore"
Write-Host "  • Character messages appear in the center"
Write-Host "  • Live metrics update on the right"
Write-Host ""
Write-Host "💡 If the page doesn't load, make sure React UI is running: npm run ui"
