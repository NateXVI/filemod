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

function renderModifiers() {
	console.log('rendering modifiers');
	try {
		modifiersSection.innerHTML = filemod.renderModifiers();
	} catch (error) {
		console.log('could not render modifiers', error);
	}
}

function renderPreview() {
	console.log('rendering preview');
	try {
		previewSection.innerHTML = filemod.renderPreview();
	} catch (error) {
		console.log('could not render preview', error);
	}
}

document.addEventListener('render modifiers', () => renderModifiers());
document.addEventListener('render preview', () => renderPreview());
directoryText.addEventListener('click', async () => {
	try {
		let newDir = await filemod.getDirectoryFromUser();
		filemod.setDirectory(newDir);
		directoryText.innerHTML = newDir;
	} catch (error) {
		console.log("didn't set new directory", error);
	}
});

// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS
// TESTS TESTS TESTS TESTS TESTS TESTS

filemod.addModifier('modifier');
filemod.addModifier('modifier');
filemod.addModifier('modifier');
filemod.addModifier(Modifier);

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
