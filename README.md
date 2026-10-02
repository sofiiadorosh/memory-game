# Memory Game

A browser memory game: flip cards two at a time and find all the matching pairs in as few moves as possible.

The app is written in plain HTML, SCSS and JavaScript — no frameworks or UI libraries. All markup is created with JavaScript: `index.html` contains only a `<script>` tag inside `<body>`.

## Features

- **16 cards, 8 pairs.** Every emoji of the selected category appears exactly twice, and the deck is shuffled (Fisher–Yates) on every new game.
- **Counters.** The header shows the number of moves and found pairs.
- **New game.** Restarts the round at any moment with a freshly shuffled deck.
- **Settings sidebar** with two tabs:
  - **Categories** — 10 emoji sets (animals, flowers, space, fruits, food, sports, transport, ocean, music, halloween);
  - **Cards** — 6 card back designs with a spinning card preview.
- **Leader board.** Top 10 results sorted by moves (an earlier game wins a tie), with the date in `DD.MM.YYYY` format.
- **Victory modal.** Opens after the last pair is found and shows the number of moves, with "New game" and "Close" buttons.
- **Persistence.** Results, the selected category and the card design are stored in `localStorage` and survive page reloads.
- **Responsive layout.** From 1120px the header is a single row; on smaller screens the buttons move to a bottom navigation bar, like in mobile apps.

### Modal behaviour

- The page behind an open modal is dimmed, cannot be clicked or reached with Tab (`inert`), and does not scroll.
- A modal closes with its "Close" button, a click on the backdrop or the `Escape` key. Clicking the modal content does not close it.
- Closing a modal never resets the game or changes the results. Opening the leader board during a game keeps the board as it is: an unmatched pair still flips back after its delay.

## Getting started

The app uses ES modules and loads categories with `fetch`, so it must be served over HTTP — opening `index.html` directly from the file system will not work.

Use any static server, for example the **Live Server** extension in VS Code, or:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Styles

Styles are written in SCSS (`style/`) and compiled to `css/main.css` with the **Live Sass Compiler** VS Code extension (settings are in `.vscode/settings.json`). Turn on "Watch Sass" and save any `.scss` file to rebuild the CSS. A minified build is written to `dist/css`.

## Project structure

```
├── index.html            # Empty <body> with a single <script>
├── assets/
│   └── categories.json   # Emoji sets for the card categories
├── js/
│   ├── app.js            # Entry point: creates every part and wires them together
│   ├── dom.js            # createElement() helper over document.createElement
│   ├── header.js         # Logo, control buttons and counters
│   ├── game.js           # Board, cards, moves, pairs and win detection
│   ├── sidebar.js        # Settings sidebar: tabs, categories, designs, preview
│   ├── modal.js          # Modal shell: backdrop, inert background, scroll lock, Escape
│   ├── leaderboard.js    # Leader board modal
│   ├── victory.js        # Victory modal
│   ├── designs.js        # Card design names and applyDesign()
│   └── storage.js        # localStorage: results and settings
├── style/
│   ├── main.scss
│   ├── abstracts/        # Variables and mixins
│   ├── core/             # Reset, page background, container
│   ├── layout/           # Header, sidebar, modals
│   └── pages/home/       # Board and card designs
└── css/                  # Compiled CSS
```

## Implementation notes

- **DOM.** Every element is created with `document.createElement` through the `createElement(tag, { className, text, attrs, children })` helper in `js/dom.js`. The code never uses `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser` or `alert`/`confirm`/`prompt`; lists are updated with `replaceChildren()`.
- **Modules.** Each module builds its own part of the page and returns the element plus a small API (for example `game.start(emojis)` or `victory.show(moves)`). `app.js` connects them through callbacks.
- **Results.** A win is saved once per game. Only the 10 best results are kept, under the `memory-game:results` key. The selected category and design are stored under `memory-game:settings`.
- **Card designs** are pure CSS gradients described in the `$card-designs` map in `style/pages/home/_game.scss`. A design is applied by adding the `card__list_<name>` class to the board.

### Adding content

- **A new category** — add an array of 8 emoji to `assets/categories.json`.
- **A new card design** — add an entry to `$card-designs` in `_game.scss` (with its colors in `_variables.scss`) and its name to `DESIGNS` in `js/designs.js`.
