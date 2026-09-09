# Chandrayaan-2 Lunar Image Registration Tool - Asset Downloader Script
# Project ID: 14189522672321664032
# Screen ID: d42aaddd854e4f6d80fbd134a66a8890

$TargetDir = "e:\Saloni - project\assets"
if (!(Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Force -Path $TargetDir
}

Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host " CHANDRAYAAN-2 LUNAR IMAGE REGISTRATION TOOL - ASSET DOWNLOADER          " -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan

$Assets = @(
    @{ Name = "chandrayaan2_ohrc_base.jpg"; Url = "https://images-assets.nasa.gov/image/PIA23440/PIA23440~orig.jpg" },
    @{ Name = "chandrayaan2_tmc2_target.jpg"; Url = "https://images-assets.nasa.gov/image/PIA23441/PIA23441~orig.jpg" },
    @{ Name = "isro_chandrayaan2_logo.png"; Url = "https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg" }
)

foreach ($asset in $Assets) {
    $outputPath = Join-Path $TargetDir $asset.Name
    Write-Host "Downloading $($asset.Name) using curl -L ..." -ForegroundColor Yellow
    try {
        curl.exe -L $asset.Url -o $outputPath
        if (Test-Path $outputPath) {
            $size = (Get-Item $outputPath).Length
            Write-Host "  [SUCCESS] $($asset.Name) ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "  [FAILED] Could not verify $($asset.Name)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "Asset download sequence finished." -ForegroundColor Cyan
