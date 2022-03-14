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

window.addEventListener('DOMContentLoaded', function() {
  var ffw = document.getElementById('firefox-webext-link');
  var crx = document.getElementById('opera-link');
  var crx2 = document.getElementById('crx2-link');
  var ff = document.getElementById('firefox-link');
  
  if (typeof ffw !== 'undefined') {
    fetch('updates.json')
      .then(response => response.json())
      .then(json => {
        var upd = json.addons['{6acba1db-bca7-4dc3-b20e-3230c4f5a54e}'].updates[0];
        ffw.href = upd.update_link;
        ffw.setAttribute('hash', upd.update_hash);
        ffw.title = 'Версия ' + upd.version;
      })
  }

  if (typeof crx !== 'undefined' && typeof crx2 !== 'undefined') {
    fetch('update.xml')
      .then(response => response.text())
      .then(text => {
        var xml = new DOMParser();
        var upd = xml.parseFromString(text, "text/xml");
        crx.title = 'Версия ' + upd.getElementsByTagName('updatecheck')[0].getAttribute('version');
        crx.href = upd.getElementsByTagName('updatecheck')[0].getAttribute('codebase');
        crx2.title = 'Версия ' + upd.getElementsByTagName('updatecheck')[2].getAttribute('version');
        crx2.href = upd.getElementsByTagName('updatecheck')[2].getAttribute('codebase');
      })
  }
  
  if (typeof ff !== 'undefined') {
    fetch('update.rdf')
      .then(response => response.text())
      .then(text => {
        var rdf = new DOMParser();
        var upd = rdf.parseFromString(text,"text/xml");
        ff.title = 'Версия ' + upd.getElementsByTagNameNS('http://www.mozilla.org/2004/em-rdf#','version')[0].textContent;
        ff.href = upd.getElementsByTagNameNS('http://www.mozilla.org/2004/em-rdf#','updateLink')[0].textContent;
        ff.setAttribute('hash',upd.getElementsByTagNameNS('http://www.mozilla.org/2004/em-rdf#','updateHash')[0].textContent);
      })
  }
})
