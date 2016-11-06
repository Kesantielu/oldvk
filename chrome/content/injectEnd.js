updateNarrow = function () {
};
updateLeftMenu = function () {
};
TopNotifier.tnCount = "oldvk-notify";
TopNotifier.tnLink = "oldvk-notify-wrap";
if (getAudioPlayer()._currentAudio)removeClass(ge("oldvk_top_play"), "oldvk-hide");
window.addEventListener("message", function (m) {
    if (m.data.split(":")[0] == "q_staudio_v10_pl" && getAudioPlayer()._currentAudio)removeClass(ge("oldvk_top_play"), "oldvk-hide");
    if (getAudioPlayer()._isPlaying)addClass(ge("oldvk_top_play"), "active"); else removeClass(ge("oldvk_top_play"), "active")
});
var sfi = setFavIcon;
setFavIcon = function () {
    console.log(arguments);
    if (arguments[0].search(/fav_logo\.ico/i) != -1) {
        arguments[0] = "/images/favicon.ico"
    }
    sfi.apply(this, arguments)
};