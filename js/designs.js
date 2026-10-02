export const DESIGNS = ["notebook", "waves", "checker", "peas", "gingham", "bars"];

const DESIGN_CLASS_PREFIX = "card__list_";

export function getDesignClass(name) {
  return `${DESIGN_CLASS_PREFIX}${name}`;
}

export function applyDesign(element, name) {
  DESIGNS.forEach((design) => element.classList.remove(getDesignClass(design)));
  element.classList.add(getDesignClass(name));
}
