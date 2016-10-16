var styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

var langMap = {0: 'ru', 1: 'uk', 2: 'be-tarask', 3: 'en-us', 114: 'be', 100: 'ru-petr1708', 777: 'ru-ussr'};

var vkInfo = document.createElement('script');
vkInfo.setAttribute('type', 'text/javascript');
vkInfo.innerHTML = 'function vkwait(){if(typeof vk!=="undefined"){window.postMessage({type:"VK_INFO",text:vk.lang},"*");}else{setTimeout(function(){vkwait();},10)}}vkwait();';

//document.arrive('head', function () {
    chrome.storage.local.get('enabled', function (item) {
        if (item.enabled) {
            checkCSS(styles);
            insertCSS('local');
            insertCSS('main');
            document.head.appendChild(vkInfo);
            chrome.runtime.sendMessage({action: 'activating'}, null);
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (sender.extensionId == chrome.runtime.id && request.action == 'updating') {
                    updateCSS(request.css)
                }
            });
            document.arrive('#side_bar_inner', function () {
                $('<li id="l_ntf" class=""><a href="/feed?section=notifications" class="left_row"><span class="left_fixer"><span class="left_count_wrap fl_r left_void"><span class="inl_bl left_count_sign"></span></span><span class="left_icon fl_l"></span><span class="left_label inl_bl">Ответы</span></span></a></li>').insertAfter('#l_nwsf')
            });
        }
    });
//});

window.addEventListener('message', function (event) {
    if (event.source == window && event.data.type && event.data.type == 'VK_INFO') {
        var lang = event.data.text;
        console.log('Language: ' + lang);
        document.documentElement.setAttribute('lang', langMap[lang]);
    }
}, false);

window.addEventListener('onbeforeunload', function () {
    Arrive.unbindAllArrive();
});

function insertCSS(style) {
    var css = chrome.extension.getURL('content/' + style + '.css');
    if ($('#oldvk-style-' + style).length == 0) {
        var link = '<link rel="stylesheet" type="text/css" href="' + css + '" id="oldvk-style-' + style + '"/>';
        $(link).insertAfter('head');
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
    updateCSS(Styles, false)
}