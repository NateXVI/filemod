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

	renderModifiers() {
		// returns html for the modifiers
		let view = '';

		for (let i in this.state.modifiers) {
			const mod = this.state.modifiers[i];

			view += `<div class="modifier">
			<p class="modifier-title">${mod.title}</p>
			<div class="modifier-render">${mod.render()}</div>
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

			fileList = mod.modify(fileList);
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
	}

	async getDirectoryFromUser() {
		let val = await fileDialog({ type: 'directory' });
		return val[0];
	}

	getStarting() {
		// gets starting fileList
		try {
			let starting = fs.readdirSync(this.state.directory);

			for (let i in starting) {
				starting[i] = path.join(this.state.directory, starting[i]);
			}

			return starting;
		} catch (error) {
			console.log("couldn't get starting file list", error);
			return [];
		}
	}
}
