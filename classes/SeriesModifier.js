//
//
class SeriesModifier extends Modifier {
	name = 'seriesModifier';
	title = 'Series Rename';

	defaults() {
		return {
			title: '',
			year: 2000,
			season: 1,
			episodRegex: '/[0-9]+/g',
			index: 0,
		};
	}

	getNewName(filePath) {
		let name = this.getFileName(filePath).split('.');
		name.pop();
		name = name.join('.');

		try {
			let r = this.textToRegex(this.state.episodRegex);
			let episode = parseInt(name.match(r)[this.state.index]);

			if (isNaN(episode)) throw 'episode not found by regex';

			let season = this.state.season;
			let title = this.state.title;
			let year = this.state.year;

			if (episode < 10) episode = '0' + String(episode);
			if (season < 10) season = '0' + String(season);

			name = `${title} (${year}) - s${season}e${episode} - Episode ${episode}`;
		} catch (error) {
			console.log(error);
		}

		return name;
	}

	async modify(fileList) {
		this.saveState();

		let newList = fileList;
		for (let i in newList) {
			let filePath = newList[i];
			let newName = this.getNewName(filePath);
			newList[i] = this.renameFile(filePath, newName);
		}
		return newList;
	}

	preview(fileList) {
		this.saveState();

		let newList = fileList;
		for (let i in newList) {
			let filePath = newList[i];
			let newName = this.getNewName(filePath);
			newList[i] = this.renameFilePreview(filePath, newName);
		}
		return newList;
	}

	render() {
		return `
		<div class="input">
			<p class="description">Takes a set of files and renames them to work with Plex</p>
		</div>
        <div class="input">
            <label for="title">Title</label>
            <input type="text" name="title" placeholder="series title" value="${this.state.title}" id="title-${this.uuid}"/><br/>
        </div>
        <div class="input">
            <label for="year">Year</label>
            <input type="number" value=${this.state.year} name="year" id="year-${this.uuid}" /><br/>
        </div>
        <div class="input">
            <label for="season">Season</label>
            <input type="number" value=${this.state.season} id="season-${this.uuid}" /><br/>
        </div>
        <div class="input">
            <label for="episode-regex">Episode Regex</label>
            <input type="text" value="${this.state.episodRegex}" id="regex-${this.uuid}"/>
            <p class="description">This is used to find the episode from the original name of the video file.</p>
        </div>
        <div class="input">
            <label for="index">Index</label>
            <input type="number" min="0" value="${this.state.index}" id="index-${this.uuid}" /><br/>
            <p class="description">This is used to specify which number in the name it is. Ex: a file named "Ep26Season4.mp4" would have "26" as index 0 and "4" as index 1 (with the default regex).    
        </div>
		<br/>
		<p class="description">id: ${this.uuid}</p>
		`;
	}

	saveState() {
		this.state.title = document.getElementById(`title-${this.uuid}`).value;
		this.state.year = document.getElementById(`year-${this.uuid}`).value;
		this.state.season = document.getElementById(`season-${this.uuid}`).value;
		this.state.episodRegex = document.getElementById(`regex-${this.uuid}`).value;
		this.state.index = document.getElementById(`index-${this.uuid}`).value;
	}
}
