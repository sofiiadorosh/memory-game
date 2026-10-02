import { createElement } from "./dom.js";
import { createGame } from "./game.js";
import { createHeader } from "./header.js";
import { createLeaderboard } from "./leaderboard.js";
import { createSidebar } from "./sidebar.js";
import { createVictory } from "./victory.js";

const header = createHeader();
const game = createGame({ stats: header, onWin: (moves) => victory.show(moves) });
const victory = createVictory({ onNewGame: () => game.start() });
const leaderboard = createLeaderboard();
const sidebar = createSidebar({
  onCategoryChange: (emojis) => game.start(emojis),
  onDesignChange: (name) => game.setDesign(name),
});

header.settingsButton.addEventListener("click", sidebar.open);
header.newGameButton.addEventListener("click", () => game.start());
header.leaderboardButton.addEventListener("click", leaderboard.open);

document.body.append(
  header.element,
  createElement("main", { children: [sidebar.element, game.element, leaderboard.element, victory.element] }),
);
