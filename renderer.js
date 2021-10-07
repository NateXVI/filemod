// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const fs = require('fs');
const fileDialog = require('node-file-dialog');

let directory = '';
let modifiers = [new PlexSeriesModifier()];
// modifiers = [...modifiers, ...modifiers, ...modifiers];

let test = new Modifier();

async function getDirectory() {
	let val = await fileDialog({ type: 'directory' });
	return val[0];
}

function render() {
	let modifierText = '';
	for (let i in modifiers) {
		try {
			modifiers[i].saveState();
		} catch (error) {}
		modifierText += modifiers[i].render();
	}

	let section = document.getElementById('modifiers');
	section.innerHTML = modifierText;

	for (let i in modifiers) {
		try {
			modifiers[i].setState();
		} catch (error) {
			console.log(error);
		}
	}
	try {
		let starting = fs.readdirSync(directory);

		for (let i in modifiers) {
			starting = modifiers[i].getPreview(starting);
		}

		previewOutput = '';

		for (let i in starting) {
			previewOutput += `<p>${starting[i]}</p>`;
		}

		document.getElementById('previews').innerHTML = previewOutput;
	} catch (error) {}
}

document.getElementById('directory').addEventListener('click', async (event) => {
	let d = await getDirectory();
	directory = d;
	document.getElementById('directory').innerHTML = directory;
	render();
});

document.addEventListener('rerender', () => {
	render();
});

render();
