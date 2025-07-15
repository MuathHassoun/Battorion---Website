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

  try {
    const res = await fetch("/api/telegram-handler", {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Response is not JSON:", text);
      responseDiv.className = "error";
      responseDiv.innerText = "❌ Server returned an invalid response (not JSON).";
      return;
    }

    const data = await res.json();
    if (res.ok) {
      responseDiv.className = "success";
      responseDiv.innerText = `✅ Thank you! Your message has been received. Our team will contact you soon.${data.result === 'with_image' ? ' 📎 Your screenshot was attached successfully.' : ''}`;
      form.reset();
      document.getElementById("selected-file").style.display = "none";
    } else {
      responseDiv.className = "error";
      responseDiv.innerText = `❌ Error: ${data.error || "Unable to send."}`;
    }
  } catch (err) {
    responseDiv.className = "error";
    responseDiv.innerText = "❌ Error: " + err.message;
  }
});
