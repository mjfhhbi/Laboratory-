#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Pre-validate, Build Signed Release APK, and Verify Bundled Pyodide/SciPy Contents
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression.FileSystem

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$AndroidDir = Join-Path $RepoRoot 'android'
$KeystorePropsPath = Join-Path $AndroidDir 'keystore.properties'
$ApkPath = Join-Path $AndroidDir 'app\build\outputs\apk\release\app-release.apk'

Write-Host '=== FoodSci AI: Build Signed Release APK (Windows) ===' -ForegroundColor Cyan

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
    Write-Host '  # Edit android\keystore.properties with your real passwords (file is git-ignored)'
    exit 1
}

if (Test-Path $KeystorePropsPath) {
    $props = @{}
    foreach ($line in (Get-Content $KeystorePropsPath)) {
        if ($line -match '^\s*([^#=]+?)\s*=\s*(.+?)\s*$') {
            $props[$matches[1]] = $matches[2]
        }
    }
    if (-not $props['storeFile'] -or $props['storePassword'] -like 'CHANGE_ME*') {
        throw 'android\keystore.properties still contains placeholder passwords or missing storeFile.'
    }
    $resolvedKs = if ([System.IO.Path]::IsPathRooted($props['storeFile'])) {
        $props['storeFile']
    } elseif (Test-Path (Join-Path $AndroidDir $props['storeFile'])) {
        Join-Path $AndroidDir $props['storeFile']
    } else {
        Join-Path (Join-Path $AndroidDir 'app') $props['storeFile']
    }
    if (-not (Test-Path $resolvedKs)) {
        throw "Keystore file not found at: $resolvedKs"
    }
}

Push-Location $AndroidDir
try {
    Write-Host "`n[STEP] Running .\gradlew.bat assembleRelease ..." -ForegroundColor Cyan
    & .\gradlew.bat assembleRelease
    if ($LASTEXITCODE -ne 0) { throw "Gradle assembleRelease failed with exit code $LASTEXITCODE" }
} finally {
    Pop-Location
}

if (-not (Test-Path $ApkPath)) {
    throw "Signed Release APK not found at expected path: $ApkPath"
}

# Verify internal APK ZIP contents (Pyodide, WASM, NumPy, SciPy, no server.cjs)
$zip = [System.IO.Compression.ZipFile]::OpenRead($ApkPath)
try {
    $entries = @{}
    foreach ($e in $zip.Entries) { $entries[$e.FullName] = $e }

    $mustHave = @(
        'assets/public/index.html',
        'assets/public/pyodide/pyodide.mjs',
        'assets/public/pyodide/pyodide-lock.json',
        'assets/public/pyodide/pyodide.asm.js',
        'assets/public/pyodide/pyodide.asm.wasm',
        'assets/public/pyodide/python_stdlib.zip',
        'assets/public/pyodide/openblas-0.3.26.zip',
        'assets/public/pyodide/numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl',
        'assets/public/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl'
    )
    foreach ($req in $mustHave) {
        if (-not $entries.ContainsKey($req)) {
            throw "CRITICAL APK DEFECT: Missing required offline asset inside APK: $req"
        }
    }
    $scipyEntry = $entries['assets/public/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl']
    if ($scipyEntry.Length -ne 47107789) {
        throw "CRITICAL APK DEFECT: SciPy length inside APK is $($scipyEntry.Length) bytes (expected 47107789)"
    }
    foreach ($key in $entries.Keys) {
        if ($key -match 'server\.cjs|\.env(\.|$)|\.keystore$|\.jks$') {
            throw "CRITICAL SECURITY DEFECT: Sensitive/server file found inside APK: $key"
        }
    }
    Write-Host "[OK] Verified all offline Pyodide/WASM/NumPy/SciPy entries inside APK (SciPy=$($scipyEntry.Length) bytes)" -ForegroundColor Green
} finally {
    $zip.Dispose()
}

# Verify APK cryptographic signature via apksigner
$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } elseif ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
$apksigner = Join-Path $sdkRoot 'build-tools\35.0.0\apksigner.bat'
& $apksigner verify --print-certs $ApkPath
if ($LASTEXITCODE -ne 0) { throw "apksigner verification failed for $ApkPath" }

$sizeMb = [math]::Round((Get-Item $ApkPath).Length / 1MB, 2)
Write-Host "`n[PASS] Signed Release APK ready: $ApkPath ($sizeMb MB)" -ForegroundColor Green
