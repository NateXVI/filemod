//
//

class Filemod {
	// class that manages file modification
	constructor(params = {}) {
		// define defaults
		this.state = {
			directory: '',
			modifiers: [],
		};

		// overwrite defaults if any are given
		this.state = {
			...this.state,
			...params,
		};
	}

	removeModifier(id) {
		console.log(id);

		try {
			const index = this.state.modifiers.findIndex((item) => {
				return item.uuid == id;
			});

			this.state.modifiers.splice(index, 1);

			console.log(index);
		} catch (error) {}

		this.rerenderModifiers();
	}

	postRender() {
		for (let i in this.state.modifiers) {
			this.state.modifiers[i].postRender();
		}
	}

	getModifierById(id) {
		return this.state.modifiers.find((item) => {
			return item.uuid == id;
		});
	}

	getModifierIndexById(id) {
		return this.state.modifiers.findIndex((item) => {
			return item.uuid == id;
		});
	}

	renderModifiers() {
		// returns html for the modifiers
		let view = '';

		for (let i in this.state.modifiers) {
			const mod = this.state.modifiers[i];

			view += `<div class="modifier">
			<header class="modifier-header">
				<p class="modifier-title">${mod.title}</p>
				<div class="modifier-buttons">
					<button id="remove-${mod.uuid}" class="remove-button">X</button>
					${
						mod.minimized
							? `<button id="expand-${mod.uuid}" class="modifier-button">+</button>`
							: `<button id="collapse-${mod.uuid}" class="modifier-button">--</button>`
					}
				</div>
			</header>
			<div class="${mod.minimized ? 'hidden ' : ''}modifier-render">${mod.render()}</div>
			</div>`;
		}

		return view;
	}

	renderPreview() {
		// return html for the preview
		this.save();
		if (this.state.directory === '') return '';

		let view = '';
		let fileList = this.getStarting();

		for (let i in this.state.modifiers) {
			const mod = this.state.modifiers[i];

			fileList = mod.preview(fileList);
		}

		for (let i in fileList) {
			view += `<p class="nowrap">${fileList[i]}</p><br/>`;
		}

		return view;
	}

	rerenderModifiers() {
		// calls rerender event

		const event = new Event('render modifiers');
		document.dispatchEvent(event);
	}

	rerenderPreview() {
		// calls rerender event

		const event = new Event('render preview');
		document.dispatchEvent(event);
	}

	async modify() {
		// executes modifiers
		if (this.state.directory === '') return;

		let fileList = this.getStarting();

		for (let i in this.state.modifiers) {
			let mod = this.state.modifiers[i];

			fileList = await mod.modify(fileList);
			console.log(mod.title, fileList);
		}

		this.rerenderPreview();
	}

	save() {
		let mods = [];
		for (let i in this.state.modifiers) {
			mods.push(JSON.parse(this.state.modifiers[i].getJSON()));
		}

		let saveObject = {
			directory: this.state.directory,
			modifiers: mods,
		};

		localStorage.setItem('state-save', JSON.stringify(saveObject));
	}

	loadState(state) {
		// loads given state
		// doesn't change state values not given.

		this.state = {
			...this.state,
			...state,
		};

		this.rerender();
	}

	getDirectory() {
		return this.state.directory;
	}

	setDirectory(dir) {
		// sets the directory
		this.state.directory = dir;
		this.rerenderPreview();
	}

	addModifier(modType, state = {}) {
		// adds a modifier
		// modType can be a class or string
		// state is the desired state for the modifier being added

		// lookup table for when the given modType is a string
		const lookup = {};
		lookup[new Modifier().name] = Modifier;
		lookup[new SeriesModifier().name] = SeriesModifier;
		lookup[new MoveModifier().name] = MoveModifier;
		lookup[new TorrentModifier().name] = TorrentModifier;
		lookup[new FilterExtModifier().name] = FilterExtModifier;

		// holds the modifier class to be created
		let c;

		// if modType is a string, look for it on the lookup table
		// and return if it doesn't exist
		if (typeof modType === 'string') {
			if (lookup[modType]) {
				c = lookup[modType];
			} else {
				return console.log(`"${modType}" not is not on the modifier lookup table`);
			}
		}
		// if modType isn't a string, set c equal to it
		else {
			c = modType;
		}

		// try to instance and add class
		try {
			let mod = new c(state);
			this.state.modifiers.push(mod);
		} catch (error) {
			console.log('could not add modifier', error);
		}

		this.rerenderModifiers();
	}

	async getDirectoryFromUser() {
		let val = await fileDialog({ type: 'directory' });
		return val[0];
	}

	getStarting() {
		if (this.directory == '') return [];
		// gets starting fileList
		try {
			let starting = fs.readdirSync(this.state.directory);
			let removeList = [];
			for (let i in starting) {
				starting[i] = path.join(this.state.directory, starting[i]);
				let stats = fs.statSync(starting[i]);
				if (stats.isDirectory()) {
					removeList.push(i);
				}
			}

			for (let i = removeList.length - 1; i >= 0; i--) {
				starting.splice(removeList[i], 1);
			}

			return starting;
		} catch (error) {
			console.log("couldn't get starting file list", error);
			return [];
		}
	}
}
