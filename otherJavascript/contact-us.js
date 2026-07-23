// BRIGHT COLLECTIONS — CONTACT PAGE
// Builds a formatted message from the contact form and opens it
// as a pre-filled WhatsApp chat, same no-backend pattern as checkout.

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#contact-name").value.trim();
    const email = document.querySelector("#contact-email").value.trim();
    const message = document.querySelector("#contact-message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    let text = "👋 *New Message — Bright Collections*\n\n";
    text += `*Name:* ${name}\n`;
    text += `*Email:* ${email}\n\n`;
    text += `*Message:*\n${message}`;

    const phoneNumber = "2349165932331"; // matches the number used elsewhere on the site
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
    form.reset();
  });

});