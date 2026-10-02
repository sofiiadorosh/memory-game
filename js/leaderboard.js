import { createModal } from "./modal.js";
import { getResults } from "./storage.js";

const element = document.querySelector("#leaderboard");
const tableBody = element.querySelector(".leaderboard__body");
const table = element.querySelector(".leaderboard__table");
const emptyMessage = element.querySelector(".leaderboard__empty");
const openButton = document.querySelector("[data-leaderboard-open]");

const modal = createModal(element);

openButton.addEventListener("click", openLeaderboard);

function openLeaderboard() {
  renderResults();
  modal.open();
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
