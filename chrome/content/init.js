var styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

var vkinfo = document.createElement('script');
vkinfo.setAttribute('type', 'text/javascript');
vkinfo.innerHTML = 'function vkwait(){if(typeof vk!=="undefined"){window.postMessage({type:"VK_INFO",text:vk.lang},"*");}else{setTimeout(function(){vkwait();},10)}}vkwait();';

document.arrive('head', function () {

    chrome.storage.local.get('enabled', function (item) {
        if (item.enabled) {
            checkCSS(styles);
            insertCSS('main');
            document.head.appendChild(vkinfo);
            chrome.runtime.sendMessage({action: 'activating'}, null);
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (sender.id == chrome.runtime.id && request.action == 'updating') {
                    updateCSS(request.css)
                }
            });
            document.arrive('#side_bar_inner', function () {
                $('<li id="l_ntf" class=""><a href="/feed?section=notifications" class="left_row"><span class="left_fixer"><span class="left_count_wrap fl_r left_void"><span class="inl_bl left_count_sign"></span></span><span class="left_icon fl_l"></span><span class="left_label inl_bl">Мои Ответы</span></span></a></li>').insertAfter('#l_nwsf')

            });
        }
    });
});


window.addEventListener('message', function (event) {
    if (event.source == window && event.data.type && event.data.type == 'VK_INFO') {
        console.log('Language: ' + event.data.text);
        localizeCSS(event.data.text);
    }
}, false);




window.addEventListener('onbeforeunload', function () {
    Arrive.unbindAllArrive();
});

function insertCSS(style, body) {
    if (body === undefined) body = false;
    var css = chrome.extension.getURL('content/' + style + '.css');
    if ($('#oldvk-style-' + style).length == 0) {
        var link = '<link rel="stylesheet" type="text/css" href="' + css + '" id="oldvk-style-' + style + '"/>';
        if (body) $(link).insertBefore('body'); else $(link).insertAfter('head');
        console.log(style + '.css inserted');
    }
}

function removeCSS(style) {
    var name = $('#oldvk-style-' + style);
    if (name.length != 0) {
        name.remove();
        console.log(style + '.css removed');
    }
}

function updateCSS(styles, body) {
    if (body === undefined) body = true;
    styles.forEach(function (style) {
        if (style.apply) {
            insertCSS(style.css, body)
        } else removeCSS(style.css)
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

function localizeCSS(lang) {
    var my = '';
    var css = '#l_nwsf .left_label:before{content:"$my"}#l_msg .left_label:before{content:"$my"}#l_fr .left_label:before{content:"$my"}#l_gr .left_label:before{content:"$my"}#l_ph .left_label:before{content:"$my"}#l_aud .left_label:before{content:"$my"}#l_vid .left_label:before{content:"$my"}#l_ap .left_label:before{content:"$my"}#l_fav .left_label:before{content:"$my"}#l_doc .left_label:before{content:"$my"}';
    switch (lang) {
        case 0:
            my = 'Мои ';
            break;
        case 1:
            my = 'Мої ';
            break;
        case 2:
            my = 'My ';
            break;
        default:
            console.log('Этот язык пока не поддерживается: ' + lang);
            break;
    }
    css = css.replace(/\$my/g, my);
    applyCSS(css, 'my');
}

function applyCSS(css, name) {
    if ($('#oldvk-style1-' + name).length == 0) {
        var style = document.createElement('style');
        style.id = 'oldvk-style1-' + name;
        style.innerHTML = css;
        document.head.appendChild(style);
    }
}