//
//
class SeriesSeasonModifier extends SeriesModifier {
	name = 'seriesSeasonModifier';
	title = 'Series Rename (with season)';

	defaults() {
		return {
			title: '',
			year: 2000,
			seasonRegex: '/[0-9]+/g',
			seasonIndex: 0,
			season: 1,
			episodeRegex: '/[0-9]+/g',
			episodeIndex: 0,
		};
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
            <label for="season">Season Regex</label>
            <input type="text" value=${this.state.seasonRegex} id="season-${this.uuid}" value="${this.seasonRegex}" /><br/>
            <p class="description">This is used to find the season from the original name of the video file.</p>
            </div>
            <div class="input">
                <label for="index">Season Index</label>
                <input type="number" min="0" value="${this.state.seasonIndex}" id="season-index-${this.uuid}" /><br/>
                <p class="description">This is used to specify which number in the name it is. Ex: a file named "Ep26Season4.mp4" would have "26" as index 0 and "4" as index 1 (with the default regex).    
            </div>
        <div class="input">
            <label for="episode-regex">Episode Regex</label>
            <input type="text" value="${this.state.episodeRegex}" id="episode-regex-${this.uuid}"/>
            <p class="description">This is used to find the episode from the original name of the video file.</p>
        </div>
        <div class="input">
            <label for="index">Episode Index</label>
            <input type="number" min="0" value="${this.state.episodeIndex}" id="episode-index-${this.uuid}" /><br/>
            <p class="description">This is used to specify which number in the name it is. Ex: a file named "Ep26Season4.mp4" would have "26" as index 0 and "4" as index 1 (with the default regex).    
        </div>
		<br/>
		<p class="description">id: ${this.uuid}</p>
		`;
	}

	saveState() {
		this.state.title = document.getElementById(`title-${this.uuid}`).value;
		this.state.year = document.getElementById(`year-${this.uuid}`).value;
		this.state.seasonRegex = document.getElementById(`season-${this.uuid}`).value;
		this.state.seasonIndex = document.getElementById(`season-index-${this.uuid}`).value;
		this.state.episodeRegex = document.getElementById(`episode-regex-${this.uuid}`).value;
		this.state.episodeIndex = document.getElementById(`episode-index-${this.uuid}`).value;
	}

	async modify(fileList) {
		this.saveState();

		let newList = fileList;
		for (let i in newList) {
			try {
				let filePath = newList[i];
				let name = this.getFileName(filePath).split('.');
				name.pop();
				name = name.join('.');
				let r = this.textToRegex(this.state.seasonRegex);
				let season = parseInt(name.match(r)[this.state.seasonIndex]);
				this.state.season = season;
				console.log(season);
				let newName = this.getNewName(filePath);
				newList[i] = this.renameFile(filePath, newName);
			} catch (error) {}
		}
		return newList;
	}

	preview(fileList) {
		this.saveState();

		let newList = fileList;
		for (let i in newList) {
			try {
				let filePath = newList[i];
				let name = this.getFileName(filePath).split('.');
				name.pop();
				name = name.join('.');
				let r = this.textToRegex(this.state.seasonRegex);
				let season = parseInt(name.match(r)[this.state.seasonIndex]);
				this.state.season = season;
				console.log(season);
				let newName = this.getNewName(filePath);
				newList[i] = this.renameFilePreview(filePath, newName);
			} catch (error) {}
		}
		return newList;
	}
}
