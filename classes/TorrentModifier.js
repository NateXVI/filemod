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
        <p class="description">Downloads a torrent</p>
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
        <p class="description">torrent file path<p>
        </div>
        `;

		if (this.state.files.length > 0) {
			text += `<div class="input"><p>Torrent files</p>`;

			this.state.files.forEach((v) => {
				const isChecked = this.state.filteredFiles.findIndex((file) => file == v) < 0;

				text += `
                <div>
                <input type="checkbox" name="check-${v}-${this.uuid}" id="check-${v}-${
					this.uuid
				}" ${isChecked ? 'checked' : ''} />
                <label for="check-${v}-${this.uuid}">${v}</label>

                </div>
                `;
			});

			text += `</div>`;
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

		this.state.files.forEach((v) => {
			let checkbox = document.getElementById(`check-${v}-${this.uuid}`);
			checkbox.addEventListener('input', (event) => {
				let value = event.target.checked;

				if (!value) {
					this.state.filteredFiles.push(v);
				} else {
					let index = this.state.filteredFiles.findIndex((file) => file == v);
					console.log(index);
					if (index >= 0) {
						console.log('removing', index);
						this.state.filteredFiles.splice(index, 1);
					}
				}

				console.log(value);
			});
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

	async onLoad() {
		if (this.state.filePath == '') return;

		try {
			const client = new WebTorrent();
			const torrentString = fs.readFileSync(this.state.filePath, {
				path: this.state.destination,
			});
			const torrent = await client.add(torrentString);
			console.log('this is the torrent', torrent);
			this.state.files = torrent.files.map((v) => v.name);
			console.log(this.state.files);
			client.destroy();
		} catch (error) {}

		this.rerenderModifiers();
	}
	stats = {
		progress: 0,
		speed: 0,
		eta: 0,
	};

	async modify(fileList) {
		if (this.state.filePath === '' || this.state.destination === '') return fileList;

		let newList = fileList;

		try {
			this.isDownloading = true;
			const client = new WebTorrent();
			const torrentFile = fs.readFileSync(this.state.filePath);
			const torrent = client.add(
				torrentFile,
				{ path: this.state.destination },
				(torrent) => {
					let length = torrent.files.length;

					torrent.files.forEach((file) => {
						const source = file.createReadStream();
						const destination = fs.createWriteStream(
							path.join(this.state.destination, file.name)
						);

						source.on('end', () => {
							length -= 1;
							console.log('file ended');

							if (!length <= 0) {
								console.log('finished downloading');
							} else {
								console.log('still more files');
							}
						});
					});
				}
			);

			return new Promise((resolve, reject) => {
				let interval = setInterval(() => {
					// console.log(torrent.progress, torrent.downloadSpeed, torrent.timeRemaining);
					this.stats.eta = torrent.timeRemaining;
					this.stats.progress = torrent.progress;
					this.stats.speed = torrent.downloadSpeed;
					console.log(this.stats);
					if (torrent.progress === 1) {
						client.destroy();
						clearInterval(interval);
						resolve(newList);
					}

					// else console.log('not done');
				}, 1000);
			});
		} catch (error) {
			console.log('torrent download failed', error);
		}

		return newList;
	}
}
