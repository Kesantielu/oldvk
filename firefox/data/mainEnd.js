var injectEnd = document.createElement('script');
injectEnd.setAttribute('type', 'text/javascript');
injectEnd.innerHTML = 'updateNarrow=function(){};updateLeftMenu=function(){};TopNotifier.tnCount="oldvk-notify";TopNotifier.tnLink="oldvk-notify-wrap";if(getAudioPlayer()._currentAudio)removeClass(ge("oldvk_top_play"),"oldvk-hide");window.addEventListener("message",function(m){console.log("m",m);if(m.data.split(":")[0]=="q_staudio_v10_pl"&&getAudioPlayer()._currentAudio)removeClass(ge("oldvk_top_play"),"oldvk-hide");if(getAudioPlayer()._isPlaying)addClass(ge("oldvk_top_play"),"active");else removeClass(ge("oldvk_top_play"),"active")});var sfi=setFavIcon;setFavIcon=function(){console.log(arguments);if(arguments[0].search(/fav_logo\.ico/i) != -1) {arguments[0]="/images/favicon.ico"}sfi.apply(this,arguments)}';

document.body.appendChild(injectEnd);
initWide();

var leftMenuObserver = new MutationObserver(function (m) {
    LocalizedContent.updateMenu();
});
try {
    leftMenuObserver.observe(document.querySelector('#side_bar_inner ol'), {childList: true});
} catch (e) {
    console.warn(window.location.href, 'sidebar does not exist on this page')
}