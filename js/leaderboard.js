import { getResults } from "./storage.js";

const modal = document.querySelector("#leaderboard");
const tableBody = modal.querySelector(".leaderboard__body");
const table = modal.querySelector(".leaderboard__table");
const emptyMessage = modal.querySelector(".leaderboard__empty");
const closeButton = modal.querySelector(".modal__button");
const openButton = document.querySelector("[data-leaderboard-open]");

openButton.addEventListener("click", openLeaderboard);
modal.addEventListener("click", onModalClick);

function openLeaderboard() {
  renderResults();
  modal.classList.add("modal_opened");
  modal.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", onEscapePress);
  closeButton.focus();
}

function closeLeaderboard() {
  modal.classList.remove("modal_opened");
  modal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onEscapePress);
  openButton.focus();
}

function onModalClick(e) {
  if (e.target.closest("[data-modal-close]")) {
    closeLeaderboard();
  }
}

function onEscapePress(e) {
  if (e.key === "Escape") {
    closeLeaderboard();
  }
}

function renderResults() {
  const results = getResults();

  table.hidden = results.length === 0;
  emptyMessage.hidden = results.length > 0;

  tableBody.innerHTML = results
    .map(
      ({ moves, date }, index) => `
        <div class="leaderboard__row" role="row">
          <div class="leaderboard__cell" role="cell"><span class="leaderboard__rank">${index + 1}</span></div>
          <div class="leaderboard__cell leaderboard__cell_strong" role="cell">${moves}</div>
          <div class="leaderboard__cell leaderboard__cell_muted" role="cell">${formatDate(date)}</div>
        </div>`,
    )
    .join("");
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()}`;
}
