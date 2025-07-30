# Force TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# 1) Get latest release tag
$tagApiUrl = "https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest"
try {
  $tagInfo = Invoke-RestMethod -Uri $tagApiUrl -Headers @{ "User-Agent" = "Battorion-Updater" } -ErrorAction Stop
} catch {
  Write-Error "Failed to fetch latest release info: $($_.Exception.Message)"
  exit 1
}

$tag = $tagInfo.tag_name
$version = $tag.TrimStart("v")
Write-Host "Latest version: $version"

# 2) Build the correct download URL (FIX: use 'v$version', not 'sv$version')
$downloadUrl   = "https://github.com/MuathHassoun/battorion-version/releases/download/v$version/_battorion-$version-silent-setup.exe"
$installerPath = Join-Path $env:TEMP "battorion-$version-silent-setup.exe"

Write-Host "Downloading update from $downloadUrl"

# 3) Download with strict error handling
if (Test-Path $installerPath) { Remove-Item $installerPath -Force }
try {
  Invoke-WebRequest -Uri $downloadUrl `
    -OutFile $installerPath `
    -UserAgent 'Mozilla/5.0' `
    -TimeoutSec 600 `
    -ErrorAction Stop
} catch {
  Write-Error "Download failed: $($_.Exception.Message)"
  exit 1
}

# 4) Basic sanity check on the file
if (!(Test-Path $installerPath) -or (Get-Item $installerPath).Length -lt 1024*100) {
  Write-Error "Downloaded file missing or too small. Aborting."
  exit 1
}

# 5) Start installer (silent)
Write-Host "Starting update installer..."
$proc = Start-Process -FilePath $installerPath -ArgumentList '/S' -Wait -PassThru
if ($proc.ExitCode -ne 0) {
  Write-Error "Installer failed with exit code $($proc.ExitCode)."
  exit $proc.ExitCode
}

Write-Host "Battorion updated to version $version."
