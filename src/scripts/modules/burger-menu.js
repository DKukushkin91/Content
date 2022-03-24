export const getBurgerMenu = () => {
	if(document.querySelector('.js-burger')){
		const button = document.querySelector('.js-burger');
		const menu = document.querySelector('.js-menu');
		const body = document.querySelector('body');

		const burgerMenuHandler = () => {
			menu.classList.toggle('side-block--active');
			button.classList.toggle('header__btn--open');
			body.classList.toggle('lock-scroll');
			body.classList.toggle('add-bg');
		}

		button.addEventListener('click', burgerMenuHandler);
	}
}
