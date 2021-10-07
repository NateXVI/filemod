class PlexSeriesModifier extends Modifier {
	title = 'plex series rename';

	constructor() {
		super();
		this.uuid = this.genUuid();

		this.state = {
			title: '',
			year: '2000',
			season: 1,
			episodRegex: '/[0-9]+/g',
			index: 0,
		};
	}

	getContent() {
		return `
		<label for="title">Title</label>
		<input type="text" name="title" placeholder="series title" value="${this.state.title}" id="title-${this.uuid}"/>
		<label for="year">Year</label>
		<input type="number" value=${this.state.year} name="year" id="year-${this.uuid}" />
		<label for="season">Season</label>
		<input type="number" value=${this.state.season} id="season-${this.uuid}" />
		<label for="episode-regex">Episode Regex</label>
		<input type="text" value="${this.state.episodRegex}" id="regex-${this.uuid}"/>
		<label for="index">Index</label>
		<input type="number" value="${this.state.index}" id="index-${this.uuid}" />
		<p>${this.uuid}</p>
		`;
	}

	saveState() {
		this.state.title = document.getElementById(`title-${this.uuid}`).value;
		this.state.year = document.getElementById(`year-${this.uuid}`).value;
		this.state.season = document.getElementById(`season-${this.uuid}`).value;
		this.state.episodRegex = document.getElementById(`regex-${this.uuid}`).value;
		this.state.index = document.getElementById(`index-${this.uuid}`).value;
	}

	stringToRegex(s) {
		var match = s.match(new RegExp('^/(.*?)/([gimy]*)$'));
		// sanity check here
		var regex = new RegExp(match[1], match[2]);

		return regex;
	}

	getNewName(n) {
		this.saveState();
		let newName = n;
		let r = this.stringToRegex(this.state.episodRegex);
		console.log(r);

		try {
			let ep = newName.match(r)[this.state.index];
			if (ep < 10) {
				ep = '0' + Number(ep);
			}
			let season = this.state.season;
			if (season < 10) {
				season = '0' + Number(season);
			}
			let ext = this.getFileExtension(n);
			if (ext) {
				newName = `${this.state.title} (${this.state.year}) - s${season}e${ep} - Episode ${ep}.${ext}`;
				return newName;
			}
		} catch (error) {}

		return n;
	}

	setState() {
		document.getElementById(`title-${this.uuid}`).addEventListener('change', (event) => {
			this.rerender();
		});
		document.getElementById(`year-${this.uuid}`).addEventListener('change', (event) => {
			this.rerender();
		});
		document.getElementById(`season-${this.uuid}`).addEventListener('change', (event) => {
			this.rerender();
		});
		document.getElementById(`regex-${this.uuid}`).addEventListener('change', (event) => {
			this.rerender();
		});
		document.getElementById(`index-${this.uuid}`).addEventListener('change', (event) => {
			this.rerender();
		});
	}

	getPreview(fileList) {
		let newList = fileList;
		for (let i in newList) {
			newList[i] = this.getNewName(newList[i]);
		}
		console.log(newList);
		return newList;
	}
}
