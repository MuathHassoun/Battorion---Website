# Get latest release tag
$tagApiUrl = "https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest"
$tagInfo = Invoke-RestMethod -Uri $tagApiUrl -Headers @{ "User-Agent" = "Battorion-Updater" }

$tag = $tagInfo.tag_name
$version = $tag.TrimStart("v")

Write-Host "Latest version: $version"

# Construct the download URL
$downloadUrl = "https://github.com/MuathHassoun/battorion-version/releases/download/sv$version/_battorion-$version-silent-setup.exe"
$installerPath = "$env:TEMP\battorion-update.exe"

Write-Host "Downloading update from $downloadUrl"
Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath

Write-Host "Starting update installer..."
Start-Process $installerPath -Wait

Write-Host "Battorion updated to version $version."
