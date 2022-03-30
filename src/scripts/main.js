import { getBurgerMenu } from "./modules/burger-menu";
import { popupForm } from "./modules/popup";
import { textFormatting } from "./modules/text-formatting";

document.addEventListener('DOMContentLoaded', () => {
  getBurgerMenu();
	popupForm();
	textFormatting();
});
