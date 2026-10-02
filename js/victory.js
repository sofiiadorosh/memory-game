import { createModal } from "./modal.js";

const element = document.querySelector("#victory");
const movesValue = element.querySelector(".victory__moves");
const newGameButton = element.querySelector("[data-victory-new-game]");

const modal = createModal(element);

let onNewGame = null;

newGameButton.addEventListener("click", onNewGameClick);

export function showVictory(moves, newGameHandler) {
  movesValue.textContent = moves;
  onNewGame = newGameHandler;
  modal.open();
}

function onNewGameClick() {
  modal.close();
  onNewGame?.();
}
