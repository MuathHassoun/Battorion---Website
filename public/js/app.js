const toggle = document.getElementById("theme-toggle");
const html = document.documentElement;

if (toggle) {
  toggle.addEventListener("click", () => {
    const isDark = html.dataset.theme === "dark";
    const newTheme = isDark ? "light" : "dark";
    html.dataset.theme = newTheme;

    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-circle-half-stroke", "fa-moon");
      icon.classList.add(newTheme === "dark" ? "fa-moon" : "fa-circle-half-stroke");
    }

    document.querySelectorAll(".features img").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;

      if (newTheme === "dark") {
        if (!src.includes("-dark.png")) {
          img.setAttribute("src", src.replace(/\.png$/, "-dark.png"));
        }
      } else {
        img.setAttribute("src", src.replace("-dark.png", ".png"));
      }
    });
  });
}

const modal = document.getElementById("media-modal");
const trigger = document.querySelector(".modal-trigger");
const closeBtn = document.querySelector(".close-btn");

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  const video = modal.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

if (trigger && modal) {
  trigger.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

window.addEventListener("click", e => {
  if (e.target === modal) {
    closeModal();
  }
});

// document.addEventListener("contextmenu", e => e.preventDefault());
//
// function disableSaveShortcut(e) {
//   if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
//     e.preventDefault();
//     e.stopImmediatePropagation();
//     return false;
//   }
// }
//
// document.addEventListener("keydown", disableSaveShortcut);
// document.addEventListener("keypress", disableSaveShortcut);
// window.addEventListener("beforeunload", e => {
//   if (e.ctrlKey || e.metaKey) {
//     e.preventDefault();
//     e.returnValue = '';
//   }
// });
//
// document.addEventListener("keydown", e => {
//   if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
//     e.preventDefault();
//   }
//
//   const key = e.key.toLowerCase();
//   if (
//     key === "f12" ||
//     (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(key)) ||
//     (e.ctrlKey && key === "u")
//   ) {
//     e.preventDefault();
//   }
// });

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  } if (
    key === "f12" ||
    (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(key)) ||
    (e.ctrlKey && key === "u") ||
    (e.metaKey && e.altKey && key === "i")
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

document.addEventListener("keypress", e => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

document.addEventListener("contextmenu", e => e.preventDefault());
