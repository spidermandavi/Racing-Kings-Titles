// ===== ROUTER =====

let currentPage = "home";

// Page registry
const routes = {
  home: renderHome,
  players: renderPlayers,
  titles: renderTitles,
  about: renderAbout,
  you: renderYou
};

// Navigate
function navigate(page) {
  if (!routes[page]) return;

  currentPage = page;
  window.location.hash = page;

  showSpinner();

  setTimeout(() => {
    renderPage(page);
    hideSpinner();
  }, 50);
}

// Render wrapper
function renderPage(page) {
  const app = document.getElementById("app");
  if (!app) return;

  routes[page]();
}

// Hash navigation
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "home";
  navigate(page);
});

// Init
function initRouter() {
  const page = window.location.hash.replace("#", "") || "home";
  navigate(page);
}
