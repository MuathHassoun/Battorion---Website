function tryLaunchBattorion() {
  let pageHidden = false;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'battorion://launch';
  document.body.appendChild(iframe);
  const handleBlur = () => {
    pageHidden = true;
  };

  window.addEventListener('blur', handleBlur);

  setTimeout(() => {
    window.removeEventListener('blur', handleBlur);
    document.body.removeChild(iframe);
    if (!pageHidden) {
      showNotification(
        'Battorion is not installed',
        'It looks like Battorion is not installed. Click to download it now.',
        '⚠️',
        () => {
          window.location.href = './html/downloading.html';
        }
      );
    }
  }, 1500);
}

function showNotification(title, message, icon, onClick) {
  const old = document.querySelector('.notification');
  if (old) old.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-icon">${icon}</div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-body">${message}</div>
    </div>
  `;

  notification.addEventListener('click', () => {
    onClick?.();
    notification.remove();
  });

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 6000);
}

// function setButtonsVisibility(isInstalled) {
//   const downloadBtn = document.getElementById('download-btn');
//   const updateBtn = document.getElementById('update-btn');
//   const launchBtn = document.getElementById('launch-btn');
//
//   if (isInstalled) {
//     downloadBtn.style.display = 'none';
//     updateBtn.style.display = 'inline-block';
//     launchBtn.style.display = 'inline-block';
//   } else {
//     downloadBtn.style.display = 'inline-block';
//     updateBtn.style.display = 'none';
//     launchBtn.style.display = 'none';
//   }
// }
//
// window.addEventListener('DOMContentLoaded', () => {
//   let pageHidden = false;
//   const iframe = document.createElement('iframe');
//   iframe.style.display = 'none';
//   iframe.src = 'battorion://launch';
//   document.body.appendChild(iframe);
//
//   const handleBlur = () => {
//     pageHidden = true;
//   };
//   window.addEventListener('blur', handleBlur);
//
//   setTimeout(() => {
//     window.removeEventListener('blur', handleBlur);
//     document.body.removeChild(iframe);
//     setButtonsVisibility(pageHidden);
//   }, 1500);
// });
