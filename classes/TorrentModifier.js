//
//
class TorrentModifier extends Modifier {
	// modifier that downloads torrent files

	name = 'torrentModifier';
	title = 'Torrent Download';

	// 	GENERAL FUNCTIONS
	// 	GENERAL FUNCTIONS
	defaults() {
		return {
			filePath: '',
			destination: '',
			torrent: '',
			files: [],
			filteredFiles: [],
		};
	}

	async modify(fileList) {
		// starts torrent download and periodically updates the ui to show progress
		// returns fileList with added torrent files when promise is done
		if (this.state.filePath === '' || this.state.destination === '') return fileList;
		this.rerenderModifiers();

		let newList = fileList;
		newList.push(...this.state.files);

		try {
			this.stats.inProgress = true;
			const client = new WebTorrent();
			const torrentFile = fs.readFileSync(this.state.filePath);
			const torrent = client.add(torrentFile, { path: this.state.destination });
			this.rerenderModifiers();
			return new Promise((resolve, reject) => {
				let interval = setInterval(() => {
					// console.log(torrent.progress, torrent.downloadSpeed, torrent.timeRemaining);
					this.stats.eta = torrent.timeRemaining;
					this.stats.progress = torrent.progress;
					this.stats.speed = torrent.downloadSpeed;
					this.rerender();
					if (torrent.done) {
						client.destroy();
						clearInterval(interval);
						this.stats.inProgress = false;
						this.rerenderModifiers();
						resolve(newList);
					}

					// else console.log('not done');
				}, 1000);
			});
		} catch (error) {
			console.log('torrent download failed', error);
			this.stats.inProgress = false;
		}

		let newFilePaths = this.state.files;

		for (let i in newFilePaths) {
			newFilePaths[i] = this.state.destination + newFilePaths[i];
		}

		newList.push(...newFilePaths);

		return newList;
	}

	preview(fileList) {
		// adds torrent files to the preview fileList
		let newList = fileList;

		if (this.state.files.length > 0) {
			for (let i in this.state.files) {
				newList.push(this.state.files[i]);
			}
		}

		return newList.sort();
	}

	// RENDER FUNCTIONS
	// RENDER FUNCTIONS

	rerender() {
		try {
			let div = document.getElementById(`torrentModifier-${this.uuid}`);
			div.innerHTML = this.render(true);
		} catch (error) {}
	}

	render(inner = false) {
		let text = '';

		if (!inner) text += `<div id="torrentModifier-${this.uuid}">`;

		text += `
		<div class="input">
		<p class="description">Downloads a torrent</p>
		</div>
		<div class="input">
		<p class="directory" id="filePath-${this.uuid}">${
			this.state.filePath === '' ? 'Select Torrent File' : this.state.filePath
		}</p>
		<p class="description">torrent file path<p>
		</div>
		<div class="input">
		<p class="directory" id="directory-${this.uuid}">${
			this.state.destination === '' ? 'Select Torrent File' : this.state.destination
		}</p>
		<p class="description">torrent download destination<p>
		</div>
        `;

		// render file names if any
		if (this.state.files.length > 0) {
			text += `<div class="input"><p>Torrent files</p>
			<p class="description">file that are going to be downloaded<p>
			</div>
			<div class="input">
			`;

			this.state.files.forEach((v) => {
				const isChecked = this.state.filteredFiles.findIndex((file) => file == v) < 0;
				text += `
				<p>${this.getFileName(v)}</p>
				`;
			});

			text += `</div>`;
		}

		// render stats if the torrent is donwloading
		if (this.stats.inProgress) {
			let progress = Number(this.stats.progress);
			progress *= 10000;
			progress = Math.round(progress);
			progress /= 100;

			let speed = this.humanSpeed(this.stats.speed);

			let timeLeft = this.parseMillisecondsIntoReadableTime(this.stats.eta);
			text += `
			<div class="input">
				<p class="description" color="red">${progress}% | ${speed} | ${timeLeft}</p>
				<progress value="${progress}" max="100"></progress>
			</div>
			`;
		}

		if (!inner) text += `</div>`;

		return text;
	}

	postRender() {
		// adds click events for the file and directory inputs

		const filePath = document.getElementById(`filePath-${this.uuid}`);
		const directory = document.getElementById(`directory-${this.uuid}`);

		filePath.addEventListener('click', async (event) => {
			try {
				console.log('getting file');
				this.state.filePath = await this.getFileFromUser();
				this.state.files = this.state.filteredFiles = [];
				this.onLoad();
			} catch (error) {}
			this.rerenderModifiers();
		});

		directory.addEventListener('click', async (event) => {
			try {
				console.log('getting folder');
				this.state.destination = await this.getDirectoryFromUser();
				this.onLoad();
			} catch (error) {}
			this.rerenderModifiers();
		});
	}

	humanSpeed(bits, si = false, dp = 1) {
		// converts bits per second to something easy to read
		const thresh = si ? 1000 : 1024;

		if (Math.abs(bits) < thresh) {
			return bits + 'b/s';
		}

		const units = si
			? ['Kb/s', 'Mb/s', 'Gbs', 'Tbs', 'Pbs', 'Eb/s', 'Zb/s', 'Yb/s']
			: ['Kb/s', 'Mb/s', 'Gb/s', 'Tb/s', 'Pb/s', 'Eb/s', 'Zb/s', 'Yb/s'];
		let u = -1;
		const r = 10 ** dp;

		do {
			bits /= thresh;
			++u;
		} while (Math.round(Math.abs(bits) * r) / r >= thresh && u < units.length - 1);

		return bits.toFixed(dp) + '' + units[u];
	}

	parseMillisecondsIntoReadableTime(milliseconds) {
		// converts milliseconds to a time that is easy to read
		if (milliseconds == Infinity) return 'Infinity';
		//Get hours from milliseconds
		var hours = milliseconds / (1000 * 60 * 60);
		var absoluteHours = Math.floor(hours);
		var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

		//Get remainder from hours and convert to minutes
		var minutes = (hours - absoluteHours) * 60;
		var absoluteMinutes = Math.floor(minutes);
		var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

		//Get remainder from minutes and convert to seconds
		var seconds = (minutes - absoluteMinutes) * 60;
		var absoluteSeconds = Math.floor(seconds);
		var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

		return h + ':' + m + ':' + s;
	}

	// OTHER
	// OTHER
	async onLoad() {
		// when the modifier is loaded check for the torrent files

		if (this.state.filePath === '' || this.state.destination === '') return;

		try {
			const client = new WebTorrent();
			const torrentString = fs.readFileSync(this.state.filePath, {
				path: this.state.destination,
			});
			const torrent = await client.add(torrentString, { path: this.state.destination });
			this.state.files = torrent.files.map((v) =>
				path.join(this.state.destination, v.path)
			);
			client.destroy();
		} catch (error) {}

		this.rerenderModifiers();
	}

	// stores the stats
	// not in state because it is data we don't want to save
	stats = {
		inProgress: false,
		progress: 0,
		speed: 0,
		eta: 0,
	};
}
