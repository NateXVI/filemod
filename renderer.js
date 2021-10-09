// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { session } = require('electron');

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
	} catch (error) {
		console.log('could not render modifiers', error);
	}
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
modifyButton.addEventListener('click', async () => {
	if (isModifying) return;

	isModifying = true;
	try {
		console.log('modifying files');
		await filemod.modify();
		console.log('modifications successful');
	} catch (error) {
		console.log('modify failed', error);
	}
	isModifying = false;
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

// filemod.addModifier(SeriesModifier);
// filemod.addModifier('modifier');
// filemod.addModifier('modifier');
// filemod.addModifier('modifier');
// filemod.addModifier(Modifier);

// const testMod = new Modifier();
// const testDir = 'C:/home/files';
// const testFile = 'C:/home/file/work.txt';
// console.log(testDir, testFile, '\n');
// console.log(`getting ${testFile} name`);
// console.log(testMod.getFileName(testFile));
// console.log(`getting ${testFile} type`);
// console.log(testMod.getFileType(testFile));
// console.log(`getting ${testFile} directory`);
// console.log(testMod.getFileDir(testFile));
// console.log(`renaming ${testFile} to school`);
// console.log(testMod.renameFilePreview(testFile, 'dasdfasd'));
// console.log(`renaming C:\\Users\\nate\\Desktop\\9k.png to 10k.png`);
// testMod.renameFile('C:\\Users\\nate\\Desktop\\10k.png', '100k');
// console.log(filemod.state.modifiers);

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
