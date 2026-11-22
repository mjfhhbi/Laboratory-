#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Sync Production Web Bundle (dist/) into Capacitor Android Project
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$AndroidPublicDir = Join-Path $RepoRoot 'android\app\src\main\assets\public'
$AndroidCapConfig = Join-Path $RepoRoot 'android\app\src\main\assets\capacitor.config.json'

Push-Location $RepoRoot
try {
    Write-Host '=== FoodSci AI: Capacitor Android Sync ===' -ForegroundColor Cyan

    if (-not (Test-Path (Join-Path $RepoRoot 'dist\index.html'))) {
        throw 'dist\index.html not found. Run 02-build-web.ps1 first.'
    }

    & npx.cmd cap sync android
    if ($LASTEXITCODE -ne 0) { throw "npx cap sync android failed with exit code $LASTEXITCODE" }

    # Ensure server bundles never remain inside APK assets
    foreach ($leaked in @('server.cjs', 'server.cjs.map')) {
        $p = Join-Path $AndroidPublicDir $leaked
        if (Test-Path $p) {
            Remove-Item $p -Force
            Write-Host "[CLEAN] Removed $leaked from APK assets" -ForegroundColor Yellow
        }
    }

    if (-not (Test-Path $AndroidCapConfig)) {
        throw 'android\app\src\main\assets\capacitor.config.json missing after cap sync.'
    }

    $cfg = Get-Content $AndroidCapConfig -Raw | ConvertFrom-Json
    if ($cfg.appId -ne 'ir.foodscienceai.app') { throw "Unexpected appId: $($cfg.appId)" }
    if ($cfg.server.androidScheme -ne 'https') { throw "Unexpected androidScheme: $($cfg.server.androidScheme)" }
    if ($cfg.android.allowMixedContent -ne $false) { throw 'allowMixedContent must be false' }
    if ($cfg.android.webContentsDebuggingEnabled -ne $false) { throw 'webContentsDebuggingEnabled must be false for Release' }

    Write-Host "[OK] Synced assets verified (appId=$($cfg.appId), androidScheme=$($cfg.server.androidScheme), debug=false)" -ForegroundColor Green
} finally {
    Pop-Location
}
