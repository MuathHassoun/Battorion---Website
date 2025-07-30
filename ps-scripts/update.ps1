# Force TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Remove-FileSafely {
  param([string]$Path, [int]$Retries = 5, [int]$DelayMs = 500)
  if (-not (Test-Path $Path)) { return }
  for ($i=1; $i -le $Retries; $i++) {
    try {
      Remove-Item $Path -Force -ErrorAction Stop
      Write-Host "Deleted: $Path"
      return
    } catch {
      if ($i -eq $Retries) {
        Write-Warning "Couldn't delete $Path: $($_.Exception.Message)"
      } else {
        Start-Sleep -Milliseconds $DelayMs
      }
    }
  }
}

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

# 2) Build the correct download URL
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

if ($proc.ExitCode -eq 0) {
  Write-Host "Battorion updated to version $version."
  # 6) Delete installer after successful run
  Remove-FileSafely -Path $installerPath
} else {
  Write-Error "Installer failed with exit code $($proc.ExitCode). Keeping the installer for troubleshooting: $installerPath"
  exit $proc.ExitCode
}
