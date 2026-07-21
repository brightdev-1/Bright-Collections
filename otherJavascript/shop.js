// BRIGHT COLLECTIONS — SHOP PAGE JAVASCRIPT

document.addEventListener("DOMContentLoaded", function () {

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const grid = document.querySelector("#product-grid");
  const cards = Array.from(document.querySelectorAll(".product-card"));
  const filterTabs = document.querySelectorAll(".filter-tab");
  const sortSelect = document.querySelector("#sort-select");
  const resultsCount = document.querySelector(".results-count");
  const emptyState = document.querySelector(".empty-state");

  let activeFilter = "all";

  // STAGGERED REVEAL ON LOAD

  function revealCards() {
    const visibleCards = cards.filter(card => !card.classList.contains("is-hidden"));

    visibleCards.forEach((card, index) => {
      card.classList.remove("is-visible");

      if (prefersReducedMotion) {
        card.style.opacity = "1";
        card.style.transform = "none";
        return;
      }

      // restart the animation with a staggered delay per card
      card.style.animationDelay = `${index * 80}ms`;

      requestAnimationFrame(() => {
        card.classList.add("is-visible");
      });
    });
  }

  // FILTER TABS

  function applyFilter(filter) {
    activeFilter = filter;

    cards.forEach(card => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });

    filterTabs.forEach(tab => {
      const isActive = tab.dataset.filter === filter;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    updateResultsCount();
    revealCards();
  }

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => applyFilter(tab.dataset.filter));
  });

  // SORTING (visual reorder only — cart/price logic is unaffected)

  function applySort(order) {
    const visibleCards = cards.filter(card => !card.classList.contains("is-hidden"));

    if (order === "low-high") {
      visibleCards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (order === "high-low") {
      visibleCards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    }

    if (order !== "default" && grid) {
      visibleCards.forEach(card => grid.appendChild(card));
    }

    revealCards();
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => applySort(sortSelect.value));
  }

  // RESULTS COUNT + EMPTY STATE

  function updateResultsCount() {
    const visibleCount = cards.filter(card => !card.classList.contains("is-hidden")).length;

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} product${visibleCount === 1 ? "" : "s"}`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  // ADD TO CART FEEDBACK

  cards.forEach(card => {
    const button = card.querySelector("button");

    if (!button) return;

    button.addEventListener("click", () => {
      if (button.classList.contains("is-added")) return;

      button.classList.add("is-added");

      setTimeout(() => {
        button.classList.remove("is-added");
      }, 1200);
    });
  });

  // INITIAL STATE

  updateResultsCount();
  revealCards();
});