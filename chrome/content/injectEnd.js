updateNarrow = nothing;
updateLeftMenu = nothing;
const oldvk_i18n = {
    messages: {
        0: 'Сообщения',
        1: 'Повідомлення',
        2: 'Паведамленьні',
        3: 'Messages',
        97: 'Хабарламалар',
        114: 'Паведамленні',
        100: 'Письма',
        777: 'Телеграммы'
    }
}

const fav_logo = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAACrglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzEq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP/////////////////8+vn/8uzm/9XBrv+sg17/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz////////////SvKj/2ce1//v59///////0ryn/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////q4Jc/6uCXP/dzb7//////+TWyv+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////9jFs//byrr/+vj2/////v/KsZn/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz////////////07un/+/n3///////RuqX/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////q4Jc/7iWdv//////+/n3/6+HY/+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////9K8qP/k1sr///////7+/v+yjGn/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/////////////////+/n3//Tv6v/OtqD/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
const fav_im = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAACrglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzEq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz//////7+ghP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////v6CE/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz///////////////////////////////////////////+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////////////////////////////////////q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////////////////////////////////////6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz///////////////////////////////////////////+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////////////////////////////////////q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////////////////////////////////////6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDAAA+LwAAc3QAAHQ6AABhbgAAZD4AACAgAAAgIAAAICAAACAgAAByZAAAbGkAACAgAAAgIAAAICAAADwvAABmOg==';
const fav_pause = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAI9JREFUOBFjjGpY6sXw7//M////yzCQABgZGZ8wMDGmM5GjGWQP2EKgxUyk2ozsSJBeJmQBcthYDejN92Poy/eHm4fOh0sAGSzIHBhbUpgPxgTT6HxkSawuQFZAiD1qAI5YePH2M8N/IIQBdD5MHEQzRtYuRqhEliGSTXksgHMVkbahKwPpZQJlSXIMgWVnAFXKMJBAnks7AAAAAElFTkSuQmCC';
const fav_play = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAN9JREFUOBFjjGpY6sXw7//M////yzCQABgZGZ8wMDGmM5GjGWQP2EKgxUyk2ozsSJBeJmQBctg4DUj1t2AQ4OEkaCZOAxyNVRjas7wZtJUk8BqC0wCQLn4eDobKOGeGIAddBkZG7ObgNQCkhYmJkSHESZ+hMMIeqwkEDYDpYmdjgTFRaOyiKEoYGLYevcawfPd5NFEIF6cBwDhm+PbjN8OM9ccYzt54glUzSBCnAQfP32VYd+Ayw5sPX3FqxmvArA0n8GqESRIdiDAN6DQTOFehixLJB+llAmVJcgyBZWcA/L4+qnrrzWsAAAAASUVORK5CYII=';

function icoNodeReplace(href) {
    const new_node = document.createElement('link');
    new_node.rel = 'shortcut icon';
    new_node.href = href;
    if (icoNode)
        document.head.replaceChild(new_node, icoNode)
    else
        document.head.appendChild(new_node);
    window.icoNode = new_node
}

if (typeof icoNode !== "undefined")
    if (icoNode.href.search(/fav_im\.ico/i) !== -1)
        icoNodeReplace(fav_im);
    else if (icoNode.href.search(/fav_pause\.ico/i) !== -1)
        icoNodeReplace(fav_pause);
    else if (icoNode.href.search(/fav_play\.ico/i) !== -1)
        icoNodeReplace(fav_play);
    else
        icoNodeReplace(fav_logo);
else {
    window.icoNode = document.querySelector('link[rel~="icon"]');
    icoNodeReplace(fav_logo);
}

if (typeof getAudioPlayer !== "undefined" && getAudioPlayer()._currentAudio)
    removeClass(ge("oldvk_top_play"), "oldvk-hide");

window.addEventListener("message", function (m) {
    if (m.data.type === 'UPD') {
        switch (m.data.text) {
            case 'friends':
                if (typeof Friends !== "undefined") {
                    Friends.showListHeader = function (e, s) {
                        const fleb = ge("friends_list_edit_btn");
                        const fldb = ge("friends_list_delete_btn");
                        ge("friends_list_title").textContent = e;
                        ge("friends_list_count").textContent = "";
                        addClass(geByClass1("friends_tabs"), "unshown");

                        removeClass(ge("friends_tab_list"), "unshown");
                        removeClass(fleb, "unshown");
                        if (s < 25) {
                            removeClass(fldb, "unshown");
                            show(fldb)
                        } else {
                            addClass(fldb, "unshown");
                            hide(fldb)
                        }
                    };
                    const sS = Friends.showSection;
                    Friends.showSection = function () {
                        sS.apply(this, arguments);
                        const fleb = ge("friends_list_edit_btn");
                        const fldb = ge("friends_list_delete_btn");
                        if (arguments.length < 1 || !arguments[0].startsWith('list')) {
                            addClass(fleb, 'unshown');
                            addClass(fldb, 'unshown');
                            hide(fldb);
                            hide(fleb);
                        } else {
                            removeClass(fleb, 'unshown');
                            show(fleb);
                            if (arguments.length > 0 && arguments[0].substr(4, 2) < 25) {
                                removeClass(fldb, 'unshown');
                                show(fldb);
                            }
                        }
                        if (arguments.length > 0 && arguments[0] === 'subscribers') show('friends_search_input_wrap')

                    };
                    eval('Friends.editListClient=' + Friends.editListClient.toString().replace(/narrow_column/g, 'ui_search_fltr'));
                    eval('Friends.deleteListClient=' + Friends.deleteListClient.toString().replace(/narrow_column/g, 'ui_search_fltr'));
                    const tFF = Friends.toggleFindFilters;

                    Friends.toggleFindFilters = function () {
                        tFF.apply(this, arguments);
                        if (hasClass(ge('search_filters_minimized'), 'ui_rmenu_item_expanded')) {
                            ge('friends_filters_block').style.top = "74px";
                        } else {
                            ge('friends_filters_block').style.top = "247px";
                        }
                    }
                }
                break;
        }
    }
    if (m.data.type === 'IM') {
        const peers = JSON.parse(localStorage.getItem('oldvk_peers')) || [];
        if (!peers.includes(m.data.text))
            peers.push(m.data.text);
        localStorage.setItem('oldvk_peers', JSON.stringify(peers));
    }
});

if (typeof setFavIcon !== 'undefined') {
    monkey(window, 'setFavIcon', args => {
        if (args[0].search(/fav_im.*\.ico/i) !== -1)
            args[0] = fav_im;
        else if (args[0].search(/fav_pause\.ico/i) !== -1)
            args[0] = fav_pause;
        else if (args[0].search(/fav_play\.ico/i) !== -1)
            args[0] = fav_play;
        else
            args[0] = fav_logo;
        return args;
    }, () => {
        icoNode.href = icoNode.href.replace(/\?\d+$/, '')
    });
}

if (typeof setDocumentTitle !== 'undefined') {
    monkey(window, 'setDocumentTitle', args => {
        if (typeof cur !== 'undefined' && cur.module === 'im')
            args[0] = oldvk_i18n.messages[vk.lang];
        return args
    })
}

if (typeof cur !== 'undefined' && cur.module === 'im')
    document.getElementsByTagName('title')[0].textContent = oldvk_i18n.messages[vk.lang];

window.postMessage({type: "UPD", text: window.location.pathname.slice(1)}, '*');