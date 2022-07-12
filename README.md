# OLD VK

## Старый дизайн ВКонтакте

Расширение поддерживает следующие браузеры:
* Chromium 49+ (и все, что базируется на нем: Opera 36+, Яндекс 16.4+, Edge 77+, etc)
* Firefox 48+
* Pale Moon 28+

Разработка находится в статусе вечной беты. В настоящее время адаптируется к Manifest v3

### Сборка

Для сборки применяется **Node.js**. Выполните следующие команды:

```
npm install
node build.js
```

В результате получатся следующие файлы:

* `oldvk-{version}.zip`: для Chrome
* `oldvk-{version}.crx`: для Opera и прочих браузеров на базе Chromium, не требующих подписи Google в расширении
* `oldvk-{version}-v2.crx`: то же, что и предыдущий, только тип расширения CRXv2, для старых браузеров, основанных на движке Chromium до 64 версии
* `oldvk-{version}-v3.crx`: Manifest v3, для Chrome 88+ и Firefox 101+ (в работе, сборка пока недоступна)
* `oldvk-{version}.xpi`: для Firefox от 48 версии
* `oldvk-{version}-jetpack.xpi`: для Pale Moon и Firefox до 48 версии
* `key.pem`: закрытый ключ для подписи расширений CRX