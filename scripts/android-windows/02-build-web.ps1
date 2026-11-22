#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Build Production Web Bundle (dist/) for Capacitor Android
.PARAMETER ApiBaseUrl
  Optional HTTPS backend origin for online Gemini AI chat inside APK
  (e.g. https://ais-pre-6a6myoakvhla3xjetelp5j-246919081791.europe-west2.run.app).
  Leave empty for standalone offline-first APK.
#>
param(
    [string]$ApiBaseUrl = $env:VITE_API_BASE_URL
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Push-Location $RepoRoot

try {
    Write-Host '=== FoodSci AI: Production Web Build ===' -ForegroundColor Cyan

    if ($env:VITE_GEMINI_API_KEY) {
        throw 'SECURITY ABORT: VITE_GEMINI_API_KEY is set in environment! Never expose GEMINI_API_KEY via VITE_* client variables.'
    }

    if (-not [string]::IsNullOrWhiteSpace($ApiBaseUrl)) {
        $trimmed = $ApiBaseUrl.Trim().TrimEnd('/')
        if ($trimmed -notmatch '^https://[a-zA-Z0-9.-]+(:\d+)?$') {
            throw "VITE_API_BASE_URL must use HTTPS (Android usesCleartextTraffic=false). Got: $ApiBaseUrl"
        }
        $env:VITE_API_BASE_URL = $trimmed
        Write-Host "[INFO] VITE_API_BASE_URL set to: $trimmed" -ForegroundColor Cyan
    } else {
        Remove-Item Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue
        Write-Host '[INFO] VITE_API_BASE_URL is empty (100% standalone offline APK; online AI chat disabled unless configured).' -ForegroundColor Yellow
    }

    Write-Host '[STEP] Ensuring local Pyodide 0.26.4 & SciPy assets (npm run pyodide:restore)...' -ForegroundColor Cyan
    & node (Join-Path $RepoRoot 'scripts\restore-pyodide.mjs')
    if ($LASTEXITCODE -ne 0) { throw "Pyodide asset restore/verification failed with exit code $LASTEXITCODE" }

    Write-Host '[STEP] Running TypeScript check (npm run lint)...' -ForegroundColor Cyan
    & npm.cmd run lint
    if ($LASTEXITCODE -ne 0) { throw "TypeScript lint failed with exit code $LASTEXITCODE" }

    Write-Host '[STEP] Building Vite production bundle (npx vite build)...' -ForegroundColor Cyan
    & npx.cmd vite build
    if ($LASTEXITCODE -ne 0) { throw "Vite build failed with exit code $LASTEXITCODE" }

    $distIndex = Join-Path $RepoRoot 'dist\index.html'
    $distPrecache = Join-Path $RepoRoot 'dist\precache-manifest.json'
    if (-not (Test-Path $distIndex) -or -not (Test-Path $distPrecache)) {
        throw 'Expected dist\index.html or dist\precache-manifest.json was not generated.'
    }

    Write-Host '[PASS] Web Production bundle built cleanly at dist\' -ForegroundColor Green
} finally {
    Pop-Location
}
