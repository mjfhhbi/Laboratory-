#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Pre-validate, Build Signed Release AAB (Google Play App Bundle), and Verify Contents
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression.FileSystem

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$AndroidDir = Join-Path $RepoRoot 'android'
$KeystorePropsPath = Join-Path $AndroidDir 'keystore.properties'
$AabPath = Join-Path $AndroidDir 'app\build\outputs\bundle\release\app-release.aab'

Write-Host '=== FoodSci AI: Build Signed Release AAB (Windows) ===' -ForegroundColor Cyan

# Run standalone pre-build audits
& (Join-Path $PSScriptRoot '01-check-prerequisites.ps1')
& (Join-Path $PSScriptRoot '04-verify-offline-assets.ps1')
& (Join-Path $PSScriptRoot '05-verify-scipy-sha256.ps1')
& (Join-Path $PSScriptRoot '06-verify-no-secrets.ps1')

# Validate Release Keystore configuration
$hasEnvSigning = $env:FOODSCI_KEYSTORE_PATH -and $env:FOODSCI_KEYSTORE_PASS -and $env:FOODSCI_KEY_PASS
if (-not (Test-Path $KeystorePropsPath) -and -not $hasEnvSigning) {
    Write-Host "`n[ERROR] Release signing keystore is not configured." -ForegroundColor Red
    Write-Host "Create a keystore once and configure android\keystore.properties:" -ForegroundColor Yellow
    Write-Host '  keytool -genkey -v -keystore android-signing.keystore -alias foodscienceai -keyalg RSA -keysize 2048 -validity 10000'
    Write-Host '  Copy-Item android\keystore.properties.example android\keystore.properties'
    exit 1
}

Push-Location $AndroidDir
try {
    Write-Host "`n[STEP] Running .\gradlew.bat bundleRelease ..." -ForegroundColor Cyan
    & .\gradlew.bat bundleRelease
    if ($LASTEXITCODE -ne 0) { throw "Gradle bundleRelease failed with exit code $LASTEXITCODE" }
} finally {
    Pop-Location
}

if (-not (Test-Path $AabPath)) {
    throw "Signed Release AAB not found at expected path: $AabPath"
}

# Verify internal AAB ZIP contents (base/assets/public/pyodide/...)
$zip = [System.IO.Compression.ZipFile]::OpenRead($AabPath)
try {
    $entries = @{}
    foreach ($e in $zip.Entries) { $entries[$e.FullName] = $e }

    $mustHave = @(
        'base/assets/public/index.html',
        'base/assets/public/pyodide/pyodide.mjs',
        'base/assets/public/pyodide/pyodide-lock.json',
        'base/assets/public/pyodide/pyodide.asm.js',
        'base/assets/public/pyodide/pyodide.asm.wasm',
        'base/assets/public/pyodide/python_stdlib.zip',
        'base/assets/public/pyodide/openblas-0.3.26.zip',
        'base/assets/public/pyodide/numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl',
        'base/assets/public/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl'
    )
    foreach ($req in $mustHave) {
        if (-not $entries.ContainsKey($req)) {
            throw "CRITICAL AAB DEFECT: Missing required offline asset inside AAB: $req"
        }
    }
    $scipyEntry = $entries['base/assets/public/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl']
    if ($scipyEntry.Length -ne 47107789) {
        throw "CRITICAL AAB DEFECT: SciPy length inside AAB is $($scipyEntry.Length) bytes (expected 47107789)"
    }
    foreach ($key in $entries.Keys) {
        if ($key -match 'server\.cjs|\.env(\.|$)|\.keystore$|\.jks$') {
            throw "CRITICAL SECURITY DEFECT: Sensitive/server file found inside AAB: $key"
        }
    }
    Write-Host "[OK] Verified all offline Pyodide/WASM/NumPy/SciPy entries inside AAB (SciPy=$($scipyEntry.Length) bytes)" -ForegroundColor Green
} finally {
    $zip.Dispose()
}

# Verify AAB JAR signature via JDK jarsigner
$jarsigner = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin\jarsigner.exe' } else { 'jarsigner' }
& $jarsigner -verify -strict $AabPath | Out-Null
if ($LASTEXITCODE -ne 0) { throw "jarsigner verification failed for $AabPath" }

$sizeMb = [math]::Round((Get-Item $AabPath).Length / 1MB, 2)
Write-Host "`n[PASS] Signed Release AAB ready: $AabPath ($sizeMb MB)" -ForegroundColor Green
