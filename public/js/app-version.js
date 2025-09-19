fetch("https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest")
  .then(res => res.json())
  .then(data => {
    const version = data.tag_name.replace("v", "");
    const versionText = `Version: v${version}`;

    const versionBtn = document.getElementById("version-text");
    if (versionBtn) {
      versionBtn.innerHTML = `${versionText}`;
    }

    const mainAsset = data.assets.find(asset => asset.name.includes("_battorion") && asset.name.endsWith(".exe"));
    let sizeText = "Size: N/A";
    if (mainAsset) {
      const sizeMB = (mainAsset.size / (1024 * 1024)).toFixed(2);
      sizeText = `Size: ${sizeMB} MB`;
    }

    const sizeTextSpan = document.getElementById("size-text");
    if (sizeTextSpan) {
      sizeTextSpan.innerHTML = `${sizeText}`;
    }
  }).catch(error => {
    console.error("Failed to fetch version info:", error);
  });

function openLatestReleaseInfo() {
  window.location.href = "../html/latest_version.html";
}
