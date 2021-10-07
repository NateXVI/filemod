class Modifier {
	constructor() {
		this.uuid = this.genUuid();
	}
	// base modifier class
	getPreview(fileList) {
		// gives a preview of what the output is going to be
		// inputs a fileList and outputs a file list
		let fl = fileList;
		return fl;
	}

	title = 'modifier';

	genUuid() {
		return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	modify(fileList) {
		// gives a preview of what the output is going to be
		// inputs a fileList and outputs a file list
		let fl = fileList;
		return fl;
	}

	rerenderEvent = new Event('rerender');

	rerender() {
		document.dispatchEvent(this.rerenderEvent);
	}

	getContent() {
		return '<p>this is content</p>';
	}

	render(index = 0) {
		return `
        <div class="modifier">
            <header class="modifier">
                <h2 class="modifier">${this.title}</h2>
            </header>
            <div class="modifier-main">${this.getContent()}</div>
        </div>
        `;
	}

	saveState() {}

	setState() {}

	getFileExtension(f) {
		let file = f;
		file = file.split('.');

		if (file.length > 1) {
			return file[file.length - 1];
		}

		return false;
	}
}
