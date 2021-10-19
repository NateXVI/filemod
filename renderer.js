const tabs = new TabManager();

tabs.load();
tabs.renderAll();

document.addEventListener('render modifiers', () => {
	tabs.renderModifiers();
});

document.addEventListener('render preview', () => {
	tabs.renderPreview();
});

let previewInterval = setInterval(() => tabs.renderPreview(), 1000);
let saveInterval = setInterval(() => tabs.save(), 10000);
