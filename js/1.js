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
  var a2 = document.getElementById('firefox-old-link');
  var xhr = new XMLHttpRequest();
  var xhr2 = new XMLHttpRequest();
  xhr.onload = function () {
    var upd = JSON.parse(xhr.responseText).addons['{6acba1db-bca7-4dc3-b20e-3230c4f5a54e}'].updates[0];
    a1.href = upd.update_link;
    a1.setAttribute('hash',upd.update_hash);
    a1.title = 'Версия ' + upd.version;
  }
  xhr.open('GET', 'updates.json', true);
  xhr.send();
  
  xhr2.onload = function() {
    var rdf = new DOMParser();
    var upd = rdf.parseFromString(xhr2.responseText,"text/xml");
    console.log(upd);
  }
  xhr2.open('GET', 'update1.rdf', true);
  xhr2.send();
  
})
