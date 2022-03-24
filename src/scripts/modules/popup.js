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
			const sendBtn = template.querySelector('.js-send-btn');
			const legend = template.querySelector('.js-legend');
			const closeBtn = template.querySelector('.js-close-btn');
			const calendar = template.querySelectorAll('.js-calendar');
			const popupForm = template.querySelector('.form__element');

			sendBtn.textContent = target.textContent;
			legend.textContent = target.textContent;

			if(sendBtn.textContent !== 'Создать'){
				sendBtn.classList.add('form__btn--color')
			}

			calendar.forEach(el => {
				new AirDatepicker(el, {
					minDate: new Date(),
					autoClose: true,
					container: template.querySelector('.form__element'),
					position: 'bottom center',

					onSelect({formattedDate}){
						el.value = `${formattedDate}` === 'undefined' ? `` : `${formattedDate}`;

						if(el.value.length !== 0 || el.value !== 'undefined') {
							el.parentNode.querySelector('.form__text').style.display = 'block';
						}
					},
				})
			})

			closeBtn.addEventListener('click', elementRemoveHandler);
			popupForm.addEventListener('submit', validateForm);
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
			const form = document.querySelector('.form');

			if(!form){
				appendElement(evt.target);
			}
		}))

		const validateForm = (evt) => {
			const form = evt.target;
			const field = Array.from(form.querySelectorAll('input'));

			field.forEach(el => {
				if(el.value !== '' || el.value !== undefined) {
					el.parentElement.classList.remove('.form__input-wrap--invalid');
				}
			})

			field.forEach(el => {
				if(el.value === '' || el.value === undefined){
					evt.preventDefault();
					el.parentElement.classList.add('form__input-wrap--invalid');
				}
			})
		}
	}
}
