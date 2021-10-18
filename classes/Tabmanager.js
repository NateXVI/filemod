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
		this.addTabButton = document.getElementById('add-tab-button');

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

		this.modifyButton.addEventListener('click', () => this.modify());

		this.addTabButton.addEventListener('click', () => this.newTab());

		this.directoryText.addEventListener('click', async (event) => {
			if (this.state.tabs[this.tab]) {
				try {
					let newDir = await this.getDirectoryFromUser();
					this.state.tabs[this.tab].setDirectory(newDir);
					event.target.innerHTML = newDir;
				} catch (error) {}
			}
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

		for (let i = 0; i < this.state.tabs; i++) {
			this.state.tabs[i].onLoad();
		}
	}

	modify(tabNumber = this.tab) {
		if (this.state.tabs[tabNumber]) {
			console.log('modify', tabNumber);
			this.state.tabs[tabNumber].modify();
		}
	}

	renderTabs() {
		let view = '';
		for (let i = 0; i < this.state.tabs.length; i++) {
			view += `
			<div class="${i == this.tab ? 'tab-highlight ' : ''}tab" id="tab-${i}">
				<p>Tab ${i + 1}</p>
				<button id="close-tab-${i}" class="close-tab-button">X</button>
			</div>
			`;
		}
		this.tabSection.innerHTML = view;

		for (let i = 0; i < this.state.tabs.length; i++) {
			let tabButton = document.getElementById(`tab-${i}`);
			tabButton.addEventListener('click', (event) => {
				let tabNumber = event.target.id.split('-')[1];
				this.switchTab(tabNumber);
			});

			let closeTabButton = document.getElementById(`close-tab-${i}`);
			closeTabButton.addEventListener('dblclick', (event) => {
				let tabNumber = event.target.id.split('-')[2];
				this.removeTab(tabNumber);
			});
		}
	}

	renderModifiers(tabNumber = this.tab) {
		if (this.state.tabs[tabNumber]) {
			this.modifiersSection.innerHTML = this.state.tabs[tabNumber].renderModifiers();
			this.state.tabs[tabNumber].postRender();

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

	renderAll() {
		this.renderTabs();
		this.renderModifiers();
		this.renderPreview();
	}

	addModifier(type, tabNumber = this.tab) {
		this.state.tabs[tabNumber].addModifier(type);
	}

	removeTab(tabNumber) {
		if (!this.state.tabs[tabNumber] || this.state.tabs.length <= 1) return;

		this.state.tabs.splice(tabNumber, 1);

		this.tab = Math.min(Math.max(this.tab, 0), this.state.tabs.length - 1);

		this.renderTabs();
		this.renderModifiers();
		this.renderPreview();
	}

	newTab() {
		this.state.tabs.push(new Filemod());
		this.tab = this.state.tabs.length - 1;

		this.renderAll();
	}

	switchTab(tabNumber) {
		if (!this.state.tabs[tabNumber]) return;

		this.tab = tabNumber;
		this.renderTabs();
		this.renderModifiers();
	}

	async getDirectoryFromUser() {
		// triggers file dialog for user to select a folder and returns path of it
		// so far it has only worked on Window
		// tested on MacOS but it did not work
		console.log('getting directory');
		let val = await fileDialog({ type: 'directory' });
		return val[0];
	}
}
