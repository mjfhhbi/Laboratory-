#Requires -Version 5.1
<#
.SYNOPSIS
  FoodSci AI - Verify Authentic SciPy Wheel & Lockfile SHA-256 Integrity
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Dirs = @(
    (Join-Path $RepoRoot 'public\pyodide'),
    (Join-Path $RepoRoot 'android\app\src\main\assets\public\pyodide')
)

Write-Host '=== FoodSci AI: SciPy & Package Lock SHA-256 Verification ===' -ForegroundColor Cyan

foreach ($dir in $Dirs) {
    $lockPath = Join-Path $dir 'pyodide-lock.json'
    if (-not (Test-Path $lockPath)) {
        throw "Missing pyodide-lock.json in $dir"
    }

    $lock = Get-Content $lockPath -Raw | ConvertFrom-Json
    $scipyEntry = $lock.packages.scipy
    if (-not $scipyEntry) { throw "Missing scipy entry in $lockPath" }

    $scipyFile = Join-Path $dir $scipyEntry.file_name
    if (-not (Test-Path $scipyFile)) { throw "Missing SciPy wheel: $scipyFile" }

    $scipySize = (Get-Item $scipyFile).Length
    if ($scipySize -ne 47107789) {
        throw "Unexpected SciPy wheel size in ${dir}: $scipySize bytes (expected 47107789)"
    }

    $actualSciPyHash = (Get-FileHash -Path $scipyFile -Algorithm SHA256).Hash.ToLowerInvariant()
    $expectedSciPyHash = $scipyEntry.sha256.ToLowerInvariant()
    if ($actualSciPyHash -ne $expectedSciPyHash) {
        throw "SciPy SHA-256 MISMATCH in ${dir}! Expected=$expectedSciPyHash Actual=$actualSciPyHash"
    }
    Write-Host "[OK] SciPy verified in $dir ($scipySize bytes, sha256=$actualSciPyHash)" -ForegroundColor Green

    # Verify all lockfile packages present on disk match SHA-256
    $checked = 0
    foreach ($prop in $lock.packages.PSObject.Properties) {
        $pkg = $prop.Value
        $pkgPath = Join-Path $dir $pkg.file_name
        if (Test-Path $pkgPath) {
            $h = (Get-FileHash -Path $pkgPath -Algorithm SHA256).Hash.ToLowerInvariant()
            $exp = $pkg.sha256.ToLowerInvariant()
            if ($h -ne $exp) {
                throw "SHA-256 mismatch for $($pkg.file_name) in ${dir}: $h != $exp"
            }
            $checked++
        }
    }
    if ($checked -lt 17) {
        throw "Expected at least 17 verified wheels/zips in $dir, verified $checked"
    }
    Write-Host "[OK] Verified SHA-256 of all $checked lockfile wheels/archives in $dir" -ForegroundColor Green
}

Write-Host '[PASS] SciPy and all local Python wheel SHA-256 digests verified.' -ForegroundColor Green
