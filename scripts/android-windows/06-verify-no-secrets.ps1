#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Verify Zero server.cjs and Zero Secrets/API Keys in Android Package Assets
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$DistDir = Join-Path $RepoRoot 'dist'
$ApkAssets = Join-Path $RepoRoot 'android\app\src\main\assets\public'
$GitIgnorePath = Join-Path $RepoRoot '.gitignore'

Write-Host '=== FoodSci AI: Secrets & Server Bundle Leakage Audit ===' -ForegroundColor Cyan

# 1. Forbidden files inside APK assets
$ForbiddenNames = @('server.cjs', 'server.cjs.map', '.env', '.env.local', '.env.production', 'keystore.properties', 'android-signing.keystore')
foreach ($name in $ForbiddenNames) {
    $p = Join-Path $ApkAssets $name
    if (Test-Path $p) {
        throw "SECURITY / BUNDLE ERROR: Forbidden file present in APK assets: $p"
    }
}
$keystoreMatches = @(Get-ChildItem -Path $ApkAssets -Recurse -Include '*.keystore', '*.jks', '*.p12', '.env*' -ErrorAction SilentlyContinue)
if ($keystoreMatches.Count -gt 0) {
    throw "SECURITY ERROR: Sensitive file found in APK assets: $($keystoreMatches[0].FullName)"
}
Write-Host '[OK] Zero server.cjs, .env, or keystore files inside android\app\src\main\assets\public\' -ForegroundColor Green

# 2. Scan bundled JS/HTML/JSON in dist/ and APK assets for leaked API keys or private keys
$ScanTargets = @()
if (Test-Path $DistDir) { $ScanTargets += $DistDir }
$ScanTargets += $ApkAssets

$Patterns = @(
    @{ Name = 'Google API Key (AIza...)'; Regex = 'AIza[0-9A-Za-z_-]{35}' },
    @{ Name = 'PEM Private Key'; Regex = '-----BEGIN [A-Z ]*PRIVATE KEY-----' },
    @{ Name = 'GEMINI_API_KEY token'; Regex = 'GEMINI_API_KEY' }
)

foreach ($dir in $ScanTargets) {
    $files = Get-ChildItem -Path $dir -Recurse -File -Include '*.html', '*.js', '*.mjs', '*.css', '*.json' | Where-Object {
        $_.Name -ne 'server.cjs' -and $_.Name -ne 'server.cjs.map'
    }
    foreach ($file in $files) {
        $text = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $text) { continue }
        foreach ($pat in $Patterns) {
            if ($text -match $pat.Regex) {
                throw "SECRET LEAK DETECTED ($($pat.Name)) in $($file.FullName)"
            }
        }
        if ($env:GEMINI_API_KEY -and $env:GEMINI_API_KEY.Length -ge 12 -and $text.Contains($env:GEMINI_API_KEY)) {
            throw "ACTIVE GEMINI_API_KEY VALUE LEAKED into $($file.FullName)"
        }
    }
}
Write-Host '[OK] Zero API keys, private keys, or GEMINI_API_KEY references in dist\ and APK assets' -ForegroundColor Green

# 3. Verify .gitignore keeps secrets out of Git
$gitIgnore = Get-Content $GitIgnorePath -Raw
foreach ($rule in @('.env*', 'android/keystore.properties', '*.keystore', '*.jks')) {
    if ($gitIgnore -notmatch [regex]::Escape($rule)) {
        throw ".gitignore is missing required secret exclusion: $rule"
    }
}
Write-Host '[OK] .gitignore exclusions verified (.env*, keystore.properties, *.keystore, *.jks)' -ForegroundColor Green
Write-Host '[PASS] Secrets & server bundle isolation audit passed.' -ForegroundColor Green
