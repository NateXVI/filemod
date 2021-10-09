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

	generateUuid() {
		// rerurns a new uuid

		return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
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

	renameFile(filePath, name) {
		// renames file
		name = name + this.getFileType(filePath);
		let dir = this.getFileDir(filePath);
		let newName = path.join(dir, name);

		if (newName != filePath) {
			try {
				fs.renameSync(filePath, newName);
				return newName;
			} catch (error) {
				console.log('could not rename file', error);
				return filePath;
			}
		}

		return filePath;
	}
}
