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

		if (container.classList.contains('_tel')) {
			this.telInput = container.querySelector('input');

			const iti = intlTelInput(this.telInput, {
				utilsScript: UTILS_PATH,
				initialCountry: 'auto',
				geoIpLookup: function (callback) {
					fetch('https://ipapi.co/json')
						.then((res) => res.json())
						.then((data) => {
							callback(data.country_code);
						})
						.catch(() => {
							callback('ru');
						});
				},
				autoPlaceholder: 'polite',
				dropdownContainer: container,
				nationalMode: true,
				separateDialCode: true,
				customPlaceholder: function (selectedCountryPlaceholder) {
					return selectedCountryPlaceholder;
				},
			});

			this.telInput.addEventListener('countrychange', () => {
				if (this.telInput.mask) {
					this.telInput.mask.updateOptions({
						mask: getInputMask(this.telInput),
					});

					this.telInput.mask.unmaskedValue = '';
				}
			});

			iti.promise.then(() => {
				this.telInput.mask = IMask(this.telInput, {
					mask: getInputMask(this.telInput),
				});
			});
		}
	}
}

export default Input;
