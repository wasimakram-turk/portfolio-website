const pageLoader = document.querySelector(".page-loader");
const heroBackground = document.querySelector(".hero-background");
const navLinks = document.querySelectorAll(".nav-link");
const navLinksContainer = document.querySelector(".nav-links");
const navToggle = document.querySelector(".nav-toggle");
const sections = document.querySelectorAll("section[id]");
const revealElements = document.querySelectorAll(".reveal");
const skillCards = document.querySelectorAll(".skill-card");
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const themeToggle = document.querySelector(".theme-toggle");
const yearEl = document.getElementById("year");
const backToTop = document.querySelector(".back-to-top");
const typingText = document.querySelector(".typing-text");
const contactForm = document.getElementById("contact-form");
const formSuccess = document.querySelector(".form-success");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

window.addEventListener("load", () => {
  setTimeout(() => {
    if (pageLoader) {
      pageLoader.classList.add("hidden");
    }
  }, 600);
});

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const delta = currentScroll - lastScrollY;
  lastScrollY = currentScroll;
  const intensity = Math.max(Math.min(currentScroll / 1200, 0.5), 0);
  if (heroBackground) {
    const offsetY = currentScroll * 0.18;
    heroBackground.style.transform = `translate3d(0, ${offsetY}px, 0) scale(${1 + intensity * 0.1})`;
  }
});

if (navToggle && navLinksContainer) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinksContainer.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinksContainer.classList.remove("open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bar = card.querySelector(".skill-progress-bar");
        if (bar) {
          const level = card.getAttribute("data-skill-level") || "80";
          bar.style.setProperty("--skill-target", `${level}%`);
          requestAnimationFrame(() => {
            card.classList.add("visible");
          });
        }
        skillObserver.unobserve(card);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

skillCards.forEach((card) => skillObserver.observe(card));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  {
    threshold: 0.45,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let outlineX = cursorX;
let outlineY = cursorY;

const cursorTargets = document.querySelectorAll("a, button, .btn, .social-link");

if (cursorDot && cursorOutline) {
  window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  });

  const renderCursor = () => {
    outlineX += (cursorX - outlineX) * 0.16;
    outlineY += (cursorY - outlineY) * 0.16;
    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(renderCursor);
  };

  renderCursor();

  cursorTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.classList.add("active");
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.classList.remove("active");
    });
  });
}

const storedTheme = window.localStorage.getItem("theme");
if (storedTheme === "dark") {
  document.body.classList.add("dark-theme");
}

const syncThemeToggleIcon = () => {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  if (!icon) return;
  const isDark = document.body.classList.contains("dark-theme");
  icon.classList.toggle("fa-moon", !isDark);
  icon.classList.toggle("fa-sun", isDark);
};

syncThemeToggleIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    window.localStorage.setItem("theme", theme);
    syncThemeToggleIcon();
  });
}

const phrases = [
  "responsive, mobile-first layouts.",
  "animated landing pages.",
  "SEO-optimized marketing sites.",
  "enterprise dashboards and UI systems.",
];

let phraseIndex = 0;
let charIndex = 0;
let typingDirection = "forward";
let typingPause = 0;

const typeLoop = () => {
  if (!typingText) {
    return;
  }
  const currentPhrase = phrases[phraseIndex];
  if (typingDirection === "forward") {
    if (charIndex <= currentPhrase.length) {
      typingText.textContent = currentPhrase.slice(0, charIndex);
      charIndex += 1;
    } else {
      typingDirection = "backward";
      typingPause = 16;
    }
  } else if (typingDirection === "backward") {
    if (typingPause > 0) {
      typingPause -= 1;
    } else if (charIndex >= 0) {
      typingText.textContent = currentPhrase.slice(0, charIndex);
      charIndex -= 1;
    } else {
      typingDirection = "forward";
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, 70);
};

typeLoop();

if (backToTop) {
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setError = (field, message) => {
  const error = contactForm.querySelector(`.form-error[data-for="${field}"]`);
  const input = contactForm.querySelector(`#${field}`);
  if (error && input) {
    error.textContent = message;
    input.classList.toggle("has-error", Boolean(message));
  }
};

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    const nameValue = contactForm.name.value.trim();
    const emailValue = contactForm.email.value.trim();
    const messageValue = contactForm.message.value.trim();

    if (!nameValue) {
      setError("name", "Please enter your name.");
      valid = false;
    } else {
      setError("name", "");
    }

    if (!emailValue) {
      setError("email", "Please enter your email.");
      valid = false;
    } else if (!emailPattern.test(emailValue)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    } else {
      setError("email", "");
    }

    if (!messageValue) {
      setError("message", "Please enter a short message.");
      valid = false;
    } else if (messageValue.length < 10) {
      setError("message", "Message should be at least 10 characters.");
      valid = false;
    } else {
      setError("message", "");
    }

    if (!valid) {
      return;
    }

    if (formSuccess) {
      formSuccess.classList.add("visible");
      setTimeout(() => {
        formSuccess.classList.remove("visible");
      }, 3200);
    }

    contactForm.reset();
  });
}
