const FLIP_BACK_DELAY = 1500;

const cardList = document.querySelector(".card__list");
const moves = document.querySelector("#moves");
const pairs = document.querySelector("#pairs");

let firstCard = null;
let isBoardLocked = false;
let movesCount = 0;
let pairsCount = 0;

cardList.addEventListener("click", onCardListClick);

function onCardListClick(e) {
  const chosenCard = e.target.closest(".card__item");

  if (!chosenCard || isBoardLocked || chosenCard.classList.contains("card__item_flipped")) {
    return;
  }

  chosenCard.classList.add("card__item_flipped");

  if (!firstCard) {
    firstCard = chosenCard;
    return;
  }

  const secondCard = chosenCard;
  movesCount += 1;
  moves.textContent = movesCount;

  if (firstCard.dataset.id === secondCard.dataset.id) {
    firstCard.classList.add("card__item_blocked");
    secondCard.classList.add("card__item_blocked");
    pairsCount += 1;
    pairs.textContent = pairsCount;
    firstCard = null;

    isBoardLocked = true;
    secondCard.querySelector(".card__content").addEventListener(
      "transitionend",
      () => {
        isBoardLocked = false;
      },
      { once: true },
    );
    return;
  }

  isBoardLocked = true;
  const openedCard = firstCard;

  setTimeout(() => {
    openedCard.classList.remove("card__item_flipped");
    secondCard.classList.remove("card__item_flipped");
    firstCard = null;
    isBoardLocked = false;
  }, FLIP_BACK_DELAY);
}
