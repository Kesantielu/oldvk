function installF(aEvent)
{
  for (var a = aEvent.target; a.href === undefined;) a = a.parentNode;
  var params = {
    "Foo": { URL: aEvent.target.href,
             IconURL: aEvent.target.getAttribute("iconURL"),
             Hash: aEvent.target.getAttribute("hash"),
             toString: function () { return this.URL; }
    }
  };
  InstallTrigger.install(params);
  return false;
}

function installO() {
  if (typeof opr !== 'undefined') opr.addons.installExtension('cjchggejabbldejlmlkbakoakdpooeij');
  else location.href = "https://addons.opera.com/ru/extensions/details/staryi-dizain-vk-2";
}

window.addEventListener('DOMContentLoaded',function(){
  var a1 = document.getElementById('firefox-webext-link');
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log(JSON.parse(xhr.responseText))
  }
  xhr.open('GET', 'updates.json', true);
  xhr.send();
})
