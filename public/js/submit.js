document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const screenshotInput = document.getElementById("screenshotInput");
  const file = screenshotInput.files[0];

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const responseDiv = document.getElementById("form-response");
  responseDiv.style.display = "block";
  responseDiv.className = "";
  responseDiv.innerText = "⏳ Sending your message, please wait...";

  if (file && (!file.type || !allowedTypes.includes(file.type))) {
    responseDiv.className = "error";
    responseDiv.innerText = "❌ Only image files are allowed (JPG, PNG, WebP, GIF).";
    return;
  } if (file && file.size === 0) {
    responseDiv.className = "error";
    responseDiv.innerText = "❌ Selected file is empty.";
    return;
  }

  const formData = new FormData();
  formData.append("name", form.name.value.trim());
  formData.append("email", form.email.value.trim());
  formData.append("phone", form.phone.value.trim());
  formData.append("subject", form.subject.value.trim());
  formData.append("category", form.category.value);
  formData.append("message", form.message.value.trim());
  if (file) formData.append("screenshot", file);

  form.reset();
  localStorage.setItem('pendingFeedback', JSON.stringify(formData));
  window.location.href = "https://battorion-ap-is.vercel.app/?email=" + form.email.value.trim();
});
