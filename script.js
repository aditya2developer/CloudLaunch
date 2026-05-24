const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const getSavedTheme = () => {
  try {
    return localStorage.getItem("cloudlaunch-theme");
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem("cloudlaunch-theme", theme);
  } catch {
    return;
  }
};

const savedTheme = getSavedTheme();

if (savedTheme === "dark" && themeIcon) {
  document.body.classList.add("dark-theme");
  themeIcon.textContent = "MOON";
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

if (themeToggle && themeIcon) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeIcon.textContent = isDark ? "MOON" : "SUN";
    saveTheme(isDark ? "dark" : "light");
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 55, 280)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        const target = Number(counter.dataset.count);
        const suffix = target === 99 ? "%" : "";
        const duration = 1000;
        const start = performance.now();

        const updateCounter = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = `${Math.round(target * eased)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    counter.textContent = `${target}${target === 99 ? "%" : ""}`;
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").toString().trim();
    const project = formData.get("project").toString().trim();

    formStatus.textContent = `Thanks, ${name || "there"}! Your ${project || "project"} request is ready to connect to an Azure backend.`;
    contactForm.reset();
  });
}
