fetch("https://api.github.com/repos/MuathHassoun/battorion-version/releases/latest")
  .then(res => res.json())
  .then(data => {
    const version = data.tag_name.replace("v", "");
    const versionText = `Version: v${version}`;

    const versionBtn = document.getElementById("version-text");
    if (versionBtn) {
      versionBtn.innerHTML = `${versionText}`;
    }
  })
  .catch(error => {
    console.error("Failed to fetch version info:", error);
  });
