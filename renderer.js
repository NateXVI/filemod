// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const filemod = new Filemod();
const modifiersSection = document.getElementById('modifiers');
const previewSection = document.getElementById('previews');
const directoryText = document.getElementById('directory');
const modifyButton = document.getElementById('modify-button');

// stores if modifications are being executed or not
let isModifying = false;

// renders modifiers
function renderModifiers() {
	console.log('rendering modifiers');
	try {
		modifiersSection.innerHTML = filemod.renderModifiers();
		filemod.postRender();
	} catch (error) {
		console.log('could not render modifiers', error);
	}

	// add events for buttons
	const removeButtons = document.getElementsByClassName('remove-button');
	for (let i = 0; i < removeButtons.length; i++) {
		let btn = removeButtons[i];
		btn.addEventListener('dblclick', (event) => {
			let id = event.target.id.split('-')[1];
			filemod.removeModifier(id);
		});
	}

	const minButtons = document.getElementsByClassName('modifier-button');
	for (let i = 0; i < minButtons.length; i++) {
		let btn = minButtons[i];

		btn.addEventListener('click', () => {
			let type = btn.id.split('-')[0];
			let id = btn.id.split('-')[1];
			let index = filemod.getModifierIndexById(id);

			if (type === 'collapse') {
				filemod.state.modifiers[index].minimized = true;
			}

			if (type === 'expand') {
				filemod.state.modifiers[index].minimized = false;
			}

			renderModifiers();
		});
	}
}

const addButton = document.getElementById('add-button');
const dropdownContent = document.getElementById('dropdown-content');
const addButtons = document.getElementsByClassName('dropbtn');
dropdownContent.hidden = true;

for (let i = 0; i < addButtons.length; i++) {
	let btn = addButtons[i];

	btn.addEventListener('click', (event) => {
		let type = event.target.innerHTML;
		filemod.addModifier(type);
	});
}

addButton.addEventListener('click', () => {
	showAdd();
});

document.addEventListener('click', (event) => {
	if (event.target.id != 'add-button') hideAdd();
});

function showAdd() {
	dropdownContent.hidden = false;
}

function hideAdd() {
	dropdownContent.hidden = true;
}

// renders preview
function renderPreview() {
	console.log('rendering preview');
	try {
		previewSection.innerHTML = filemod.renderPreview();
	} catch (error) {
		console.log('could not render preview', error);
	}
}

// loads previous session on startup
function load() {
	try {
		let save = localStorage.getItem('state-save');
		save = JSON.parse(save);
		filemod.setDirectory(save.directory);
		if (save.directory != '') directoryText.innerHTML = save.directory;

		// filemod.modifiers = [];
		for (let i in save.modifiers) {
			filemod.addModifier(save.modifiers[i].type, save.modifiers[i].state);

			filemod.state.modifiers[i].onLoad();
		}
	} catch (error) {}
}

load();

// add event listeners for rerender events
document.addEventListener('render modifiers', () => renderModifiers());
document.addEventListener('render preview', () => renderPreview());

// change directory logic
directoryText.addEventListener('click', async () => {
	try {
		let newDir = await filemod.getDirectoryFromUser();
		filemod.setDirectory(newDir);
		directoryText.innerHTML = newDir;
	} catch (error) {
		console.log("didn't set new directory", error);
	}
});

// starts modifying when modify button is pressed
modifyButton.addEventListener('click', () => {
	if (isModifying) return console.log('skipped');

	if (!isModifying) {
		(async function () {
			isModifying = true;
			try {
				console.log('modifying files');
				await filemod.modify();
				console.log('modifications successful');
			} catch (error) {
				console.log('modify failed', error);
			}
			isModifying = false;
		})();
	}
});

// update preview every second
window.setInterval(() => {
	renderPreview();
}, 1000);

// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS

// const client = new WebTorrent();
// const torrent = fs.readFileSync('C:\\Users\\nate\\Desktop\\test\\test2.torrent');

// client.add(torrent, (torrent) => {
// 	let length = torrent.files.length;
// 	console.log(torrent.files.map((v) => v.name));
// });

// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING
// RENDERIN RENDERING RENDERING RENDERING

renderModifiers();
renderPreview();
