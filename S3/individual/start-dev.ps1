param(
    [switch]$NoLaunch
)

$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $rootDir "app\python"
$frontendDir = Join-Path $rootDir "app\client"

if (-not (Test-Path $backendDir)) {
    throw "Backend directory not found: $backendDir"
}

if (-not (Test-Path $frontendDir)) {
    throw "Frontend directory not found: $frontendDir"
}

$backendCommand = "Set-Location '$backendDir'; uv run uvicorn src.api.app:app --reload --host 127.0.0.1 --port 8000"
$frontendCommand = "Set-Location '$frontendDir'; pnpm dev"

Write-Host "Backend command: $backendCommand"
Write-Host "Frontend command: $frontendCommand"

if ($NoLaunch) {
    Write-Host "NoLaunch mode enabled. Nothing started."
    exit 0
}

Start-Process powershell -ArgumentList @("-NoExit", "-Command", $backendCommand)
Start-Process powershell -ArgumentList @("-NoExit", "-Command", $frontendCommand)

Write-Host "Started backend and frontend in separate PowerShell windows."
