updateNarrow = function () {
};
updateLeftMenu = function () {
};

if (typeof TopNotifier !== "undefined") {
    TopNotifier.tnCount = "oldvk-notify";
    TopNotifier.tnLink = "oldvk-notify-wrap";
}

if (typeof getAudioPlayer !== "undefined" && getAudioPlayer()._currentAudio) removeClass(ge("oldvk_top_play"), "oldvk-hide");

if (typeof ap !== 'undefined' && ap.top !== 'undefined') {
    function titleSet(t) {
        if (!t) return;
        t = AudioUtils.asObject(t);
        var s = document.createElement('span');
        var title = geByClass1('top_audio_player_title');
        title.textContent = t.performer;
        s.textContent = t.title;
        title.appendChild(s)
    }

    titleSet(ap.getCurrentAudio());
    ap.on(ap.top, AudioPlayer.EVENT_PLAY, function (t) {
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
}

window.addEventListener("message", function (m) {
    if (m.data.type == 'UPD') {
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
                        if (arguments.length > 0 && arguments[0] == 'subscribers') show('friends_search_input_wrap')

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
    if (arguments[0].search(/fav_logo\.ico/i) != -1) {
        arguments[0] = "/images/favicon.ico"
    }
    sfi.apply(this, arguments)
};

window.postMessage({type: "UPD", text: window.location.pathname.slice(1)}, '*');