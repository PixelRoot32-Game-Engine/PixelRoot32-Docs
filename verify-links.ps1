# Link verification script for PixelRoot32-Docs
$docsRoot = "C:\Users\gperez88\Documents\Proyects\Games\pixelroot32 workspace\PixelRoot32-Docs"

$mdFiles = Get-ChildItem -Path $docsRoot -Recurse -Filter "*.md" -Exclude "node_modules*"
$brokenLinks = @()
$totalLinks = 0

foreach ($file in $mdFiles) {
    $lines = Get-Content $file.FullName
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '\]\(([^)]+\.md)\)') {
            $links = [regex]::Matches($lines[$i], '\]\(([^)]+\.md)\)')
            foreach ($link in $links) {
                $totalLinks++
                $target = $link.Groups[1].Value
                
                # Skip external links
                if ($target -match '^https?://') {
                    continue
                }
                
                # Resolve relative path
                $fileDir = Split-Path $file.FullName -Parent
                if ($target -match '^[^/]') {
                    $fullTarget = Join-Path $fileDir $target
                } else {
                    $fullTarget = Join-Path $docsRoot $target
                }
                $fullTarget = $fullTarget.Replace('/', '\')
                
                if (-not (Test-Path $fullTarget)) {
                    $brokenLinks += [PSCustomObject]@{
                        File = $file.Name
                        Line = $i + 1
                        Link = $target
                        Note = "Target not found"
                    }
                }
            }
        }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Link Verification Report - PixelRoot32-Docs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total links checked: $totalLinks" -ForegroundColor Gray
Write-Host "Broken links found: $($brokenLinks.Count)" -ForegroundColor $(if ($brokenLinks.Count -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($brokenLinks.Count -gt 0) {
    Write-Host "Broken Links:" -ForegroundColor Red
    Write-Host "-" * 80
    $brokenLinks | ForEach-Object {
        Write-Host "  $($_.File):$($_.Line) -> $($_.Link)" -ForegroundColor Yellow
    }
} else {
    Write-Host "No broken links found!" -ForegroundColor Green
}

# Count files by folder
Write-Host ""
Write-Host "Files by folder:" -ForegroundColor Cyan
$folders = @('guide', 'api', 'architecture', 'philosophy', 'migration', 'examples', 'tools')
foreach ($folder in $folders) {
    $count = (Get-ChildItem -Path (Join-Path $docsRoot $folder) -Filter "*.md" -Recurse -ErrorAction SilentlyContinue).Count
    if ($count -gt 0) {
        Write-Host "  $folder : $count files" -ForegroundColor Gray
    }
}