//
//
class MoveModifier extends Modifier {
	name = 'moveModifier';
	title = 'Move';

	defaults() {
		return {
			directory: '',
		};
	}

	render() {
		return `
        <p class="description">Moves all files into a different folder</p>
        <div class="input">
        <p class="directory" id="directory-${this.uuid}">${
			this.state.directory === '' ? 'Select Directory' : this.state.directory
		}</p>
        </div>
        `;
	}

	postRender() {
		const directorySelector = document.getElementById(`directory-${this.uuid}`);
		directorySelector.addEventListener('click', async (event) => {
			try {
				this.state.directory = await this.getDirectoryFromUser();
			} catch (error) {}
			this.rerenderModifiers();
		});
	}

	preview(fileList) {
		if (this.state.directory === '') return fileList;
		let newList = fileList;
		for (let i in newList) {
			newList[i] = this.moveFilePreview(newList[i], this.state.directory);
		}

		return newList;
	}

	async modify(fileList) {
		if (this.state.directory === '') return fileList;
		let newList = fileList;
		for (let i in newList) {
			console.log('moving file');
			newList[i] = this.moveFile(
				newList[i],
				path.join(this.state.directory, this.getFileName(fileList[i]))
			);
		}

		return newList;
	}
}
