export const popupForm = () => {
	if(document.querySelector('.js-popup-btn')) {
		const body = document.querySelector('body');
		const buttons = document.querySelectorAll('.js-popup-btn');
		const popupTemplate = document.querySelector('.js-template')
			.content
			.querySelector('.form');

		const createElement = (element, fragment) => element.appendChild(fragment);

		const escPressHandler = (evt) => {
			if (evt.key === 'Escape') {
				evt.preventDefault();
				elementRemoveHandler();
			}
		};

		const elementRemoveHandler = () => {
			const form = document.querySelector('.form');

			if (form) {
				form.remove();
				document.removeEventListener('keydown', escPressHandler);
			}

			body.classList.remove('lock-scroll');
		};

		const getElement = (target) => {
			const template = popupTemplate.cloneNode(true);
			const sendBtn = template.querySelector('.js-btn-text');
			const legend = template.querySelector('.js-legend');
			const closeBtn = template.querySelector('.js-close-btn');
			const calendar = template.querySelectorAll('.js-calendar');

			sendBtn.textContent = target.textContent;
			legend.textContent = target.textContent;

			if(sendBtn.textContent !== 'Создать'){
				sendBtn.classList.add('form__btn--color')
			}

			calendar.forEach(el => {
				new AirDatepicker(el, {
					minDate: new Date(),
					autoClose: true,
					position: 'bottom center',
					onSelect({formattedDate}){
						el.setAttribute('data-date', `${formattedDate}`)
						if(el.dataset.length !== 0) {
							el.parentNode.querySelector('.form__text').style.display = 'block';
						}
					}
				})
			})

			closeBtn.addEventListener('click', elementRemoveHandler);
			return template
		}

		const appendElement = (target) => {
			const fragment = document.createDocumentFragment();
			const element = getElement(target);

			fragment.appendChild(element);

			document.addEventListener('keydown', escPressHandler);
			createElement(body, fragment);
			body.classList.toggle('lock-scroll');
		}

		buttons.forEach(el => el.addEventListener('click', (evt) => {
			appendElement(evt.target);
		}))
	}
}
