import { createElement } from "./dom.js";
import { createModal, createModalButton } from "./modal.js";

export function createVictory({ onNewGame }) {
  const movesValue = createElement("span", { className: "victory__moves", text: "0" });
  const newGameButton = createModalButton("New game", { isPrimary: true });

  const modal = createModal({
    id: "victory",
    title: "You won! 🎉",
    subtitle: "All pairs are found",
    focusTarget: newGameButton,
    content: [
      createElement("div", {
        className: "victory__result",
        children: [createElement("span", { className: "victory__label", text: "Moves" }), movesValue],
      }),
      createElement("div", {
        className: "modal__actions",
        children: [newGameButton, createModalButton("Close", { attrs: { "data-modal-close": true } })],
      }),
    ],
  });

  newGameButton.addEventListener("click", () => {
    modal.close();
    onNewGame();
  });

  function show(moves) {
    movesValue.textContent = moves;
    modal.open();
  }

  return { element: modal.element, show };
}
