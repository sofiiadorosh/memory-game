import { createElement } from "./dom.js";
import { createModal, createModalButton } from "./modal.js";
import { getResults } from "./storage.js";

const COLUMNS = ["Place", "Moves", "Date"];

export function createLeaderboard() {
  const tableBody = createElement("div", { className: "leaderboard__body", attrs: { role: "rowgroup" } });

  const table = createElement("div", {
    className: "leaderboard__table",
    attrs: { role: "table", "aria-labelledby": "leaderboard-title" },
    children: [
      createElement("div", {
        className: "leaderboard__head",
        attrs: { role: "rowgroup" },
        children: [
          createElement("div", {
            className: "leaderboard__row leaderboard__row_head",
            attrs: { role: "row" },
            children: COLUMNS.map((column) =>
              createElement("div", { className: "leaderboard__heading", text: column, attrs: { role: "columnheader" } }),
            ),
          }),
        ],
      }),
      tableBody,
    ],
  });

  const emptyMessage = createElement("p", {
    className: "leaderboard__empty",
    text: "No results yet",
    attrs: { hidden: true },
  });

  const modal = createModal({
    id: "leaderboard",
    className: "modal modal_side",
    title: "Leader board 🏆",
    subtitle: "Top 10 games with the fewest moves",
    content: [table, emptyMessage, createModalButton("Close", { isPrimary: true, attrs: { "data-modal-close": true } })],
  });

  function open() {
    renderResults();
    modal.open();
  }

  function renderResults() {
    const results = getResults();

    table.hidden = results.length === 0;
    emptyMessage.hidden = results.length > 0;
    tableBody.replaceChildren(...results.map(createRow));
  }

  return { element: modal.element, open };
}

function createRow({ moves, date }, index) {
  return createElement("div", {
    className: "leaderboard__row",
    attrs: { role: "row" },
    children: [
      createElement("div", {
        className: "leaderboard__cell",
        attrs: { role: "cell" },
        children: [createElement("span", { className: "leaderboard__rank", text: index + 1 })],
      }),
      createElement("div", { className: "leaderboard__cell leaderboard__cell_strong", text: moves, attrs: { role: "cell" } }),
      createElement("div", {
        className: "leaderboard__cell leaderboard__cell_muted",
        text: formatDate(date),
        attrs: { role: "cell" },
      }),
    ],
  });
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()}`;
}
