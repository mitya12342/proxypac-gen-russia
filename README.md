#[proxypac-gen-russia](http://proxypac-gen-russia.herokuapp.com/) ![!img](http://i.imgur.com/om5d2Sh.png) 

Данные настройки позволят серфить интернет забыв о существовании цензуры и блокировок, не думать о переключении между `Прокси` ↔ `Прямое соединение`. На заблокированных сайтах будет включаться TOR, иначе - прямое соединение. 

Это самый рациональный способ использования TOR для обычных пользователей, которым необходимо иметь доступ к своим любимым сайтам.

Свежий .pac файл можно взять здесь:
*[http://proxypac-gen-russia.herokuapp.com/proxy.pac](http://proxypac-gen-russia.herokuapp.com/proxy.pac)*
##Автоматическое использование
####1 шаг:
Вам понадобится установленный и запущенный [Tor](https://www.torproject.org/download/download.html.en) (рекомендую в связке с Vidalia Relay Bundle).
####2 шаг:
**Chrome**: Настройки → Показать дополнительные настройки → Изменить настройки прокси-сервера → Настройка сети. Вставить ссылку [http://proxypac-gen-russia.herokuapp.com/proxy.pac](http://proxypac-gen-russia.herokuapp.com/proxy.pac) в строку "Использовать сценарий автоматической настройки".

**Firefox**: Правка → Настройки → Дополнительные → Сеть → Настроить... Вставить ссылку [http://proxypac-gen-russia.herokuapp.com/proxy.pac](http://proxypac-gen-russia.herokuapp.com/proxy.pac) в строку "URL автоматической настройки сервиса прокси".

**Opera**: CTRL+F12 → Расширенные → Сеть → Прокси-серверы. Вставить ссылку [http://proxypac-gen-russia.herokuapp.com/proxy.pac](http://proxypac-gen-russia.herokuapp.com/proxy.pac) в строку "Автоматическая конфигурция прокси-сервера".

###Заблокированные сайты для проверки
- [Грани.Ру](http://grani.ru) - стали первым зарегистрированным СМИ в России, заблокированным по "закону Лугового" на неопределенный срок за "призывы к участию в несогласованных акциях"

- [Pokerstars.com](http://www.pokerstars.com) - крупнейший в мире онлайн покер-рум

###Возможные проблемы
Настроили всё по инструкции, а блокировки остались? Ниже перечислены типичные проблемы и их решения

* Возможно, ваш Tor не запущен - убедитесь, что иконка Vidalia окрашена в зеленый цвет.
* Возможно, в качестве выходной ноды Tor выбрал узел из российского сегмента интернета - заходите в панель управления Vidalia → Сменить личность.
* Возможно, ваш провайдер осуществляет блокировки сайтов на уровне DNS - поможет установка [Google](https://developers.google.com/speed/public-dns/) / [Yandex](http://dns.yandex.ru/) DNS  в качестве DNS серверов.
* Попробуйте [очистить DNS-кэш](http://ru.wikihow.com/%D0%BE%D1%87%D0%B8%D1%81%D1%82%D0%B8%D1%82%D1%8C-DNS). 

###Остерегайтесь прослушки
Заходя на заблокированные сайты через Tor, остерегайтесь использования нешифрованного протокола `http`. Держатель выходной ноды в Tor, а также провайдер, а также любой другой узел на пути траффика могут заниматься прослушкой, следовательно, имеется риск утечки личных данных. Вам следует использовать поддерживающий шифрование протокол `https`. Включить его, где только возможно, поможет расширение [HTTPS Everywhere](https://www.eff.org/https-everywhere).

##Схема работы proxypac-gen-russia
 ![!img](http://i.imgur.com/Q8SDSzO.png)

##Ручной запуск
Хотите запускать [скрипт](https://github.com/Alex0007/proxypac-gen-russia/) собственноручно?

`nodejs server.js` для запуска службы, которая раз в полчаса будет обновлять proxy.pac 

`nodejs server.js --once` для единовременного запуска

`nodejs server.js --webserver` для запуска службы, которая раз в полчаса будет обновлять proxy.pac + вебсервер. proxy.pac будет доступен на http://localhost:3000/proxy.pac

###Переменные
В начале скрипта задаются некоторые переменные, которые можно изменить, при желании

 `var dump_url = 'https://raw.githubusercontent.com/zapret-info/z-i/master/dump.csv';` - путь к выгрузке РосКомНадзора
 
 `var proxy_string = 'SOCKS5 127.0.0.1:9050';` - строка proxy.pac, отвечающая за использование прокси (в данном случае переменная настроена на использование Tor)
 
 `var proxy_pac_path = __dirname + '/static/proxy.pac';` - путь к генерируемому proxy.pac файлу
