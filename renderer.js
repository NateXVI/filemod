const tabs = new TabManager();

tabs.renderModifiers();
tabs.renderTabs();
document.addEventListener('render modifiers', () => {
	tabs.renderModifiers();
});
