const RESULTS_KEY = "memory-game:results";
const SETTINGS_KEY = "memory-game:settings";
const MAX_RESULTS = 10;

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or disabled; the game still works without it
  }
}

export function getResults() {
  return read(RESULTS_KEY, []);
}

export function addResult(result) {
  const results = [...getResults(), result]
    .sort((a, b) => a.moves - b.moves || a.date - b.date)
    .slice(0, MAX_RESULTS);

  write(RESULTS_KEY, results);
}

export function getSettings() {
  return read(SETTINGS_KEY, {});
}

export function saveSettings(settings) {
  write(SETTINGS_KEY, { ...getSettings(), ...settings });
}
