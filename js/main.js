// ===== APP START =====

window.addEventListener("DOMContentLoaded", () => {
  initRouter();
});
function reloadPage() {
  clearCache();
  renderPage(currentPage);
}
function updateYouNav() {
  const btn = document.getElementById("youNavBtn");
  const username = localStorage.getItem("rk_username");

  if (username) {
    btn.classList.remove("hidden");
  } else {
    btn.classList.add("hidden");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateYouNav();
  initRouter();
});
