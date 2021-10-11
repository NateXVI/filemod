//

//
class TorrentModifier extends Modifier {
	name = 'torrentModifier';
	title = 'Torrent Download';

	defaults() {
		return {
			filePath: '',
			destination: '',
			torrent: '',
			files: [],
			filteredFiles: [],
		};
	}

	render() {
		let text = `
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

		if (this.state.files.length > 0) {
			text += `<div class="input"><p>Torrent files</p>
			<p class="description">file that are going to be downloaded<p>
			</div>
			<div class="input">
			`;

			this.state.files.forEach((v) => {
				const isChecked = this.state.filteredFiles.findIndex((file) => file == v) < 0;

				// text += `
				// <div>
				// <input type="checkbox" name="check-${v}-${this.uuid}" id="check-${v}-${
				// 	this.uuid
				// }" ${isChecked ? 'checked' : ''} />
				// <label for="check-${v}-${this.uuid}">${v}</label>

				// </div>
				// `;
				text += `
				<p>${this.getFileName(v)}</p>
				`;
			});

			text += `</div>`;
		}

		if (this.stats.inProgress) {
			let progress = Number(this.stats.progress);
			progress *= 10000;
			progress = Math.round(progress);
			progress /= 100;

			let speed = this.humanSpeed(this.stats.speed);
			console.log(speed);

			let timeLeft = this.parseMillisecondsIntoReadableTime(this.stats.eta);
			text += `
			<p>Progress: ${progress}%</p>
			<p>Speed: ${speed}</p>
			<p>Time left: ${timeLeft}</p>
			`;
		}

		return text;
	}

	postRender() {
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

		// this.state.files.forEach((v) => {
		// 	let checkbox = document.getElementById(`check-${v}-${this.uuid}`);
		// 	checkbox.addEventListener('input', (event) => {
		// 		let value = event.target.checked;

		// 		if (!value) {
		// 			this.state.filteredFiles.push(v);
		// 		} else {
		// 			let index = this.state.filteredFiles.findIndex((file) => file == v);
		// 			console.log(index);
		// 			if (index >= 0) {
		// 				console.log('removing', index);
		// 				this.state.filteredFiles.splice(index, 1);
		// 			}
		// 		}

		// 		console.log(value);
		// 	});
		// });

		directory.addEventListener('click', async (event) => {
			try {
				console.log('getting folder');
				this.state.destination = await this.getDirectoryFromUser();
				this.onLoad();
			} catch (error) {}
			this.rerenderModifiers();
		});
	}

	async onLoad() {
		if (this.state.filePath === '' || this.state.destination === '') return;

		try {
			const client = new WebTorrent();
			const torrentString = fs.readFileSync(this.state.filePath, {
				path: this.state.destination,
			});
			const torrent = await client.add(torrentString, { path: this.state.destination });
			console.log('this is the torrent', torrent);
			this.state.files = torrent.files.map((v) =>
				path.join(this.state.destination, v.path)
			);
			console.log(this.state.files);
			client.destroy();
		} catch (error) {}

		this.rerenderModifiers();
	}
	stats = {
		inProgress: false,
		progress: 0,
		speed: 0,
		eta: 0,
	};

	async modify(fileList) {
		if (this.state.filePath === '' || this.state.destination === '') return fileList;
		this.stats.inProgress = true;
		let newList = fileList;
		newList.push(...this.state.files);

		try {
			this.isDownloading = true;
			const client = new WebTorrent();
			const torrentFile = fs.readFileSync(this.state.filePath);
			const torrent = client.add(
				torrentFile,
				{ path: this.state.destination }
				// (torrent) => {
				// 	let length = torrent.files.length;

				// 	torrent.files.forEach((file) => {
				// 		const source = file.createReadStream();
				// 		const destination = fs.createWriteStream(
				// 			path.join(this.state.destination, file.name)
				// 		);

				// 		source.on('end', () => {
				// 			length -= 1;
				// 			console.log('file ended');

				// 			if (!length <= 0) {
				// 				console.log('finished downloading');
				// 			} else {
				// 				console.log('still more files');
				// 			}
				// 		});
				// 	});
				// }
			);

			return new Promise((resolve, reject) => {
				let interval = setInterval(() => {
					// console.log(torrent.progress, torrent.downloadSpeed, torrent.timeRemaining);
					this.stats.eta = torrent.timeRemaining;
					this.stats.progress = torrent.progress;
					this.stats.speed = torrent.downloadSpeed;
					console.log(this.stats);
					this.rerenderModifiers();
					if (torrent.done) {
						client.destroy();
						clearInterval(interval);
						this.stats.inProgress = false;
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
		let newList = fileList;

		if (this.state.files.length > 0) {
			for (let i in this.state.files) {
				newList.push(this.state.files[i]);
			}
		}

		return newList.sort();
	}

	humanSpeed(bits, si = false, dp = 1) {
		const thresh = si ? 1000 : 1024;

		if (Math.abs(bits) < thresh) {
			return bits + 'b/s';
		}

		const units = si
			? ['Kb/s', 'Mb/s', 'Gbs', 'Tbs', 'Pbs', 'Eb/s', 'Zb/s', 'Yb/s']
			: ['Kib/s', 'Mib/s', 'Gib/s', 'Tib/s', 'Pib/s', 'Eib/s', 'Zib/s', 'Yib/s'];
		let u = -1;
		const r = 10 ** dp;

		do {
			bits /= thresh;
			++u;
		} while (Math.round(Math.abs(bits) * r) / r >= thresh && u < units.length - 1);

		return bits.toFixed(dp) + '' + units[u];
	}

	parseMillisecondsIntoReadableTime(milliseconds) {
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
}
