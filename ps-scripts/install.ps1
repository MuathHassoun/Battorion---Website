# Force TLS 1.2 (needed on Windows PowerShell 5.1)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Remove-FileSafely {
  param([string]$Path, [int]$Retries = 5, [int]$DelayMs = 500)
  if (-not (Test-Path $Path)) { return }
  for ($i=1; $i -le $Retries; $i++) {
    try {
      Remove-Item $Path -Force -ErrorAction Stop
      Write-Host "Deleted temporary file: $Path"
      return
    } catch {
      if ($i -eq $Retries) {
        Write-Warning "Couldn't delete ${Path}: $($_.Exception.Message)"
      } else {
        Start-Sleep -Milliseconds $DelayMs
      }
    }
  }
}

# 1) Get the latest release tag from GitHub
$tagApiUrl = "https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest"
Write-Host "Fetching the latest Battorion version..."
try {
  $tagInfo = Invoke-RestMethod -Uri $tagApiUrl -Headers @{ "User-Agent" = "Battorion-Installer" } -ErrorAction Stop
} catch {
  Write-Error "Failed to fetch release info: $($_.Exception.Message)"
  exit 1
}

$tag = $tagInfo.tag_name.TrimStart("v")
Write-Host "Latest version available: $tag"

# 2) Build the download URL and target path
$downloadUrl   = "https://github.com/MuathHassoun/battorion-version/releases/download/v$tag/_battorion-$tag-setup.exe"
$installerPath = Join-Path $env:TEMP "battorion-$tag-setup.exe"

Write-Host "Starting download from:"
Write-Host $downloadUrl

# Use BitsTransfer instead of Invoke-WebRequest for reliability
Import-Module BitsTransfer -ErrorAction Stop

if (Test-Path $installerPath) { Remove-Item $installerPath -Force }
try {
  Start-BitsTransfer -Source $downloadUrl -Destination $installerPath
} catch {
  Write-Error "Download failed: $($_.Exception.Message)"
  exit 1
}

# 4) Basic sanity check on the downloaded file (100 KB minimum)
if (!(Test-Path $installerPath) -or (Get-Item $installerPath).Length -lt 1024*100) {
  Write-Error "Downloaded file is missing or seems incomplete. Aborting."
  exit 1
}

# 5) Run installer (use '/S' for silent if supported)
Write-Host "Download complete. Installing Battorion..."
$proc = Start-Process -FilePath $installerPath -ArgumentList '/S' -Wait -PassThru

if ($proc.ExitCode -eq 0) {
  Write-Host "Battorion has been successfully installed (version $tag)."
  Remove-FileSafely -Path $installerPath
} else {
  Write-Error "Installation failed with exit code $($proc.ExitCode). Installer retained for troubleshooting: $installerPath"
  exit $proc.ExitCode
}
