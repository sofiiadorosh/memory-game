import { applyDesign } from "./designs.js";
import { createElement } from "./dom.js";
import { addResult } from "./storage.js";

const FLIP_BACK_DELAY = 1500;
const GATHER_DURATION = 300;
const DEAL_DURATION = 400;
const DEAL_STAGGER = 20;
const DEAL_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

export function createGame({ stats, onWin }) {
  const cardList = createElement("ul", { className: "card__list" });

  const element = createElement("section", {
    className: "game",
    children: [createElement("div", { className: "container game__container", children: [cardList] })],
  });

  let emojis = [];
  let isResultSaved = false;
  let firstCard = null;
  let isBoardLocked = false;
  let pendingTimeout = null;
  let animationTimeout = null;
  let movesCount = 0;
  let pairsCount = 0;

  cardList.addEventListener("click", onCardListClick);

  function start(nextEmojis = emojis) {
    emojis = nextEmojis;

    clearTimeout(pendingTimeout);
    clearTimeout(animationTimeout);
    firstCard = null;
    isBoardLocked = false;
    isResultSaved = false;
    movesCount = 0;
    pairsCount = 0;

    stats.setMoves(movesCount);
    stats.setPairs(pairsCount);
    stats.setPairsTotal(emojis.length);

    const cards = shuffle([...emojis, ...emojis]).map(createCard);
    const oldCards = [...cardList.children];

    if (oldCards.length === 0 || prefersReducedMotion()) {
      cardList.replaceChildren(...cards);
      return;
    }

    isBoardLocked = true;
    gatherCards(oldCards);

    animationTimeout = setTimeout(() => {
      cardList.replaceChildren(...cards);
      dealCards(cards);
    }, GATHER_DURATION);
  }

  function gatherCards(cards) {
    cards.forEach((card) => {
      card.classList.remove("card__item_flipped", "card__item_blocked");
      moveCard(card, getOffsetToCenter(card), `transform ${GATHER_DURATION}ms ${DEAL_EASING}`);
    });
  }

  function dealCards(cards) {
    cards.forEach((card) => moveCard(card, getOffsetToCenter(card), "none"));

    // Apply the stacked position before animating back to the grid
    cardList.getBoundingClientRect();

    cards.forEach((card, index) => {
      moveCard(card, null, `transform ${DEAL_DURATION}ms ${DEAL_EASING} ${index * DEAL_STAGGER}ms`);
    });

    animationTimeout = setTimeout(
      () => {
        cards.forEach((card) => moveCard(card, null, ""));
        isBoardLocked = false;
      },
      DEAL_DURATION + DEAL_STAGGER * cards.length,
    );
  }

  function getOffsetToCenter(card) {
    return {
      x: cardList.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2),
      y: cardList.clientHeight / 2 - (card.offsetTop + card.offsetHeight / 2),
    };
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
    stats.setMoves(movesCount);

    if (firstCard.dataset.id === secondCard.dataset.id) {
      firstCard.classList.add("card__item_blocked");
      secondCard.classList.add("card__item_blocked");
      pairsCount += 1;
      stats.setPairs(pairsCount);
      firstCard = null;

      if (pairsCount === emojis.length) {
        saveWin();
        pendingTimeout = setTimeout(() => onWin(movesCount), getFlipDuration(secondCard));
      }

      return;
    }

    isBoardLocked = true;
    const openedCard = firstCard;

    pendingTimeout = setTimeout(() => {
      openedCard.classList.remove("card__item_flipped");
      secondCard.classList.remove("card__item_flipped");
      firstCard = null;
      isBoardLocked = false;
    }, FLIP_BACK_DELAY);
  }

  function saveWin() {
    if (isResultSaved) {
      return;
    }

    isResultSaved = true;
    addResult({ moves: movesCount, date: Date.now() });
  }

  return {
    element,
    start,
    setDesign: (name) => applyDesign(cardList, name),
  };
}

function createCard(emoji) {
  return createElement("li", {
    className: "card__item",
    attrs: { "data-id": emoji },
    children: [
      createElement("div", {
        className: "card__content",
        children: [
          createElement("div", { className: "card__back" }),
          createElement("div", { className: "card__front", text: emoji }),
        ],
      }),
    ],
  });
}

function moveCard(card, offset, transition) {
  card.style.transition = transition;
  card.style.transform = offset ? `translate(${offset.x}px, ${offset.y}px)` : "";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function getFlipDuration(card) {
  const content = card.querySelector(".card__content");

  return parseFloat(getComputedStyle(content).transitionDuration) * 1000;
}
