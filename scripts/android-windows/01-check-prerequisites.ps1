#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Windows Android Release Prerequisites Check
  Verifies Windows OS, Node.js, npm, JDK 21, Android SDK 35,
  Build Tools 35.0.0, Platform Tools (adb), and Gradle Wrapper 8.11.1.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$AndroidDir = Join-Path $RepoRoot 'android'
$Failures = New-Object System.Collections.Generic.List[string]

Write-Host '=== FoodSci AI: Windows Android Prerequisites Check ===' -ForegroundColor Cyan

# 1. Node.js & npm
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    $Failures.Add('Node.js not found in PATH (install Node.js 20+ or 22 LTS).')
} else {
    $nodeVer = (& node -v).Trim()
    $major = [int](($nodeVer -replace '^v', '').Split('.')[0])
    if ($major -lt 20) {
        $Failures.Add("Node.js >= 20 required; found $nodeVer.")
    } else {
        Write-Host "[OK] Node.js: $nodeVer" -ForegroundColor Green
    }
}

$npmCmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npmCmd) { $npmCmd = Get-Command npm -ErrorAction SilentlyContinue }
if (-not $npmCmd) {
    $Failures.Add('npm not found in PATH.')
} else {
    Write-Host "[OK] npm: $((& $npmCmd.Source -v).Trim())" -ForegroundColor Green
}

# 2. JDK 21 (required by Capacitor 7 / AGP 8.7.2 / JavaVersion.VERSION_21)
$javaExe = $null
if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    $javaExe = Join-Path $env:JAVA_HOME 'bin\java.exe'
} else {
    $javaCmd = Get-Command java -ErrorAction SilentlyContinue
    if ($javaCmd) { $javaExe = $javaCmd.Source }
}

if (-not $javaExe) {
    $Failures.Add('JDK 21 not found. Set JAVA_HOME to JDK 21 directory and add %JAVA_HOME%\bin to PATH.')
} else {
    $javaVerOut = (& cmd /c "`"$javaExe`" -version 2>&1") -join "`n"
    if ($javaVerOut -match 'version "21\.') {
        Write-Host "[OK] JDK 21 detected via $javaExe" -ForegroundColor Green
    } else {
        $Failures.Add("JDK 21 is required (Capacitor 7 + AGP 8.7.2). Found: $($javaVerOut.Split("`n")[0])")
    }
}

$keytoolCmd = Get-Command keytool -ErrorAction SilentlyContinue
$keytoolExe = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin\keytool.exe' } elseif ($keytoolCmd) { $keytoolCmd.Source } else { $null }
if (-not $keytoolExe -or -not (Test-Path $keytoolExe)) {
    $Failures.Add('keytool.exe not found (should be inside %JAVA_HOME%\bin).')
} else {
    Write-Host "[OK] keytool: $keytoolExe" -ForegroundColor Green
}

# 3. Android SDK 35, Build Tools 35.0.0, Platform Tools
$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } elseif ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
if (-not (Test-Path $sdkRoot)) {
    $Failures.Add("Android SDK root not found. Set ANDROID_HOME (checked: $sdkRoot).")
} else {
    Write-Host "[OK] ANDROID_HOME: $sdkRoot" -ForegroundColor Green

    $platform35 = Join-Path $sdkRoot 'platforms\android-35\android.jar'
    if (-not (Test-Path $platform35)) {
        $Failures.Add('Android SDK Platform 35 (platforms;android-35) is missing.')
    } else {
        Write-Host '[OK] Android Platform: android-35' -ForegroundColor Green
    }

    $bt35 = Join-Path $sdkRoot 'build-tools\35.0.0'
    $apksigner = Join-Path $bt35 'apksigner.bat'
    if (-not (Test-Path $apksigner)) {
        $Failures.Add('Android Build Tools 35.0.0 (build-tools;35.0.0) is missing.')
    } else {
        Write-Host '[OK] Build Tools: 35.0.0 (apksigner.bat present)' -ForegroundColor Green
    }

    $adbExe = Join-Path $sdkRoot 'platform-tools\adb.exe'
    if (-not (Test-Path $adbExe)) {
        $Failures.Add('Android Platform Tools (platform-tools; adb.exe) is missing.')
    } else {
        $adbVer = ((& $adbExe version) | Select-Object -First 1)
        Write-Host "[OK] Platform Tools: $adbVer" -ForegroundColor Green
    }
}

# 4. Gradle Wrapper & Capacitor Dependencies
$gradlewBat = Join-Path $AndroidDir 'gradlew.bat'
$wrapperProps = Join-Path $AndroidDir 'gradle\wrapper\gradle-wrapper.properties'
if (-not (Test-Path $gradlewBat) -or -not (Test-Path $wrapperProps)) {
    $Failures.Add('Gradle wrapper (android\gradlew.bat / gradle-wrapper.properties) is missing.')
} else {
    $propText = Get-Content $wrapperProps -Raw
    if ($propText -match 'gradle-8\.11\.1') {
        Write-Host '[OK] Gradle Wrapper: 8.11.1 (compatible with Capacitor 7 & AGP 8.7.2)' -ForegroundColor Green
    } else {
        $Failures.Add('Unexpected Gradle Wrapper version in android\gradle\wrapper\gradle-wrapper.properties.')
    }
}

if (-not (Test-Path (Join-Path $RepoRoot 'node_modules\@capacitor\android'))) {
    $Failures.Add('node_modules\@capacitor\android missing. Run npm install first.')
} else {
    Write-Host '[OK] Capacitor Android dependency installed' -ForegroundColor Green
}

if ($Failures.Count -gt 0) {
    Write-Host "`n[FAIL] Missing or incompatible prerequisites:" -ForegroundColor Red
    foreach ($f in $Failures) {
        Write-Host "  - $f" -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n[PASS] All Windows Android build prerequisites are satisfied." -ForegroundColor Green
