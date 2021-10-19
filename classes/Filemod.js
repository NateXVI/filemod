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

		this.modifying = false;
	}

	// GENERAL FUNCTIONS
	// GENERAL FUNCTIONS
	defaults() {
		// returns default state
		return {
			directory: '',
			modifiers: [],
		};
	}

	async modify() {
		// executes modifiers
		// is asychronous because some modifiers like downloads take time

		// don't modify files if no directory is selected
		if (this.state.directory === '') return;
		if (this.modifying) return console.log('skipped');
		try {
			this.modifying = true;
			// get the starting file list and modify it
			let fileList = this.getStarting();
			for (let i in this.state.modifiers) {
				let mod = this.state.modifiers[i];
				this.state.modifiers[i].isActive = true;
				fileList = await mod.modify(fileList);
				this.state.modifiers[i].isActive = false;
				console.log(mod.title, fileList);

				this.modifying = false;
			}
		} catch (error) {
			this.modifying = false;
		}
	}

	getStarting() {
		// returns the files that the modifiers will start with
		// it filters out directories

		if (this.directory == '') return [];

		// read the directory and remove all the folders from it
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
			// if something goes wrong, return an empty list and warn in the console
			console.warn("couldn't get starting file list", error);
			return [];
		}
	}

	// RENDER FUNCTIONS
	// RENDER FUNCTIONS
	renderModifiers() {
		// returns html for the modifiers
		let view = '';

		for (let i in this.state.modifiers) {
			const mod = this.state.modifiers[i];

			view += `<div class="${mod.isActive ? 'green-border ' : ''}modifier">
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

		// if there isn't a directory selected return an empty string
		if (this.state.directory === '') return '';

		let view = '';

		// get the starting files from the directory
		let fileList = this.getStarting();

		// loop through the modifiers and get predicted the file list
		for (let i in this.state.modifiers) {
			const mod = this.state.modifiers[i];
			fileList = mod.preview(fileList);
		}

		// put every file name in it's own p tag
		for (let i in fileList) {
			view += `<p class="nowrap">${fileList[i]}</p><br/>`;
		}

		return view;
	}

	rerenderModifiers() {
		// calls rerender event for modifiers
		const event = new Event('render modifiers');
		document.dispatchEvent(event);
	}

	rerenderPreview() {
		// calls rerender for file preview event
		const event = new Event('render preview');
		document.dispatchEvent(event);
	}

	removeModifier(id) {
		// removes modifier with specific id
		try {
			// try to find the modifier with matchin id
			const index = this.state.modifiers.findIndex((item) => {
				return item.uuid == id;
			});

			// remove the modifier
			this.state.modifiers.splice(index, 1);
		} catch (error) {
			console.log('unable to remove modifier', error);
		}

		// rerender the modifiers to show changes
		this.rerenderModifiers();
	}

	postRender() {
		// calls the post render method on all the modifiers
		// used to add document event listeners
		for (let i in this.state.modifiers) {
			this.state.modifiers[i].postRender();
		}
	}

	// MODIFIER FUNCTIONS
	// MODIFIER FUNCTIONS
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

	getModifierById(id) {
		// find the index of the modifier
		const index = this.state.modifiers.findIndex((item) => {
			return item.uuid == id;
		});

		// if modifier doesn't exist throw an error
		if (index < 0) throw `could not find modifier with id ${id}`;
	}

	getModifierIndexById(id) {
		// returns index of modifier with specific id
		// returns -1 when cannot find modifier
		return this.state.modifiers.findIndex((item) => {
			return item.uuid == id;
		});
	}

	// SAVING/LOADING FUNCTIONS
	// SAVING/LOADING FUNCTIONS
	getJSON() {
		// add all the modifiers to the mods array
		let mods = [];
		for (let i in this.state.modifiers) {
			mods.push(JSON.parse(this.state.modifiers[i].getJSON()));
		}

		// store the modifiers and directory, then save to local storage
		let saveObject = {
			directory: this.state.directory,
			modifiers: mods,
		};
		return JSON.stringify(saveObject);
	}

	loadState(state) {
		// loads given state
		// doesn't change state values not given.

		this.state = {
			...this.state,
			...this.defaults(),
		};

		this.rerenderModifiers();
		this.rerenderPreview();
	}

	onLoad() {
		for (let i = 0; i < this.state.modifiers.length; i++) {
			this.state.modifiers[i].onLoad();
		}
	}

	// DIRECTORY FUNCTIONS
	// DIRECTORY FUNCTIONS
	getDirectory() {
		// returns working directory
		return this.state.directory;
	}

	setDirectory(dir) {
		// sets the directory
		this.state.directory = dir;
		this.rerenderPreview();
	}

	async getDirectoryFromUser() {
		// triggers file dialog for user to select a folder and returns path of it
		// so far it has only worked on Window
		// tested on MacOS but it did not work
		let val = await fileDialog({ type: 'directory' });
		return val[0];
	}

	async getFileFromUser() {
		// triggers file dialog for user to select a file and returns path of it
		// so far it has only worked on Window
		// tested on MacOS but it did not work
		let val = await fileDialog({ type: 'open-file' });
		return val[0];
	}

	generateUuid() {
		// rerurns a new uuid
		return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
}
