import { createElement } from "./dom.js";

const SCROLL_LOCK_CLASS = "scroll-locked";

export function createModal({ id, className = "modal", title, subtitle, content = [], focusTarget }) {
  const titleId = `${id}-title`;

  const element = createElement("div", {
    className,
    attrs: { id, "aria-hidden": "true" },
    children: [
      createElement("div", { className: "modal__backdrop", attrs: { "data-modal-close": true } }),
      createElement("div", {
        className: "modal__window",
        attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": titleId },
        children: [
          createElement("div", {
            className: "modal__header",
            children: [
              createElement("div", {
                children: [
                  createElement("h2", { className: "modal__title", text: title, attrs: { id: titleId } }),
                  createElement("p", { className: "modal__subtitle", text: subtitle }),
                ],
              }),
            ],
          }),
          ...content,
        ],
      }),
    ],
  });

  let lastFocused = null;

  element.addEventListener("click", onModalClick);

  function open() {
    lastFocused = document.activeElement;

    element.classList.add("modal_opened");
    element.setAttribute("aria-hidden", "false");
    setBackgroundInert(true);
    document.body.classList.add(SCROLL_LOCK_CLASS);
    document.addEventListener("keydown", onEscapePress);
    (focusTarget ?? element.querySelector("button")).focus();
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

  return { element, open, close };
}

export function createModalButton(text, { isPrimary = false, attrs = {} } = {}) {
  return createElement("button", {
    className: isPrimary ? "modal__button modal__button_primary" : "modal__button",
    text,
    attrs: { type: "button", ...attrs },
  });
}
