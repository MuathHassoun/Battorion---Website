$version = "1.2.0" # Change this to the desired version number

$downloadUrl = "https://github.com/MuathHassoun/battorion-version/releases/download/sv$version/_battorion-$version-silent-setup.exe"
$installerPath = "$env:TEMP\battorion-setup.exe"
Start-BitsTransfer -Source $downloadUrl -Destination $installerPath
Start-Process -FilePath $installerPath -ArgumentList "/silent" -Wait
