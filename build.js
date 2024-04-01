const prefix = 'oldvk-';

const fse = require('fs-extra');
const sass = require('sass');
const rimraf = require('rimraf');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');
const {version} = require('./package.json');
const admzip = require('adm-zip');
const crx2 = require('crx/src/crx2');
const crx3 = require('crx/src/crx3');
const rsa = require('node-rsa');
const jpm = require('jpm/lib/xpi');
const path = require('path');

let tmpdir = fse.mkdtempSync('build-');
console.log('Создана временная папка ' + tmpdir);

console.log('Сборка версии для Chrome...');

fse.copySync('chrome', tmpdir);

// Подготовка CSS

let main_css = sass.renderSync({file: tmpdir + '/content/main.scss'});
let local_css = sass.renderSync({file: tmpdir + '/content/local.scss'});
fse.writeFileSync(tmpdir + '/content/local.css', local_css.css);
rimraf.sync(tmpdir + '/content/*.scss')
let main_css_postcss = postcss().use(prefixer({
    prefix: '[dir]',
    exclude: [/\[dir]/],
    transform: function (prefix, selector, prefixedSelector) {
        return (selector.indexOf(':not(dir)') !== -1) ? selector.replace(/:not\(dir\)\s*/, '') : prefixedSelector;
    }
})).process(main_css.css).css;
fse.writeFileSync(tmpdir + '/content/main.css', main_css_postcss);

// Запись версии расширения в манифест

let manifest = JSON.parse(fse.readFileSync(tmpdir + '/manifest.json').toString());
manifest.version = version;
fse.writeFileSync(tmpdir + '/manifest.json', JSON.stringify(manifest));

// Упаковка расширения в ZIP

let zip = new admzip();
zip.addLocalFolder(tmpdir);
zip.writeZip(prefix + version + '.zip');

console.log('Сборка версии для Opera...');

// Чтение или генерация приватного ключа для упаковки CRX

let pem;

try {
    pem = fse.readFileSync('./key.pem')
} catch (err) {
    if (err.code === 'ENOENT') {
        const key = new rsa({b: 2048});
        pem = key.exportKey('pkcs8');
        fse.writeFileSync('key.pem', pem);
        console.log('Создан ключ для подписи пакетов CRX.');
    }
}

// Подписывание CRXv2 и CRXv3

const key = new rsa(pem);
const der = key.exportKey('pkcs8-public-der');
fse.writeFileSync(prefix + version + '-v2.crx', crx2(pem, der, zip.toBuffer()));
fse.writeFileSync(prefix + version + '.crx', crx3(pem, der, zip.toBuffer()));

console.log('Сборка версии для Firefox...');

// Подготовка manifest.json для Firefox

manifest.applications = {"gecko": {"id": "oldvk@dasefern.com", "strict_min_version": "60.0"}}
fse.writeFileSync(tmpdir + '/manifest.json', JSON.stringify(manifest));

// Упаковка расширения в XPI

let xpi = new admzip();
xpi.addLocalFolder(tmpdir);
xpi.writeZip(prefix + version + '.xpi');

// Подготовка версии Jetpack

fse.mkdirSync(tmpdir + '/firefox');
fse.copySync('firefox', tmpdir + '/firefox');
fse.copySync('chrome/lib', tmpdir + '/firefox/data');
fse.copySync('chrome', tmpdir + '/firefox/data', {
    filter: path => (path === 'chrome' || path.startsWith('chrome/popup.'))
});
fse.copySync(tmpdir + '/content', tmpdir + '/firefox/data');

// Запись версии расширения в манифест Jetpack

let pkg = JSON.parse(fse.readFileSync(tmpdir + '/firefox/package.json').toString());
pkg.version = version;
fse.writeFileSync(tmpdir + '/firefox/package.json', JSON.stringify(pkg));

// Упаковка Jetpack XPI

jpm(pkg, {
    addonDir: path.resolve(tmpdir + '/firefox'),
    xpiPath: '.'
})
    .then(result => fse.rename(result, prefix + version + '-jetpack.xpi'))
    .then(() => fse.remove(tmpdir))
    .then(() => console.log('Временная папка удалена.'))
    .catch(console.err)