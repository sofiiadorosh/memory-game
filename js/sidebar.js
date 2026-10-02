import { applyDesign, DESIGNS, getDesignClass } from "./designs.js";
import { createElement } from "./dom.js";
import { getSettings, saveSettings } from "./storage.js";

const CATEGORIES_URL = "./assets/categories.json";

const TABS = [
  { name: "categories", label: "Categories" },
  { name: "designs", label: "Cards" },
];

export function createSidebar({ onCategoryChange, onDesignChange }) {
  const settings = getSettings();
  const statusText = { categories: "", designs: `${DESIGNS.length} card designs` };

  const categoryList = createElement("ul", { className: "category__list" });
  const designList = createElement("ul", { className: "design__list" });
  const previewFront = createElement("div", { className: "card__front preview__front" });
  const preview = createPreview(previewFront);
  const status = createElement("span", { className: "sidebar__status" });
  const closeButton = createElement("button", {
    className: "sidebar__close",
    attrs: { type: "button", "aria-label": "Close settings", "data-sidebar-close": true },
  });

  const tabs = TABS.map(createTab);
  const panels = {
    categories: createTabPanel("categories", [categoryList]),
    designs: createTabPanel("designs", [preview, designList]),
  };
  const tabList = createElement("div", { className: "sidebar__tabs", attrs: { role: "tablist" }, children: tabs });

  const element = createElement("aside", {
    className: "sidebar",
    attrs: { id: "sidebar", "aria-hidden": "true" },
    children: [
      createElement("div", { className: "sidebar__backdrop", attrs: { "data-sidebar-close": true } }),
      createElement("div", {
        className: "sidebar__panel",
        attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "sidebar-title" },
        children: [
          createElement("div", {
            className: "sidebar__header",
            children: [
              createElement("div", {
                className: "sidebar__heading",
                children: [
                  createElement("div", {
                    className: "sidebar__content",
                    children: [
                      createElement("h2", { className: "sidebar__title", text: "Settings ⚙️", attrs: { id: "sidebar-title" } }),
                      createElement("p", { className: "sidebar__subtitle", text: "Choose what you want to play with" }),
                    ],
                  }),
                  closeButton,
                ],
              }),
              tabList,
            ],
          }),
          createElement("div", { className: "sidebar__body", children: Object.values(panels) }),
          createElement("div", { className: "sidebar__footer", children: [status] }),
        ],
      }),
    ],
  });

  let categories = {};
  let activeTab = tabs[0];
  let selectedCategory = null;
  let selectedDesign = null;
  let lastFocused = null;

  element.addEventListener("click", onSidebarClick);
  tabList.addEventListener("click", onTabListClick);
  tabList.addEventListener("keydown", onTabListKeydown);
  categoryList.addEventListener("click", onCategoryListClick);
  designList.addEventListener("click", onDesignListClick);

  renderDesigns();
  renderCategories();

  async function renderCategories() {
    categories = await fetch(CATEGORIES_URL).then((res) => res.json());

    const entries = Object.entries(categories);

    categoryList.replaceChildren(...entries.map(([name, emojis]) => createCategoryItem(name, emojis)));
    statusText.categories = `${entries.length} categories`;
    updateStatus();
    selectCategory(
      categoryList.querySelector(`[data-category="${settings.category}"]`) ??
        categoryList.querySelector(".category__button"),
    );
  }

  function renderDesigns() {
    designList.replaceChildren(...DESIGNS.map(createDesignItem));
    selectDesign(
      designList.querySelector(`[data-design="${settings.design}"]`) ?? designList.querySelector(".design__button"),
    );
  }

  function open() {
    lastFocused = document.activeElement;
    element.classList.add("sidebar_opened");
    element.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onEscapePress);
    closeButton.focus();
  }

  function close() {
    element.classList.remove("sidebar_opened");
    element.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onEscapePress);
    lastFocused?.focus();
  }

  function onSidebarClick(e) {
    if (e.target.closest("[data-sidebar-close]")) {
      close();
    }
  }

  function onEscapePress(e) {
    if (e.key === "Escape") {
      close();
    }
  }

  function onTabListClick(e) {
    const tab = e.target.closest(".sidebar__tab");

    if (tab) {
      selectTab(tab);
    }
  }

  function onTabListKeydown(e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
      return;
    }

    const step = e.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(tabs.indexOf(activeTab) + step + tabs.length) % tabs.length];

    selectTab(nextTab);
    nextTab.focus();
  }

  function selectTab(tab) {
    setTabState(activeTab, false);
    activeTab = tab;
    setTabState(activeTab, true);
    updateStatus();
  }

  function setTabState(tab, isActive) {
    tab.classList.toggle("sidebar__tab_active", isActive);
    tab.setAttribute("aria-selected", String(isActive));

    if (isActive) {
      tab.removeAttribute("tabindex");
    } else {
      tab.setAttribute("tabindex", "-1");
    }

    panels[tab.dataset.tab].hidden = !isActive;
  }

  function updateStatus() {
    status.textContent = statusText[activeTab.dataset.tab];
  }

  function onCategoryListClick(e) {
    const button = e.target.closest(".category__button");

    if (button && button !== selectedCategory) {
      selectCategory(button);
    }
  }

  function onDesignListClick(e) {
    const button = e.target.closest(".design__button");

    if (button) {
      selectDesign(button);
    }
  }

  function selectCategory(button) {
    selectedCategory = toggleSelection(selectedCategory, button, "category__button_active");

    const name = button.dataset.category;
    const emojis = categories[name];

    previewFront.textContent = emojis[0];
    saveSettings({ category: name });
    onCategoryChange(emojis);
  }

  function selectDesign(button) {
    selectedDesign = toggleSelection(selectedDesign, button, "design__button_active");

    const name = button.dataset.design;

    applyDesign(preview, name);
    saveSettings({ design: name });
    onDesignChange(name);
  }

  return { element, open };
}

function createTab({ name, label }, index) {
  const isActive = index === 0;

  return createElement("button", {
    className: isActive ? "sidebar__tab sidebar__tab_active" : "sidebar__tab",
    text: label,
    attrs: {
      type: "button",
      id: `tab-${name}`,
      role: "tab",
      "aria-selected": String(isActive),
      "aria-controls": `panel-${name}`,
      "data-tab": name,
      tabindex: isActive ? null : "-1",
    },
  });
}

function createTabPanel(name, children) {
  return createElement("div", {
    className: "sidebar__tab-panel",
    attrs: { id: `panel-${name}`, role: "tabpanel", "aria-labelledby": `tab-${name}`, hidden: name !== TABS[0].name },
    children,
  });
}

function createPreview(front) {
  return createElement("div", {
    className: "preview",
    children: [
      createElement("div", {
        className: "preview__card",
        children: [
          createElement("div", {
            className: "card__content preview__content",
            children: [createElement("div", { className: "card__back" }), front],
          }),
        ],
      }),
      createElement("div", { className: "preview__shadow" }),
    ],
  });
}

function createCategoryItem(name, emojis) {
  return createElement("li", {
    className: "category__item",
    children: [
      createElement("button", {
        className: "category__button",
        attrs: { type: "button", "data-category": name, "aria-pressed": "false" },
        children: [
          createElement("span", { className: "category__icon", text: emojis[0] }),
          createElement("span", {
            className: "category__text",
            children: [
              createElement("span", { className: "category__name", text: name }),
              createElement("span", { className: "category__caption", text: `${emojis.length} pairs` }),
            ],
          }),
          createElement("span", { className: "category__radio", attrs: { "aria-hidden": "true" } }),
        ],
      }),
    ],
  });
}

function createDesignItem(name) {
  return createElement("li", {
    className: "design__item",
    children: [
      createElement("button", {
        className: `design__button ${getDesignClass(name)}`,
        attrs: { type: "button", "data-design": name, "aria-pressed": "false" },
        children: [
          createElement("span", {
            className: "design__swatch",
            children: [createElement("span", { className: "card__back" })],
          }),
          createElement("span", { className: "design__name", text: name }),
        ],
      }),
    ],
  });
}

function toggleSelection(previous, next, activeClass) {
  if (previous) {
    previous.classList.remove(activeClass);
    previous.setAttribute("aria-pressed", "false");
  }

  next.classList.add(activeClass);
  next.setAttribute("aria-pressed", "true");

  return next;
}
