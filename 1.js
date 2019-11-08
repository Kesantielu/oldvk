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

function installC() {
  location.href = "https://chrome.google.com/webstore/detail/enmbidembfifmcpbkknknhcpmmhnmgni";
}

window.addEventListener('DOMContentLoaded',function(){
  var a1 = document.getElementById('firefox-webext-link');
  var a2 = document.getElementById('opera-link');
  var a3 = document.getElementById('firefox-link');
  var xhr = new XMLHttpRequest();
  var xhr2 = new XMLHttpRequest();
  var xhr3 = new XMLHttpRequest();
  
  xhr.onload = function () {
    var upd = JSON.parse(xhr.responseText).addons['{6acba1db-bca7-4dc3-b20e-3230c4f5a54e}'].updates[0];
    a1.href = upd.update_link;
    a1.setAttribute('hash',upd.update_hash);
    a1.title = 'Версия ' + upd.version;
  }
  xhr.open('GET', 'updates.json', true);
  xhr.send();
  
  var xhr2 = new XMLHttpRequest();
  xhr2.onload = function() {
    var xml = new DOMParser();
    var upd = xml.parseFromString(xhr2.responseText,"text/xml");
    a2.title = 'Версия ' + upd.getElementsByTagName('updatecheck')[0].getAttribute('version');
    a2.href = upd.getElementsByTagName('updatecheck')[0].getAttribute('codebase');
  }
  xhr2.open('GET', 'update.xml', true);
  xhr2.send();
  
  xhr3.onload = function() {
    var rdf = new DOMParser();
    var upd = rdf.parseFromString(xhr3.responseText,"text/xml");
    a3.title = 'Версия ' + upd.getElementsByTagNameNS('http://www.mozilla.org/2004/em-rdf#','version')[0].textContent;
    a3.href = upd.getElementsByTagNameNS('http://www.mozilla.org/2004/em-rdf#','updateLink')[0].textContent;
    a3.setAttribute('hash',upd.getElementsByTagNameNS('http://www.mozilla.org/2004/em-rdf#','updateHash')[0].textContent);
  }
  xhr3.open('GET', 'update.rdf', true);
  xhr3.send();
  
})
