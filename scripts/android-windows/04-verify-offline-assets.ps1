#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Verify Complete Offline Assets, Zero-CDN Pyodide Wiring & WebView/Manifest Settings
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$PublicPyodide = Join-Path $RepoRoot 'public\pyodide'
$ApkAssets = Join-Path $RepoRoot 'android\app\src\main\assets\public'
$ApkPyodide = Join-Path $ApkAssets 'pyodide'
$ManifestXml = Join-Path $RepoRoot 'android\app\src\main\AndroidManifest.xml'
$AppGradle = Join-Path $RepoRoot 'android\app\build.gradle'
$WorkerTs = Join-Path $RepoRoot 'src\lib\python\pythonWorker.ts'

Write-Host '=== FoodSci AI: Offline Assets & WebView Config Audit ===' -ForegroundColor Cyan

$RequiredPyodideFiles = @(
    'pyodide.mjs',
    'pyodide-lock.json',
    'pyodide.asm.js',
    'pyodide.asm.wasm',
    'python_stdlib.zip',
    'openblas-0.3.26.zip',
    'numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl',
    'scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl',
    'sympy-1.12-py3-none-any.whl',
    'pandas-2.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl',
    'matplotlib-3.5.2-cp312-cp312-pyodide_2024_0_wasm32.whl',
    'pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl',
    'fonttools-4.51.0-py3-none-any.whl',
    'mpmath-1.3.0-py3-none-any.whl',
    'pytz-2024.1-py2.py3-none-any.whl',
    'python_dateutil-2.9.0.post0-py2.py3-none-any.whl',
    'pyparsing-3.1.2-py3-none-any.whl',
    'packaging-23.2-py3-none-any.whl',
    'kiwisolver-1.4.5-cp312-cp312-pyodide_2024_0_wasm32.whl',
    'matplotlib_pyodide-0.2.2-py3-none-any.whl',
    'six-1.16.0-py2.py3-none-any.whl',
    'cycler-0.12.1-py3-none-any.whl'
)

foreach ($f in $RequiredPyodideFiles) {
    $srcFile = Join-Path $PublicPyodide $f
    $dstFile = Join-Path $ApkPyodide $f
    if (-not (Test-Path $srcFile)) { throw "Missing source Pyodide file: $srcFile" }
    if (-not (Test-Path $dstFile)) { throw "Missing synced Android Pyodide file: $dstFile" }
    $srcLen = (Get-Item $srcFile).Length
    $dstLen = (Get-Item $dstFile).Length
    if ($srcLen -ne $dstLen -or $dstLen -le 0) {
        throw "Size mismatch for $f (public=$srcLen, android=$dstLen)"
    }
}
Write-Host "[OK] All 22 local Pyodide/NumPy/SciPy/SymPy/Pandas/Matplotlib files verified in public\ and android\assets\public\" -ForegroundColor Green

# Check local HTML, precache manifest & KaTeX fonts
$apkIndex = Join-Path $ApkAssets 'index.html'
if (-not (Test-Path $apkIndex)) { throw 'Missing android\app\src\main\assets\public\index.html' }
$indexHtml = Get-Content $apkIndex -Raw
if ($indexHtml -match 'cdn\.jsdelivr\.net|unpkg\.com') {
    throw 'External CDN reference found in synced index.html!'
}
$woff2Count = @(Get-ChildItem (Join-Path $ApkAssets 'assets') -Filter '*.woff2' -ErrorAction SilentlyContinue).Count
if ($woff2Count -lt 5) { throw "Expected bundled KaTeX woff2 fonts in assets\, found $woff2Count" }
Write-Host "[OK] Bundled HTML and $woff2Count local KaTeX woff2 font files verified (zero CDN scripts)" -ForegroundColor Green

# Check Python worker zero-CDN wiring
$workerSrc = Get-Content $WorkerTs -Raw
if ($workerSrc -match 'cdn\.jsdelivr\.net|unpkg\.com' -or $workerSrc -notmatch '/pyodide/pyodide\.mjs') {
    throw 'pythonWorker.ts must load strictly from local /pyodide/pyodide.mjs with zero CDN references.'
}
Write-Host '[OK] pythonWorker.ts zero-CDN local execution verified' -ForegroundColor Green

# Check Gradle noCompress and AndroidManifest minimum permissions
$gradleText = Get-Content $AppGradle -Raw
if ($gradleText -notmatch "noCompress 'wasm', 'whl', 'zip', 'mjs', 'json'") {
    throw "android\app\build.gradle missing noCompress for wasm/whl/zip!"
}
$manifestText = Get-Content $ManifestXml -Raw
if ($manifestText -notmatch 'android\.permission\.INTERNET' -or $manifestText -notmatch 'android:usesCleartextTraffic="false"') {
    throw 'AndroidManifest.xml missing INTERNET permission or HTTPS enforcement.'
}
foreach ($forbidden in @('CAMERA', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION', 'READ_CONTACTS', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE')) {
    if ($manifestText -match "android\.permission\.$forbidden") {
        throw "Forbidden unnecessary permission in AndroidManifest.xml: $forbidden"
    }
}
Write-Host '[OK] Gradle noCompress & AndroidManifest minimal permissions verified' -ForegroundColor Green
Write-Host '[PASS] Offline Android asset bundle audit passed.' -ForegroundColor Green
