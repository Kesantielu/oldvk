// ==UserScript==
// @name         Old Design for VK
// @namespace    https://dasefern.com/
// @version      0.19
// @description  Companion script for using with Old Design VK CSS
// @author       Kesantielu Dasefern and others
// @include      https://vk.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.1.0.min.js
// ==/UserScript==

(function() {
    'use strict';
       var check = false;
	$('#top_notify_btn').attr('style','display: none !important');
	$("#top_audio").attr('style','display: none !important');
	$("#top_profile_link").attr('style','display: none !important');
	$("#top_audio_player").attr('style','display: none !important');
	var feed_count = $("#top_notify_count").text();

	$("#l_nwsf a span span.inl_bl").prepend('Мои ');
	$("#l_msg a span span.left_label").prepend('Мои ');
	$("#l_fr a span span.left_label").prepend('Мои ');
	$("#l_gr a span span.left_label").prepend('Мои ');
	$("#l_ph a span span.left_label").prepend('Мои ');
	$("#l_aud a span span.left_label").prepend('Мои ');
	$("#l_vid a span span.left_label").prepend('Мои ');
    $("#l_ap a span span.left_label").empty();
	$("#l_ap a span span.left_label").prepend('Приложения');
    $("#l_fav a span span.left_label").prepend('Мои ');
    
    $('<li id="l_apm" class=""><a href="/settings" class="left_row"><span class="left_fixer" id="sett"><span class="left_label inl_bl">Мои Настройки</span></span></a></div></li>').insertAfter('#l_fav');

	var attrr = $('#top_logout_link').attr('href');
	$('#top_nav').prepend('<span style="float:right;"><a id="people_link_td" class="top_nav_link" href="/search?c[section]=people">люди</a><a id="communities_link_td" class="top_nav_link" href="/search?c[section]=communities">сообщества</a><a id="games_link_td" class="top_nav_link" href="/apps">игры</a><a id="music_link_td" class="top_nav_link" href="#" onmouseover="prepareAudioLayer()" onmousedown="return (checkKeyboardEvent(event) ? false : showAudioLayer(event, this))" onclick="return (checkKeyboardEvent(event) ? showAudioLayer(event, this) : false);" aria-label="Аудиоплеер" aria-haspopup="true" accesskey="3">музыка</a><a id="support_link_td" class="top_nav_link" href="/support?act=home">помощь</a><a class="top_nav_link" href="'+ attrr +'">выйти</a></span>');

    $(".left_menu_nav_wrap").empty();
    $("#ads_left").css({'display': 'none'});

		
function check_feed_count(){
		feed_count = $("#top_notify_count").text();
		if (feed_count != 0){
			$("#feed_li").html('<span class="left_count_wrap fl_r"><span class="inl_bl left_count" id="feed_count">'+ feed_count +'</span></span><span class="left_label inl_bl">Мои Ответы</span>');
		}
		else {
			$("#feed_li").html('<span class="left_label inl_bl">Мои Ответы</span>');
		}
}
   
setTimeout(check_feed_count, 0);
setInterval(check_feed_count, 2*1000);

$('<li id="l_ntf" class=""><a href="/feed?section=notifications" class="left_row"><span class="left_fixer" id="feed_li"></span></a></div></li>').insertAfter('#l_nwsf');

})();
