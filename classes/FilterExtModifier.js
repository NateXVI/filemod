//
//
class FilterExtModifier extends Modifier {
	name = 'filterExtModifier';
	title = 'Filter by File Extension';

	defaults() {
		return {
			extension: '',
			shouldDelete: false,
			isNot: true,
		};
	}

	preview(fileList) {
		let newList = fileList;
		let removeList = [];

		for (let i in newList) {
			let shouldFilter = newList[i].endsWith(this.state.extension);
			shouldFilter = this.state.isNot ? !shouldFilter : shouldFilter;
			if (shouldFilter && this.state.extension !== '') {
				removeList.push(i);
			}
		}
		for (let i = removeList.length - 1; i >= 0; i--) {
			newList.splice(removeList[i], 1);
		}

		return newList;
	}

	modify(fileList) {
		let newList = fileList;
		let removeList = [];

		for (let i in newList) {
			let shouldFilter = newList[i].endsWith(this.state.extension);
			shouldFilter = this.state.isNot ? !shouldFilter : shouldFilter;
			if (shouldFilter && this.state.extension !== '') {
				removeList.push(i);
			}
		}
		for (let i = removeList.length - 1; i >= 0; i--) {
			if (this.state.shouldDelete) this.deleteFile(fileList[removeList[i]]);
			newList.splice(removeList[i], 1);
		}

		return newList;
	}

	render() {
		return `
        <div class="input">
        <label for="ext-${this.uuid}">File Type</label>
        <input type="text" name="ext-${this.uuid}" id="ext-${this.uuid}" value="${
			this.state.extension
		}" />
        </div>
        <div class="input">
        <label for="isnot-${this.uuid}">Is not file type</label>
        <input type="checkbox" name="isnot-${this.uuid}" id="isnot-${this.uuid}" ${
			this.state.isNot ? 'checked' : ''
		}/>
        </div>
        <div class="input">
        <label for="delete-${this.uuid}">Delete filtered files?</label>
        <input type="checkbox" name="delete-${this.uuid}" id="delete-${this.uuid}" ${
			this.state.shouldDelete ? 'checked' : ''
		}/>
        </div>
        `;
	}

	postRender() {
		const extInput = document.getElementById(`ext-${this.uuid}`);
		const isNotInput = document.getElementById(`isnot-${this.uuid}`);
		const shouldDeleteInput = document.getElementById(`delete-${this.uuid}`);

		extInput.addEventListener('input', (event) => {
			this.state.extension = event.target.value;
		});

		isNotInput.addEventListener('input', (event) => {
			this.state.isNot = event.target.checked;
		});

		shouldDeleteInput.addEventListener('input', (event) => {
			this.state.shouldDelete = event.target.checked;
		});
	}
}
