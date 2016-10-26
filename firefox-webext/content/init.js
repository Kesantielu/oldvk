var styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

var langMap = {0: 'ru', 1: 'uk', 2: 'be-tarask', 3: 'en-us', 114: 'be', 100: 'ru-petr1708', 777: 'ru-ussr'};

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var vkInfo = document.createElement('script');
vkInfo.setAttribute('type', 'text/javascript');
vkInfo.innerHTML = 'function vkwait(){if(typeof vk!=="undefined"){window.postMessage({type:"VK_INFO",text:vk.lang},"*");}else{setTimeout(function(){vkwait();},10)}}vkwait();';

document.arrive('head', {onceOnly: true, existing: true}, function () {
    chrome.storage.local.get('enabled', function (item) {
        if (item.enabled) {
            checkCSS(styles);
            insertCSS('local');
            insertCSS('main');
            document.head.appendChild(vkInfo);
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.action == 'updating') {
                    updateCSS(request.css)
                }
            });
            var l_ntf = document.createElement('li');
            l_ntf.id = 'l_ntf';
            l_ntf.innerHTML = '<a href="/feed?section=notifications" class="left_row"><span class="left_fixer"><span class="left_count_wrap fl_r left_void"><span class="inl_bl left_count_sign"></span></span><span class="left_icon fl_l"></span><span class="left_label inl_bl">Ответы</span></span></a>';
            document.arrive('#side_bar_inner', function () {
                if (document.getElementById('l_nwsf'))
                    insertAfter(document.getElementById('l_nwsf'), l_ntf)
            });
        }
    });
});

window.addEventListener('message', function (event) {
    if (event.source == window && event.data.type && event.data.type == 'VK_INFO') {
        var lang = event.data.text;
        console.log('Language: ' + lang);
        document.documentElement.setAttribute('lang', langMap[lang]);
    }
}, false);

window.addEventListener('beforeunload', function () {
    Arrive.unbindAllArrive();
});

function insertCSS(style) {
    var css = chrome.extension.getURL('content/' + style + '.css');
    if (!document.getElementById('oldvk-style-' + style)) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        link.id = 'oldvk-style-' + style;
        insertAfter(document.head, link);
        console.log(style + '.css inserted');
    }
}

function updateCSS(styles) {
    styles.forEach(function (style) {
        if (style.apply) document.head.classList.add('oldvk-' + style.css);
        else document.head.classList.remove('oldvk-' + style.css);
    })
}

function checkCSS(styles) {
    var Styles = [];
    var url = document.createElement('a');
    url.href = window.location.href;
    var path = url.pathname.slice(1);
    styles.forEach(function (style) {
        var apply = !!path.startsWith(style.match);
        Styles.push({css: style.css, apply: apply})
    });
    updateCSS(Styles)
}