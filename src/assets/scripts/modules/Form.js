import Pristine from 'pristinejs';

const formConfig = {
	classTo: 'input',
	errorClass: '_error',
	successClass: '_success',
	errorTextParent: 'input',
	errorTextTag: 'p',
	errorTextClass: 'input__desc',
};

class Form {
	constructor() {
		this.init();
	}

	init() {
		const forms = document.querySelectorAll('[data-form]');

		forms.forEach((form) => {
			const pristine = new Pristine(form, formConfig);
			const submitButton = form.querySelector('button[type="submit"]');
			submitButton.setAttribute('disabled', '');

			form.querySelectorAll('input, textarea').forEach((input) => {
				input.addEventListener('input', () => {
					pristine.validate({}, true)
						? submitButton.removeAttribute('disabled')
						: submitButton.setAttribute('disabled', '');
				});
			});

			form.addEventListener('submit', (e) => {
				e.preventDefault();

				const valid = pristine.validate(); // returns true or false

				if (valid) {
					const formData = new FormData(form);

					fetch('/', {
						method: 'POST',
						body: formData,
					});

					pristine.reset();
					form.reset();
					submitButton.setAttribute('disabled', '');
				}
			});
		});
	}
}

export default new Form();
