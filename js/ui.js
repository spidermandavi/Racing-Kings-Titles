// ===== SPINNER CONTROL =====

function showSpinner() {
  const el = document.getElementById("globalSpinner");
  if (el) el.classList.remove("hidden");
}

function hideSpinner() {
  const el = document.getElementById("globalSpinner");
  if (el) el.classList.add("hidden");
}

function showPopup() {
  const popup = document.getElementById("userPopup");
  const error = document.getElementById("popupError");
  const input = document.getElementById("usernameInput");

  if (popup) popup.classList.remove("hidden");
  if (error) error.classList.add("hidden");
  if (input) {
    input.value = "";
    setTimeout(() => input.focus(), 0);
  }
}

function hidePopup() {
  const popup = document.getElementById("userPopup");
  if (popup) popup.classList.add("hidden");
}

async function submitUsername() {
  const inputEl = document.getElementById("usernameInput");
  const errorEl = document.getElementById("popupError");

  const input = inputEl ? inputEl.value.trim() : "";
  if (!input) return;

  if (errorEl) errorEl.classList.add("hidden");
  showSpinner();

  const data = await fetchLichessUser(input);

  if (!data) {
    if (errorEl) errorEl.classList.remove("hidden");
    hideSpinner();
    return;
  }

  const savedUsername = data.username || data.id || input;
  localStorage.setItem("rk_username", savedUsername);

  clearCache();
  hidePopup();
  updateYouNav();

  navigate("you");
}

function skipUsername() {
  localStorage.setItem("rk_username", "SKIP");
  hidePopup();
  updateYouNav();
}
