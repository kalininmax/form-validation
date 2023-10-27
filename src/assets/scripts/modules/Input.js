import intlTelInput from 'intl-tel-input';
import IMask from 'imask';

const UTILS_PATH = '/assets/scripts/lib/intl-tel-input-utils.js';

const getInputMask = (input) => input.placeholder.replace(/[0-9]/g, '0');

class Input {
	constructor(container) {
		this.init(container);
	}

	init(container) {
		this.container = container;

		if (!this.container) {
			return;
		}

		this.inputForm = this.container.closest('form');

		if (container.classList.contains('_tel')) {
			this.telInput = container.querySelector('input');

			const iti = intlTelInput(this.telInput, {
				utilsScript: UTILS_PATH,
				initialCountry: 'auto',
				geoIpLookup: this.getCountryCode,
				autoPlaceholder: 'polite',
				dropdownContainer: container,
				nationalMode: true,
				separateDialCode: true,
				customPlaceholder: (selectedCountryPlaceholder) =>
					selectedCountryPlaceholder,
			});

			this.telInput.addEventListener('countrychange', () => {
				if (this.telInput.mask) {
					this.updateInputTelMask();
					this.updateInputTelValidation();
				}
			});

			iti.promise.then(() => {
				this.initInputTelMask();
				this.initInputTelValidation();
			});
		}
	}

	updateInputTelMask() {
		const inputMask = getInputMask(this.telInput);
		this.telInput.mask.updateOptions({ mask: inputMask });
		this.telInput.mask.unmaskedValue = '';
		this.telInput.setAttribute('minlength', inputMask.length);
	}

	updateInputTelValidation() {
		this.inputForm.validate.removeField(this.inputForm.inputs.phone);
		this.initInputTelValidation();
	}

	initInputTelMask() {
		const inputMask = getInputMask(this.telInput);
		this.telInput.mask = IMask(this.telInput, { mask: inputMask });
		this.telInput.setAttribute('minlength', inputMask.length);
	}

	initInputTelValidation() {
		this.inputForm.validate.addField(
			this.inputForm.inputs.phone,
			[
				{
					rule: 'required',
					errorMessage: 'Пожалуйста введите ваш телефон',
				},
				{
					rule: 'minLength',
					value: this.inputForm.inputs.phone.minLength,
					errorMessage: 'Пожалуйста введите телефон в указанном формате',
				},
			],
			{
				errorsContainer: this.inputForm.inputs.phone.closest('.input-group'),
			}
		);
	}

	getCountryCode(callback) {
		fetch('https://ipapi.co/json')
			.then((res) => res.json())
			.then((data) => {
				callback(data.country_code);
			})
			.catch(() => {
				callback('ru');
			});
	}
}

export default Input;
