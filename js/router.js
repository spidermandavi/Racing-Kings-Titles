// ===== ROUTER =====

let currentPage = "home";

// Store page render functions
const routes = {
  home: () => `<h1>Home</h1><p>Loading...</p>`,
  players: () => `<h1>Players</h1><p>Loading...</p>`,
  titles: () => `<h1>Titles</h1><p>Loading...</p>`,
  about: () => `<h1>About</h1><p>Loading...</p>`,
  you: () => `<h1>You</h1><p>Loading...</p>`
};

// Navigate to a page
function navigate(page) {
  if (!routes[page]) return;

  currentPage = page;

  // Update URL hash
  window.location.hash = page;

  renderPage(page);
}

// Render the page into #app
function renderPage(page) {
  const app = document.getElementById("app");
  if (!app) return;

  // Render basic layout first
  app.innerHTML = routes[page]();

  // Later we will replace this with real page logic
}

// Handle back/forward buttons
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "home";
  navigate(page);
});

// Initial load
function initRouter() {
  const page = window.location.hash.replace("#", "") || "home";
  navigate(page);
}
