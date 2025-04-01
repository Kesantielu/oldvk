logTime('mainEnd');
console.log('Content script injected into:', window.location.href);
console.log('Is top frame:', window.top === window.self);

const injectEnd = document.createElement('script');
injectEnd.type = 'text/javascript';
injectEnd.src = browser.runtime.getURL('content/injectEnd.js');
document.head.appendChild(injectEnd);