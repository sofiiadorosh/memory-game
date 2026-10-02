import { createElement } from "./dom.js";

const SCROLL_LOCK_CLASS = "scroll-locked";

const openModals = [];

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    openModals.at(-1)?.close();
  }
});

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

  const modal = { element, open, close };

  let lastFocused = null;

  element.addEventListener("click", onModalClick);

  function open() {
    if (openModals.includes(modal)) {
      return;
    }

    lastFocused = document.activeElement;
    openModals.push(modal);

    element.classList.add("modal_opened");
    element.setAttribute("aria-hidden", "false");
    updatePage();
    (focusTarget ?? element.querySelector("button")).focus();
  }

  function close() {
    if (!openModals.includes(modal)) {
      return;
    }

    openModals.splice(openModals.indexOf(modal), 1);

    element.classList.remove("modal_opened");
    element.setAttribute("aria-hidden", "true");
    updatePage();
    lastFocused?.focus();
  }

  function onModalClick(e) {
    if (e.target.closest("[data-modal-close]")) {
      close();
    }
  }

  return modal;
}

function updatePage() {
  const topModal = openModals.at(-1)?.element;
  const page = [document.querySelector(".header"), ...document.querySelector("main").children];

  page.forEach((node) => {
    node.inert = Boolean(topModal) && node !== topModal;
  });

  document.body.classList.toggle(SCROLL_LOCK_CLASS, Boolean(topModal));
}

export function createModalButton(text, { isPrimary = false, attrs = {} } = {}) {
  return createElement("button", {
    className: isPrimary ? "modal__button modal__button_primary" : "modal__button",
    text,
    attrs: { type: "button", ...attrs },
  });
}
