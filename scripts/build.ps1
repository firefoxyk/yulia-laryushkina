$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $repoRoot 'dist'
$siteFiles = @('index.html', 'styles.css', 'script.js')

New-Item -ItemType Directory -Force -Path $dist | Out-Null

foreach ($file in $siteFiles) {
  Copy-Item -LiteralPath (Join-Path $repoRoot $file) -Destination (Join-Path $dist $file) -Force
}

Write-Output "Prepared $($siteFiles.Count) files in $dist"
