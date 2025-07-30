$version = "1.2.3"  # Change this to the desired version number
$repo = "MuathHassoun/battorion-version"
$url = "https://github.com/$repo/releases/download/v$version/_battorion-$version-setup.exe"
$installerPath = "$env:TEMP\battorion-$version-setup.exe"
Remove-Item $installerPath -ErrorAction SilentlyContinue
Write-Host "Downloading from: $url"
try {
    Invoke-WebRequest -Uri $url -OutFile $installerPath -ErrorAction Stop
    Write-Host "Download successful. Starting installer..."
    Start-Process -FilePath $installerPath -ArgumentList '/S' -Wait
    Remove-Item $installerPath
    Write-Host "Installation completed."
} catch {
    Write-Error "Download or installation failed: $_"
}
