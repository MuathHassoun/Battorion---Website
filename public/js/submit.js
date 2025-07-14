document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const subject = form.subject.value.trim();
  const category = form.category.value;
  const message = form.message.value.trim();

  const responseDiv = document.getElementById("form-response");
  responseDiv.innerText = "⏳ Sending your message, please wait...";

  try {
    const res = await fetch("/api/telegram-handler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, subject, category, message }),
    });

    const data = await res.json();
    if (res.ok) {
      responseDiv.innerText = "✅ Thank you! We've received your message. Our support team will get back to you within 24 hours.";
      form.reset();
    } else {
      responseDiv.innerText = `❌ Error: ${data.message || "Unable to process your request. Please try again later."}`;
    }
  } catch (err) {
    responseDiv.innerText = "❌ Network error. Please check your internet connection and try again.";
  }
});
