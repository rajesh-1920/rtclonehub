window.RTHub.setupMobileNav();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill all fields before submitting.";
      formStatus.className = "error";
      return;
    }

    formStatus.textContent = "Thanks! Your message is saved locally in this demo.";
    formStatus.className = "success";
    contactForm.reset();
  });
}
