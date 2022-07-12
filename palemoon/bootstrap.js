const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
Cu.import('resource://gre/modules/Services.jsm');

const io =  Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
const ss =  Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
const css = io.newURI('chrome://oldvk/skin/toolbar.css', null, null);

function enumWindows (callback) {
	const windows = Services.wm.getEnumerator('navigator:browser');
	while (windows.hasMoreElements())
		callback(windows.getNext());
}

function addButton (window) {
	let button = window.document.createElement('toolbarbutton');
	button.setAttribute('id', 'oldvk-button');
  	button.setAttribute('label', 'Old VK');
  	button.setAttribute('class', 'toolbarbutton-1 chromeclass-toolbar-additional');
  	button.setAttribute('tooltiptext', 'Old VK');
  	//button.style.listStyleImage = 'url("chrome://oldvk/skin/oldvk-32.png")'
	if (!window.document.getElementById('oldvk-button')) {
		window.document.getElementById('navigator-toolbox').palette.appendChild(button);
		window.document.getElementById('nav-bar').appendChild(button);
	}
}

function removeButton (window) {
	const button = window.document.getElementById('oldvk-button');
	if (button)
		button.remove()
}

function startup(data, reason) {
	ss.loadAndRegisterSheet(css, ss.AUTHOR_SHEET);
	enumWindows(addButton);
	console.log('start', data, reason);
}

function shutdown(data, reason) {
	console.log('shutdown', data, reason);
	if (ss.sheetRegistered(css, ss.AUTHOR_SHEET))
  		ss.unregisterSheet(css, ss.AUTHOR_SHEET);
  	enumWindows(removeButton);
}

function install(data, reason) {
	console.log('install', data, reason);
}

function uninstall(data, reason) {
	console.log('uninstall', data, reason);
}