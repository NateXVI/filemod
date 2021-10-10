//
//
class Modifier {
	// base modifier class

	// name that should match what is on the lookup table in Filemod.addModifier method
	name = 'modifier';

	// tilte to be read by the user
	title = 'Modifier';

	constructor(params = {}) {
		// assign uuid
		this.uuid = this.generateUuid();

		this.minimized = false;

		// define defaults
		this.state = this.defaults();

		// overwrite defaults if any are given
		this.state = {
			...this.state,
			...params,
		};
	}

	defaults() {
		// method that returns class defaults
		// this is used to the constructor doesn't have to be rewritten when class is extended
		return {};
	}

	onLoad() {}

	preview(fileList) {
		// returns a preview of what the modified file list would look like, but dosn't apply modifications

		return fileList;
	}

	async modify(fileList) {
		// modifys and returns fileList

		return fileList;
	}

	render() {
		// returns html for the modifier options

		return "<p>This modifier doesn't do anything</p>";
	}

	postRender() {}

	async getDirectoryFromUser() {
		let val = await fileDialog({ type: 'directory' });
		return val[0];
	}
	async getFileFromUser() {
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

	getFileName(filePath) {
		// returns the file name from the file path

		return path.basename(filePath);
	}

	getFileType(filePath) {
		// returns the file type (based off file extension)

		return path.extname(filePath);
	}

	getFileDir(filePath) {
		// returns the directory the file is in

		return path.dirname(filePath);
	}

	renameFilePreview(filePath, name) {
		// retunrs what would it would look like if you rename a file
		let dir = this.getFileDir(filePath);
		let ext = this.getFileType(filePath);

		return dir + '/' + name + ext;
	}

	saveState() {}

	getJSON() {
		// returns modifier saved as a JSON object
		let a = {
			type: this.name,
			state: this.state,
		};

		return JSON.stringify(a);
	}

	renameFile(filePath, name) {
		// renames file
		name = name + this.getFileType(filePath);
		let dir = this.getFileDir(filePath);
		let newName = path.join(dir, name);

		if (newName != filePath) {
			try {
				try {
					fs.readFileSync(newName);
					console.log('file not renamed because file already exists with that name');
				} catch (error) {
					fs.renameSync(filePath, newName);
					return newName;
				}
			} catch (error) {
				console.log('could not rename file', error);
				return filePath;
			}
		}

		return filePath;
	}

	async moveFile(filePath, dir) {
		let newPath = path.join(dir, this.getFileName(filePath));

		if (newPath != filePath) {
			try {
				try {
					fs.readFileSync(newPath);
					console.log('file not moved because file already exists with that name');
				} catch (error) {
					move(filePath, this.getFileDir(newPath), (error) => {
						if (error) console.log(error);
					});
					return newPath;
				}
			} catch (error) {
				console.log('could not rename file', error);
				return filePath;
			}
		}

		return filePath;
	}

	moveFilePreview(filePath, dir) {
		let newPath = path.join(dir, this.getFileName(filePath));
		return newPath;
	}

	textToRegex(s) {
		// converts text to regex object
		let match = s.match(new RegExp('^/(.*?)/([gimy]*)$'));
		// sanity check here
		var regex = new RegExp(match[1], match[2]);

		return regex;
	}
}
