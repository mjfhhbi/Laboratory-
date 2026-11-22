#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Install Signed Release APK onto Connected Android Device/Emulator via ADB
#>
param(
    [string]$ApkPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not $ApkPath) {
    $ApkPath = Join-Path $RepoRoot 'android\app\build\outputs\apk\release\app-release.apk'
}

Write-Host '=== FoodSci AI: Install Signed Release APK via ADB ===' -ForegroundColor Cyan

if (-not (Test-Path $ApkPath)) {
    throw "APK file not found: $ApkPath. Run 07-build-release-apk.ps1 first."
}

$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } elseif ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
$adbExe = Join-Path $sdkRoot 'platform-tools\adb.exe'
if (-not (Test-Path $adbExe)) {
    $cmd = Get-Command adb -ErrorAction SilentlyContinue
    if (-not $cmd) { throw 'adb.exe not found in ANDROID_HOME\platform-tools or PATH.' }
    $adbExe = $cmd.Source
}

$devicesOut = & $adbExe devices
$readyDevices = @($devicesOut | Where-Object { $_ -match '^\S+\s+device$' })
if ($readyDevices.Count -eq 0) {
    throw "No authorized Android device or emulator connected.`n$($devicesOut -join "`n")"
}
Write-Host "[OK] Connected device detected: $($readyDevices[0])" -ForegroundColor Green

Write-Host "[STEP] Installing $ApkPath ..." -ForegroundColor Cyan
& $adbExe install -r $ApkPath
if ($LASTEXITCODE -ne 0) { throw "adb install failed with exit code $LASTEXITCODE" }

Write-Host '[STEP] Launching ir.foodscienceai.app/.MainActivity ...' -ForegroundColor Cyan
& $adbExe shell am start -n ir.foodscienceai.app/.MainActivity
if ($LASTEXITCODE -ne 0) { throw "Failed to launch MainActivity" }

Write-Host "`n[PASS] Installed and launched FoodSci AI on Android." -ForegroundColor Green
Write-Host "Monitor live logs with:" -ForegroundColor Yellow
Write-Host "  `"$adbExe`" logcat -s Capacitor Console chromium AndroidRuntime"
