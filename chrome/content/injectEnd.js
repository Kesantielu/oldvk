updateNarrow = nothing;
updateLeftMenu = nothing;

var fav_logo = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAACrglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzEq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP/////////////////8+vn/8uzm/9XBrv+sg17/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz////////////SvKj/2ce1//v59///////0ryn/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////q4Jc/6uCXP/dzb7//////+TWyv+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////9jFs//byrr/+vj2/////v/KsZn/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz////////////07un/+/n3///////RuqX/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////q4Jc/7iWdv//////+/n3/6+HY/+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////9K8qP/k1sr///////7+/v+yjGn/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/////////////////+/n3//Tv6v/OtqD/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

var fav_im = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAACrglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzEq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz//////7+ghP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////v6CE/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz///////////////////////////////////////////+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////////////////////////////////////q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////////////////////////////////////6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz///////////////////////////////////////////+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc////////////////////////////////////////////q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP///////////////////////////////////////////6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDq4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglz/q4Jc/6uCXP+rglzDAAA+LwAAc3QAAHQ6AABhbgAAZD4AACAgAAAgIAAAICAAACAgAAByZAAAbGkAACAgAAAgIAAAICAAADwvAABmOg==";

if (icoNode.href.search(/fav_im\.ico/i) !== -1)
    icoNode.href = fav_im;
else
    icoNode.href = fav_logo;

if (typeof getAudioPlayer !== "undefined" && getAudioPlayer()._currentAudio)
    removeClass(ge("oldvk_top_play"), "oldvk-hide");

if (typeof ap !== 'undefined' && ap.top !== 'undefined') { //TODO: Переделать в watchVar
    function titleSet(t) {
        if (!t) return;
        t = AudioUtils.asObject(t);
        var s = document.createElement('span');
        var title = geByClass1('top_audio_player_title');
        title.textContent = decodeHtml(t.performer);
        s.textContent = decodeHtml(t.title);
        title.appendChild(s)
    }

    setTimeout(function () {
        titleSet(ap.getCurrentAudio());
    }, 200);
    ap.on(ap.top, AudioPlayer.EVENT_PLAY, function (t) {/**/
        removeClass(ge("oldvk_top_play"), "oldvk-hide");
        addClass(ge("oldvk_top_play"), "active");
        titleSet(t)
    });
    ap.on(ap.top, AudioPlayer.EVENT_PAUSE, function () {
        removeClass(ge("oldvk_top_play"), "active")
    });
    ap.on(ap.top, AudioPlayer.EVENT_UPDATE, function (t) {
        titleSet(t)
    });
    ap.on(ap.top, AudioPlayer.EVENT_CAN_PLAY, function (t) {
        titleSet(t)
    });
}

window.addEventListener("message", function (m) {
    if (m.data.type === 'UPD') {
        switch (m.data.text) {
            case 'friends':
                if (typeof Friends !== "undefined") {
                    Friends.showListHeader = function (e, s) {
                        var fleb = ge("friends_list_edit_btn");
                        var fldb = ge("friends_list_delete_btn");
                        ge("friends_list_title").textContent = e;
                        ge("friends_list_count").textContent = "";
                        addClass(geByClass1("friends_tabs"), "unshown");

                        removeClass(ge("friends_tab_list"), "unshown");
                        removeClass(fleb, "unshown");
                        if (s < 25) {
                            removeClass(fldb, "unshown");
                            show(fldb)
                        }
                        else {
                            addClass(fldb, "unshown");
                            hide(fldb)
                        }
                    };
                    var sS = Friends.showSection;
                    Friends.showSection = function () {
                        sS.apply(this, arguments);
                        var fleb = ge("friends_list_edit_btn");
                        var fldb = ge("friends_list_delete_btn");
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
                    var tFF = Friends.toggleFindFilters;

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
});
var sfi = setFavIcon;
setFavIcon = function () {
    if (arguments[0].search(/fav_logo\.ico/i) !== -1)
        arguments[0] = fav_logo;
    if (arguments[0].search(/fav_im\.ico/i) !== -1)
        arguments[0] = fav_im;
    sfi.apply(this, arguments);
    icoNode.href = icoNode.href.replace(/\?\d+$/, '')
};

window.postMessage({type: "UPD", text: window.location.pathname.slice(1)}, '*');