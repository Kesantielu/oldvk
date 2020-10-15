# OLD VK
## Старый дизайн ВКонтакте

Расширение поддерживает следующие браузеры:
* Chromium 45+ (и все, что базируется на нем: Opera 32+, Яндекс 15.10+, Edge 77+, etc)
* Firefox 45+
* Pale Moon 28+

Разработка находится в статусе вечной беты.

### Сборка CSS

Для сборки применяются утилиты **sass** и **postcss**.

```
sass --no-source-map chrome/content/main.scss:chrome/content/main.css chrome/content/local.scss:chrome/content/local.css
postcss chrome/content/main.css -r
```