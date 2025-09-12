async function readyToSubmit() {
  const responseDiv = document.getElementById("form-response");
  try {
    const saved = localStorage.getItem("pendingFeedback");
    let savedData = {};
    if (saved) savedData = JSON.parse(saved);

    const formData = new FormData();
    formData.append("name", savedData.name || "");
    formData.append("email", savedData.email || "");
    formData.append("phone", savedData.phone || "");
    formData.append("subject", savedData.subject || "");
    formData.append("category", savedData.category || "");
    formData.append("message", savedData.message || "");
    formData.append("screenshot", savedData.screenshot || "");

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
      document.getElementById("selected-file").style.display = "none";
    } else {
      responseDiv.className = "error";
      responseDiv.innerText = `❌ Error: ${data.error || "Unable to send."}`;
    }
    localStorage.removeItem("pendingFeedback");
  } catch (err) {
    responseDiv.className = "error";
    responseDiv.innerText = "❌ Error: " + err.message;
    localStorage.removeItem("pendingFeedback");
  }
}
