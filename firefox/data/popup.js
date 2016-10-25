window.onload = function () {
    document.getElementById("version_number").innerHTML = self.options.version;
    self.port.on('enabled', function (e) {
        document.getElementById("enabled").checked = e;
        if (!e) {
            document.getElementById("title-wrap").classList.add("disabled");
        }
    });
    document.getElementById("enabled").onchange = function (e) {
        self.port.emit('enabled', e.target.checked);
        if (this.checked) document.getElementById("title-wrap").classList.remove("disabled");
        else document.getElementById("title-wrap").classList.add("disabled")
    }
};