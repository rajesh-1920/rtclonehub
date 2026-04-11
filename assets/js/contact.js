const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const messageField = document.getElementById("message");
const messageCount = document.getElementById("messageCount");
const submitBtn = document.getElementById("submitBtn");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function markFieldError(field, hasError) {
  if (!field) {
    return;
  }

  field.classList.toggle("input-error", hasError);
}

function updateMessageCounter() {
  if (!messageField || !messageCount) {
    return;
  }

  const currentLength = messageField.value.trim().length;
  messageCount.textContent = `${currentLength} / 500`;
}

if (contactForm && formStatus) {
  updateMessageCounter();

  if (messageField) {
    messageField.addEventListener("input", updateMessageCounter);
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    const nameError = name.length < 2;
    const emailError = !emailPattern.test(email);
    const subjectError = subject.length === 0;
    const messageError = message.length < 15;

    markFieldError(contactForm.name, nameError);
    markFieldError(contactForm.email, emailError);
    markFieldError(contactForm.subject, subjectError);
    markFieldError(contactForm.message, messageError);

    if (nameError || emailError || subjectError || messageError) {
      formStatus.textContent =
        "Please provide a valid name, email, subject, and message (minimum 15 characters).";
      formStatus.className = "error";
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    formStatus.textContent = "Sending your message...";
    formStatus.className = "info";

    window.setTimeout(() => {
      formStatus.textContent = "Thanks! Your message is saved locally in this demo.";
      formStatus.className = "success";
      contactForm.reset();
      updateMessageCounter();

      [contactForm.name, contactForm.email, contactForm.subject, contactForm.message].forEach(
        (field) => markFieldError(field, false),
      );

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }, 550);
  });
}

const revealItems = document.querySelectorAll(".reveal-item");

if (revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
