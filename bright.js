// BRIGHT COLLECTIONS MAIN JAVASCRIPT

document.addEventListener("DOMContentLoaded", function () {

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // MOBILE NAV TOGGLE

  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after a link is chosen (mobile UX)
    primaryNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // HERO IMAGE AUTO SLIDER

  const heroImages = [
    "images/banner.jpg",
    "images/banner2.jpg",
    "images/banner3.jpg"
  ];

  let imageIndex = 0;

  const heroImage = document.querySelector(".hero-image img");

  if (heroImage && !prefersReducedMotion) {

    // Preload so switching images doesn't flash a blank frame
    heroImages.forEach(src => {
      const preload = new Image();
      preload.src = src;
    });

    setInterval(() => {

      imageIndex = (imageIndex + 1) % heroImages.length;

      heroImage.style.opacity = "0";

      setTimeout(() => {
        heroImage.src = heroImages[imageIndex];
        heroImage.style.opacity = "1";
      }, 500);

    }, 4000);
  }

  // SEARCH FUNCTION

  const searchForm = document.querySelector(".search-box");
  const searchInput = document.querySelector(".search-box input");

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const searchValue = searchInput.value.trim();

      if (searchValue === "") {
        alert("Please enter a product name");
      } else {
        alert("Searching for: " + searchValue);
        // Later this will connect
        // to the shop products
      }
    });
  }

  // CATEGORY CARD ANIMATION
  // (hover-driven transforms are handled in CSS via .category-card:hover;
  // this only adds a subtle scroll-reveal for a more modern feel)

  const revealTargets = document.querySelectorAll(
    ".category-card, .product-card"
  );

  if (revealTargets.length && !prefersReducedMotion && "IntersectionObserver" in window) {

    revealTargets.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  }

  // WELCOME MESSAGE

  console.log("Welcome to BRIGHT-COLLECTIONS 🛍️");
});