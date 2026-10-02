const FLIP_BACK_DELAY = 1500;

const cardList = document.querySelector(".game .card__list");
const moves = document.querySelector("#moves");
const pairs = document.querySelector("#pairs");
const pairsTotal = document.querySelector(".stat__total");
const newGameButton = document.querySelector("[data-new-game]");

let emojis = [];
let firstCard = null;
let isBoardLocked = false;
let flipBackTimeout = null;
let movesCount = 0;
let pairsCount = 0;

cardList.addEventListener("click", onCardListClick);
newGameButton.addEventListener("click", startGame);
document.addEventListener("categorychange", onCategoryChange);

function onCategoryChange(e) {
  emojis = e.detail.emojis;
  startGame();
}

function startGame() {
  clearTimeout(flipBackTimeout);
  firstCard = null;
  isBoardLocked = false;
  movesCount = 0;
  pairsCount = 0;

  moves.textContent = movesCount;
  pairs.textContent = pairsCount;
  pairsTotal.textContent = emojis.length;

  renderCards(shuffle([...emojis, ...emojis]));
}

function renderCards(deck) {
  cardList.innerHTML = deck
    .map(
      (emoji) => `
        <li class="card__item" data-id="${emoji}">
          <div class="card__content">
            <div class="card__back"></div>
            <div class="card__front">${emoji}</div>
          </div>
        </li>`,
    )
    .join("");
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

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
    flipBackTimeout = setTimeout(() => {
      isBoardLocked = false;
    }, getFlipDuration(secondCard));
    return;
  }

  isBoardLocked = true;
  const openedCard = firstCard;

  flipBackTimeout = setTimeout(() => {
    openedCard.classList.remove("card__item_flipped");
    secondCard.classList.remove("card__item_flipped");
    firstCard = null;
    isBoardLocked = false;
  }, FLIP_BACK_DELAY);
}

function getFlipDuration(card) {
  const content = card.querySelector(".card__content");

  return parseFloat(getComputedStyle(content).transitionDuration) * 1000;
}
