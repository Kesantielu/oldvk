logTime('mainStart');
console.log('Content script injected into:', window.location.href);
console.log('Is top frame:', window.top === window.self);

const injectOptions = document.createElement('meta');
injectOptions.name = 'oldvk';
if (!isWebExt) options.fox = true;
injectOptions.textContent = JSON.stringify(options);

const injectLib = document.createElement('script');
injectLib.type = 'text/javascript';
injectLib.src = browser.runtime.getURL('lib/inject.js');

const injectStart = document.createElement('script');
injectStart.type = 'text/javascript';
injectStart.src = browser.runtime.getURL('content/injectStart.js');

function headOptions() {
    const active = ['audio', 'date', 'font']; // Потом перепроверить
    active.forEach(option => {
        if (options[option])
            document.head.classList.add('oldvk-' + option);
    })
}

function insertCSS(style) {
    if (!document.getElementById(`oldvk-style-${style}`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = browser.runtime.getURL('content/' + style + '.css');
        link.id = `oldvk-style-${style}`;
        document.head.insertAfter(link);
    }
}

window.addEventListener('message', event => {
    if (!options.enabled)
        return;
    switch (event.data.type) {
        case 'VK_INFO':
            logTime('vk_msg');
            const lang = langMap.hasOwnProperty(event.data.text.lang) ? event.data.text.lang : 3;
            document.documentElement.setAttribute('lang', langMap[lang]);
            //langResolve(lang);
            //Template.localize();
            break;
    }
});

async function initializeExtension() {
    await new Promise(resolve => KPP.head(() => resolve()));
    document.head.appendChild(injectOptions);
    document.head.appendChild(injectLib);
    document.head.appendChild(injectStart);
    headOptions();
    //checkStyles(styles);
    if (isWebExt) {
        //if (options.layout)
        //    setLayoutWidth(options.layout);
        insertCSS('local');
        insertCSS('main');
        browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            switch (request.action) {
                case 'updating':
                    //
                    break;
                case 'layout':
                    //
                    break;
            }
            sendResponse({result: true})
        });
    }
}


initializeExtension().then(() => {
        // former initArrives
        Object.entries(Arrives).forEach(([selector, handler]) =>
            KPP.add(selector, handler)
        );
    }
)


