const CATEGORIES_URL = "./assets/categories.json";
const DESIGNS = ["notebook", "waves", "checker", "peas", "gingham", "bars"];
const DESIGN_CLASS_PREFIX = "card__list_";

const sidebar = document.querySelector("#sidebar");
const tabList = sidebar.querySelector(".sidebar__tabs");
const tabs = [...tabList.querySelectorAll(".sidebar__tab")];
const categoryList = sidebar.querySelector(".category__list");
const designList = sidebar.querySelector(".design__list");
const preview = sidebar.querySelector(".preview");
const previewFront = sidebar.querySelector(".preview__front");
const closeButton = sidebar.querySelector(".sidebar__close");
const status = sidebar.querySelector(".sidebar__status");
const openButton = document.querySelector("[data-sidebar-open]");
const cardList = document.querySelector(".game .card__list");

const statusText = {
  categories: "",
  designs: `${DESIGNS.length} card designs`,
};

let categories = {};
let activeTab = tabs[0];
let selectedCategory = null;
let selectedDesign = null;

openButton.addEventListener("click", openSidebar);
sidebar.addEventListener("click", onSidebarClick);
tabList.addEventListener("click", onTabListClick);
tabList.addEventListener("keydown", onTabListKeydown);
categoryList.addEventListener("click", onCategoryListClick);
designList.addEventListener("click", onDesignListClick);

renderDesigns();
renderCategories();

async function renderCategories() {
  categories = await fetch(CATEGORIES_URL).then((res) => res.json());

  const entries = Object.entries(categories);

  categoryList.innerHTML = entries
    .map(
      ([name, emojis]) => `
        <li class="category__item">
          <button type="button" class="category__button" data-category="${name}" aria-pressed="false">
            <span class="category__icon">${emojis[0]}</span>
            <span class="category__name">${name}</span>
            <span class="category__radio" aria-hidden="true"></span>
          </button>
        </li>`,
    )
    .join("");

  statusText.categories = `${entries.length} categories`;
  updateStatus();
  selectCategory(categoryList.querySelector(".category__button"));
}

function renderDesigns() {
  designList.innerHTML = DESIGNS.map(
    (name) => `
      <li class="design__item">
        <button type="button" class="design__button ${DESIGN_CLASS_PREFIX}${name}" data-design="${name}" aria-pressed="false">
          <span class="design__swatch">
            <span class="card__back"></span>
          </span>
          <span class="design__name">${name}</span>
        </button>
      </li>`,
  ).join("");

  selectDesign(designList.querySelector(".design__button"));
}

function openSidebar() {
  sidebar.classList.add("sidebar_opened");
  sidebar.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", onEscapePress);
  closeButton.focus();
}

function closeSidebar() {
  sidebar.classList.remove("sidebar_opened");
  sidebar.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onEscapePress);
  openButton.focus();
}

function onSidebarClick(e) {
  if (e.target.closest("[data-sidebar-close]")) {
    closeSidebar();
  }
}

function onEscapePress(e) {
  if (e.key === "Escape") {
    closeSidebar();
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
  activeTab.classList.remove("sidebar__tab_active");
  activeTab.setAttribute("aria-selected", "false");
  activeTab.setAttribute("tabindex", "-1");
  document.getElementById(activeTab.getAttribute("aria-controls")).hidden = true;

  activeTab = tab;
  tab.classList.add("sidebar__tab_active");
  tab.setAttribute("aria-selected", "true");
  tab.removeAttribute("tabindex");
  document.getElementById(tab.getAttribute("aria-controls")).hidden = false;

  updateStatus();
}

function updateStatus() {
  status.textContent = statusText[activeTab.dataset.tab];
}

function onCategoryListClick(e) {
  const button = e.target.closest(".category__button");

  if (button) {
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
  previewFront.textContent = categories[button.dataset.category][0];
}

function selectDesign(button) {
  selectedDesign = toggleSelection(selectedDesign, button, "design__button_active");
  applyDesign(button.dataset.design);
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

function applyDesign(name) {
  [preview, cardList].forEach((element) => {
    DESIGNS.forEach((design) => element.classList.remove(`${DESIGN_CLASS_PREFIX}${design}`));
    element.classList.add(`${DESIGN_CLASS_PREFIX}${name}`);
  });
}
