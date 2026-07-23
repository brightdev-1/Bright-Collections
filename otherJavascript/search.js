// BRIGHT COLLECTIONS — SITE-WIDE SEARCH
// Shows a live dropdown of matching products as the user types (using the
// shared PRODUCTS list from products.js), and redirects to the shop page
// with the results filtered on submit or suggestion click.

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".search-box");
  const input = document.querySelector("#site-search");

  if (!form || !input || typeof PRODUCTS === "undefined") return;

  // are we currently inside /otherhtml/, or at the project root?
  const onSubPage = window.location.pathname.includes("/otherhtml/");
  const shopUrl = onSubPage ? "./shop.html" : "./otherhtml/shop.html";
  const imagePrefix = onSubPage ? "../" : "./";

  // build the dropdown panel and attach it to the search form
  const dropdown = document.createElement("div");
  dropdown.className = "search-suggestions";
  dropdown.hidden = true;
  form.appendChild(dropdown);

  let debounceTimer;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => renderSuggestions(input.value.trim()), 200);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) renderSuggestions(input.value.trim());
  });

  document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) dropdown.hidden = true;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    window.location.href = `${shopUrl}?search=${encodeURIComponent(query)}`;
  });

  function renderSuggestions(query) {
    if (!query) {
      dropdown.hidden = true;
      return;
    }

    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (matches.length === 0) {
      dropdown.innerHTML = `<p class="search-empty">No products found for "${escapeHtml(query)}"</p>`;
      dropdown.hidden = false;
      return;
    }

    dropdown.innerHTML = matches.map(p => `
      <a class="search-suggestion" href="${shopUrl}?search=${encodeURIComponent(p.name)}">
        <img src="${imagePrefix}${p.image}" alt="${escapeHtml(p.name)}">
        <span class="search-suggestion-name">${escapeHtml(p.name)}</span>
        <span class="search-suggestion-price">₦${p.price.toLocaleString()}</span>
      </a>
    `).join("");

    dropdown.hidden = false;
  }

  // basic guard so typed text can't break out of the HTML we're injecting
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

});