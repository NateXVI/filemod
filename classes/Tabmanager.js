//
//
class TabManager {
	constructor(params = {}) {
		this.modifiersSection = document.getElementById('modifiers');
		this.previewSection = document.getElementById('previews');
		this.directoryText = document.getElementById('directory');
		this.modifyButton = document.getElementById('modify-button');
		this.addButton = document.getElementById('add-button');
		this.dropdownContent = document.getElementById('dropdown-content');
		this.dropButtons = document.getElementsByClassName('dropbtn');
		this.dropdownContent.hidden = true;

		for (let i = 0; i < this.dropButtons.length; i++) {
			let btn = this.dropButtons[i];

			btn.addEventListener('click', (event) => {
				let type = event.target.innerHTML;
				this.addModifier(type);
			});
		}

		this.addButton.addEventListener('click', () => {
			this.dropdownContent.hidden = false;
		});

		document.addEventListener('click', (event) => {
			if (event.target.id != 'add-button') this.dropdownContent.hidden = true;
		});

		this.tab = 0;

		this.state = {
			tabs: [new Filemod({ modifiers: [new SeriesModifier()] })],
			...params,
		};
	}

	renderModifiers(tabNumber = this.tab) {
		if (this.state.tabs[tabNumber]) {
			this.modifiersSection.innerHTML = this.state.tabs[tabNumber].renderModifiers();

			// add events for buttons
			const removeButtons = document.getElementsByClassName('remove-button');
			for (let i = 0; i < removeButtons.length; i++) {
				let btn = removeButtons[i];
				btn.addEventListener('dblclick', (event) => {
					let id = event.target.id.split('-')[1];
					console.log(id);
					this.state.tabs[tabNumber].removeModifier(id);
				});
			}

			const minButtons = document.getElementsByClassName('modifier-button');
			for (let i = 0; i < minButtons.length; i++) {
				let btn = minButtons[i];

				btn.addEventListener('click', () => {
					let type = btn.id.split('-')[0];
					let id = btn.id.split('-')[1];
					let index = this.state.tabs[tabNumber].getModifierIndexById(id);

					if (type === 'collapse') {
						this.state.tabs[tabNumber].state.modifiers[tabNumber].minimized = true;
					}

					if (type === 'expand') {
						this.state.tabs[tabNumber].state.modifiers[tabNumber].minimized = false;
					}

					this.renderTabModifiers(tabNumber);
				});
			}
		} else {
			console.log('tab does not exist');
		}
	}

	renderPreview(tabNumber = this.tab) {
		console.log('rendering preview');
		try {
			this.previewSection.innerHTML = this.state.tabs[this.tab].renderPreview();
		} catch (error) {}
	}

	addModifier(type, tabNumber = this.tab) {
		this.state.tabs[tabNumber].addModifier(type);
	}
}
