# Force TLS 1.2 (needed on Windows PowerShell 5.1)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# 1) Get the latest release tag from GitHub
$tagApiUrl = "https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest"
Write-Host "Checking for the latest Battorion release..."
try {
  $tagInfo = Invoke-RestMethod -Uri $tagApiUrl -Headers @{ "User-Agent" = "Battorion-Updater" } -ErrorAction Stop
} catch {
  Write-Error "Failed to fetch latest release info: $($_.Exception.Message)"
  exit 1
}

$tag = $tagInfo.tag_name.TrimStart("v")
Write-Host "Latest available version: $tag"

# 2) Build the download URL and target path
$downloadUrl   = "https://github.com/MuathHassoun/battorion-version/releases/download/v$tag/_battorion-$tag-setup.exe"
$installerPath = Join-Path $env:TEMP "battorion-$tag-setup.exe"

Write-Host "Downloading update from:"
Write-Host $downloadUrl

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

# 4) Basic sanity check on the downloaded file (100 KB minimum)
if (!(Test-Path $installerPath) -or (Get-Item $installerPath).Length -lt 1024*100) {
  Write-Error "Downloaded file missing or too small. Aborting."
  exit 1
}

# 5) Run installer (use '/S' for silent if your installer supports it)
Write-Host "Download complete. Launching installer..."
$proc = Start-Process -FilePath $installerPath -ArgumentList '/S' -Wait -PassThru
if ($proc.ExitCode -ne 0) {
  Write-Error "Installer failed with exit code $($proc.ExitCode)."
  exit $proc.ExitCode
}

Write-Host "Battorion has been successfully updated to version $tag!"
