const SCROLL_LOCK_CLASS = "scroll-locked";

export function createModal(element) {
  const focusTarget = element.querySelector("[data-modal-focus]") ?? element.querySelector("button");

  let lastFocused = null;

  element.addEventListener("click", onModalClick);

  function open() {
    lastFocused = document.activeElement;

    element.classList.add("modal_opened");
    element.setAttribute("aria-hidden", "false");
    setBackgroundInert(true);
    document.body.classList.add(SCROLL_LOCK_CLASS);
    document.addEventListener("keydown", onEscapePress);
    focusTarget.focus();
  }

  function close() {
    element.classList.remove("modal_opened");
    element.setAttribute("aria-hidden", "true");
    setBackgroundInert(false);
    document.body.classList.remove(SCROLL_LOCK_CLASS);
    document.removeEventListener("keydown", onEscapePress);
    lastFocused?.focus();
  }

  function onModalClick(e) {
    if (e.target.closest("[data-modal-close]")) {
      close();
    }
  }

  function onEscapePress(e) {
    if (e.key === "Escape") {
      close();
    }
  }

  function setBackgroundInert(isInert) {
    const background = [document.querySelector(".header"), ...element.parentElement.children];

    background
      .filter((node) => node !== element)
      .forEach((node) => {
        node.inert = isInert;
      });
  }

  return { open, close };
}
