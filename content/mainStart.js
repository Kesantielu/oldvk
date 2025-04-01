logTime('mainStart');
console.log('Content script injected into:', window.location.href);
console.log('Is top frame:', window.top === window.self);

const injectStart = document.createElement('script');
injectStart.type = 'text/javascript';
injectStart.src = browser.runtime.getURL('content/injectStart.js');

(async function initializeExtension() {
    await new Promise(resolve => KPP.head(() => resolve()));
    document.head.appendChild(injectStart);
})()

