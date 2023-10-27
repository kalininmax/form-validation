import JustValidate from 'just-validate';

class JustValidateForm {
	constructor() {
		this.init();
	}

	init() {
		const form = document.querySelector('[data-form="feedback"]');

		form.validate = new JustValidate('[data-form="feedback"]');

		form.inputs = {
			name: form.querySelector('#feedback-form-name'),
			email: form.querySelector('#feedback-form-email'),
			phone: form.querySelector('#feedback-form-phone'),
			message: form.querySelector('#feedback-form-message'),
			agreement: form.querySelector('#feedback-form-agreement'),
		};

		form.validate
			.addField(
				form.inputs.name,
				[
					{
						rule: 'required',
						errorMessage: 'Пожалуйста введите ваше имя',
					},
				],
				{
					errorsContainer: form.inputs.name.closest('.input-group'),
				}
			)
			.addField(
				form.inputs.email,
				[
					{
						rule: 'required',
						errorMessage: 'Пожалуйста введите ваш адрес электронной почты',
					},
					{
						rule: 'email',
						errorMessage:
							'Пожалуйста введите корректный адрес электронной почты',
					},
				],
				{
					errorsContainer: form.inputs.email.closest('.input-group'),
				}
			)
			.addField(
				form.inputs.message,
				[
					{
						rule: 'required',
						errorMessage: 'Пожалуйста введите ваше сообщение',
					},
					{
						rule: 'minLength',
						value: 10,
						errorMessage: 'Сообщение должно содержать минимум 10 символов',
					},
				],
				{
					errorsContainer: form.inputs.message.closest('.input-group'),
				}
			)
			.addField(
				form.inputs.agreement,
				[
					{
						rule: 'required',
						errorMessage:
							'Подтвердите согласие на обработку персональных данных',
					},
				],
				{
					errorsContainer: form.inputs.agreement.closest('.input-group'),
				}
			);

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (form.validate.isValid) {
				const formData = new FormData(form);

				fetch('/', {
					method: 'POST',
					body: formData,
				}).then(() => {
					form.reset();
					form.validate.refresh();
				});
			}
		});
	}
}

export default new JustValidateForm();
