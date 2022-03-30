export const textFormatting = () => {
	if(document.querySelector('.js-formatting-text')) {
		const MAX_LENGTH = 154;
		const DESKTOP_WIDTH = 1024;
		const texts = document.querySelectorAll('.js-formatting-text');
		const widthHandler = window.matchMedia('(max-width: 1024px)');

		const getFormattingText = () => {
			texts.forEach(el => {
				if(window.innerWidth > DESKTOP_WIDTH && el.textContent.length >= MAX_LENGTH) {
					el.textContent = el.textContent.substring(0, MAX_LENGTH).concat(' ...')
				} else {
					el.textContent = el.textContent;
				}
			});
		}

		widthHandler.addEventListener('change', (e) => {
			if(e.matches) {
				texts.forEach(el => el.textContent);
				document.location.reload()
			}else{
				getFormattingText();
			}
		})

		getFormattingText();
	}
}
