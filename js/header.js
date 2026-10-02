import { createElement } from "./dom.js";

export function createHeader() {
  const settingsButton = createControlButton("Settings");
  const newGameButton = createControlButton("New game", "control__button control__button_primary");
  const leaderboardButton = createControlButton("Leader board");

  const moves = createElement("span", { className: "stat__number", text: "0" });
  const pairs = createElement("span", { className: "stat__number", text: "0" });
  const pairsTotal = createElement("span", { className: "stat__total", text: "0" });

  const element = createElement("header", {
    className: "header",
    children: [
      createElement("div", {
        className: "container header__container",
        children: [
          createLogo(),
          createElement("ul", {
            className: "control__list",
            children: [settingsButton, newGameButton, leaderboardButton].map((button) =>
              createElement("li", { className: "control__item", children: [button] }),
            ),
          }),
          createElement("ul", {
            className: "stat__list",
            children: [
              createElement("li", {
                className: "stat__item",
                children: [
                  createElement("span", { className: "stat__title", text: "Moves:" }),
                  moves,
                ],
              }),
              createElement("li", {
                className: "stat__item",
                children: [
                  createElement("span", { className: "stat__title", text: "Pairs found:" }),
                  createElement("div", {
                    className: "stat__content",
                    children: [pairs, createElement("span", { className: "stat__delimiter", text: "/" }), pairsTotal],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return {
    element,
    settingsButton,
    newGameButton,
    leaderboardButton,
    setMoves: (value) => {
      moves.textContent = value;
    },
    setPairs: (value) => {
      pairs.textContent = value;
    },
    setPairsTotal: (value) => {
      pairsTotal.textContent = value;
    },
  };
}

function createLogo() {
  const logo = createElement("a", {
    className: "logo",
    attrs: { href: "./" },
    children: [
      createElement("span", { className: "logo__word", text: "Memory" }),
      createElement("span", { className: "logo__word logo__word_accent", text: "game" }),
    ],
  });

  logo.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  });

  return logo;
}

function createControlButton(text, className = "control__button") {
  return createElement("button", { className, text, attrs: { type: "button" } });
}
