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
		this.tabSection = document.getElementById('tabs');
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
			tabs: [
				new Filemod({ modifiers: [new SeriesModifier()] }),
				new Filemod({ modifiers: [new SeriesModifier()] }),
				new Filemod({ modifiers: [new SeriesModifier()] }),
			],
			...params,
		};
	}

	renderTabs() {
		let view = '';
		for (let i = 0; i < this.state.tabs.length; i++) {
			view += `
			<div class="tab" id="tab-${i}">
				<p>Tab ${i + 1}</p>
				<button id="remove-tab-${i}" class="close-tab-button">X</button>
			</div>
			`;

			let tabElements = document.getElementsByClassName('tab');
			console.log(tabElements);

			for (let i in this.state.tabs) {
				console.log(`tab-${i}`);
				// document.getElementById(`tab-${i}`).addEventListener('click', (event) => {
				// 	this.switchTab(i);
				// });
			}
		}
		this.tabSection.innerHTML = view;

		for (let i = 0; i < this.state.tabs.length; i++) {
			// let tabButton = document.getElementById(`tab-${i}`);
			// tabButton.addEventListener('click', (event) => {
			// 	let tabNumber = event.target.id.split('-')[1];
			// 	this.switchTab(tabNumber);
			// });
		}
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
						this.state.tabs[tabNumber].state.modifiers[index].minimized = true;
					}

					if (type === 'expand') {
						this.state.tabs[tabNumber].state.modifiers[index].minimized = false;
					}

					this.renderModifiers(tabNumber);
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

	removeTab(tabNumber) {
		if (!this.state.tabs[tabNumber]) return;

		this.state.tabs.splice(tabNumber, 1);
	}

	switchTab(tabNumber) {
		if (!this.state.tabs[tabNumber]) return;

		this.tab = tabNumber;
		this.renderTabs();
		this.renderModifiers();
	}
}
