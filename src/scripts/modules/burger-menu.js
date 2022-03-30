export const getBurgerMenu = () => {
	if(document.querySelector('.js-burger')){
		const button = document.querySelector('.js-burger');
		const menu = document.querySelector('.js-menu');
		const body = document.querySelector('body');

		const burgerMenuHandler = () => {
			menu.classList.toggle('side-block--active');
			button.classList.toggle('header__btn--open');
			body.classList.toggle('lock-scroll--mobile');
			body.classList.toggle('add-bg');
		}

		const removeClassesHandler = (evt) => {
			if(window.innerWidth >= 1024) {
				body.classList.remove('add-bg')
				menu.classList.remove('side-block--active');
				button.classList.remove('header__btn--open');
				body.classList.remove('lock-scroll--mobile');
			}
		}

		window.addEventListener('resize', removeClassesHandler);
		button.addEventListener('click', burgerMenuHandler);
	}
}
