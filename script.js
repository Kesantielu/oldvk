// ==UserScript==
// @name         Old Design for VK
// @namespace    https://dasefern.com/
// @version      0.24
// @description  Companion script for using with Old Design VK CSS
// @author       Kesantielu Dasefern and others
// @include      https://vk.com/*
// @exclude      *://vk.com/notifier.php*
// @exclude      *://vk.com/al_*
// @exclude      *://vk.com/upload_fails.php
// @exclude      *://vk.com/ads_rotate.php*
// @exclude      *://vk.com/share.php*
// @grant        none
// @require      http://code.jquery.com/jquery-3.1.0.min.js
// ==/UserScript==

(function() {
    'use strict';
	document.querySelector("link[rel*='icon']").href = "http://vkontakte.ru/images/favicon.ico";
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
		if (feed_count > '0'){ //иначе показывает всегда что есть новые ответы, но пофакту новых нет (не красиво, когда светится плюсик всегда)
			$("#feed_li").html('<span class="left_count_wrap fl_r"><span class="inl_bl left_count" id="feed_count">'+ feed_count +'</span></span><span class="left_label inl_bl">Мои Ответы</span>');
		}
		else {
			$("#feed_li").html('<span class="left_label inl_bl">Мои Ответы</span>');
		}
}
   
setTimeout(check_feed_count, 0);
setInterval(check_feed_count, 2*1000);

$('<li id="l_ntf" class=""><a href="/feed?section=notifications" class="left_row"><span class="left_fixer" id="feed_li"></span></a></div></li>').insertAfter('#l_nwsf');

var addCSS = function () {/*

.page_post_sized_thumbs, .post_thumbed_media {
	zoom: 100%;
	-moz-transform: scale(1);
	-moz-transform-origin: left center;
}

#public .narrow_column.fixed, #group .narrow_column.fixed, #profile .narrow_column.fixed {
	position: absolute !important;
}
*/}.toString().slice(15,-1); 

var head = document.getElementsByTagName('html')[0];
var styleElement = document.createElement("style"); 
styleElement.type = 'text/css'; // Тип
styleElement.appendChild(document.createTextNode(addCSS)); 
head.appendChild(styleElement);

var nonZoom = true;
updateNarrow = function(sup){ // Сравнение высоты и прокрутки, расширение/сужение если требуется, где надо
  return function() {
	var cc=ge("narrow_column");
	if (!cc) return sup.apply(this, arguments);
	if (cc.offsetHeight && (cur.module=="profile" || cur.module=="group" || cur.module=="public" || cur.module=="event"))
	if(cc.offsetHeight<=-cc.getBoundingClientRect().top) {
	  if (nonZoom) {
		ge("wide_column").style.width="597px";
		nonZoom = false;
		resImg(document.getElementsByClassName("page_post_sized_thumbs"));
	  }
	} else if (!nonZoom) {
	  ge("wide_column").style.width="397px";
	  nonZoom = true;
	  resImg(document.getElementsByClassName("page_post_sized_thumbs"));
	}
	return sup.apply(this, arguments);
  };
}(updateNarrow);

ge = function(sup){ // Ресайз на функции обзора страницы, должна обрабатывать все видимые элементы
  return function() {
  if (arguments[0] instanceof HTMLDivElement && arguments[0].getElementsByClassName("page_post_sized_thumbs").length)
	resImg(arguments[0].getElementsByClassName("page_post_sized_thumbs"));
  return sup.apply(this, arguments);
  };
}(ge);

function resImg (ZCont) { // Функция масштабирования
  var sz;
  if(ZCont && ZCont.length) {
	for(var i=0;i<ZCont.length;i++){
	  if(!ZCont[i].parentNode.offsetWidth) continue;
	  ZCont[i].style.height="auto";
	  var factor=ZCont[i].parentNode.offsetWidth/ZCont[i].offsetWidth;
	  for(var j=0;j<ZCont[i].children.length;j++) {
		var c=ZCont[i].children[j];
		if (c.getAttribute('ResMin') != nonZoom || (nonZoom && c.getAttribute('ResMin') !== null))
		  if(factor<1) {
			var w, h;
			if(!c.hasAttribute("OiginalSize")) {
			  w=c.offsetWidth;
			  h=c.offsetHeight;
			  c.setAttribute("OiginalSize", w+","+h);
			} else {
			  sz=c.getAttribute("OiginalSize").split(",");
			  w=parseInt(sz[0]);
			  h=parseInt(sz[1]);
			}
			c.setAttribute("ResMin", true);
			c.style.width=Math.round(w*factor)+"px";
			c.style.height=Math.round(h*factor)+"px";
			if (!j && ZCont[i].children.length > 4)
			  ZCont[i].setAttribute('style', 'width: 420px; height: auto; margin-left: -70px;');
		  } else if(c.hasAttribute("OiginalSize")) {
			sz=c.getAttribute("OiginalSize").split(",");
			c.style.width=sz[0]+"px";
			c.style.height=sz[1]+"px";
			c.setAttribute("ResMin", false);
			if (!j && ZCont[i].children.length)
			  ZCont[i].setAttribute('style', 'width: 496px; height: auto;');
		  }
	  }
	}
  }
}


})();
