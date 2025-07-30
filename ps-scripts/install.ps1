# Get the latest release tag from GitHub
$tagApiUrl = "https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest"
Write-Host "Checking for the latest Battorion release..."
$tagInfo = Invoke-RestMethod -Uri $tagApiUrl -Headers @{ "User-Agent" = "Battorion-Updater" }

$tag = $tagInfo.tag_name.TrimStart("v")
Write-Host "Latest available version: $tag"

# Construct the download URL for the specific version
$downloadUrl = "https://github.com/MuathHassoun/battorion-version/releases/download/v$tag/_battorion-$tag-setup.exe"
$installerPath = "$env:TEMP\battorion-installer.exe"

Write-Host "Downloading update from:"
Write-Host $downloadUrl

Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath

Write-Host "Download complete. Launching installer..."
Start-Process $installerPath -Wait

Write-Host "Battorion has been successfully updated to version $tag!"
