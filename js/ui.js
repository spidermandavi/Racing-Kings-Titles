// ===== SPINNER CONTROL =====

function showSpinner() {
  document.getElementById("globalSpinner").classList.remove("hidden");
}

function hideSpinner() {
  document.getElementById("globalSpinner").classList.add("hidden");
}
function showPopup() {
  document.getElementById("userPopup").classList.remove("hidden");
}

function hidePopup() {
  document.getElementById("userPopup").classList.add("hidden");
}
async function submitUsername() {
  const input = document.getElementById("usernameInput").value.trim();

  if (!input) return;

  showSpinner();

  const data = await fetchLichessUser(input);

  if (!data) {
    document.getElementById("popupError").classList.remove("hidden");
    hideSpinner();
    return;
  }

  localStorage.setItem("rk_username", input);

  hidePopup();
  hideSpinner();

  updateYouNav();
}
function skipUsername() {
  localStorage.setItem("rk_username", "SKIP");
  hidePopup();
  updateYouNav();
}
