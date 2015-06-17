# e-Detailing

e-Detailing шаблон, для программирования мультиплатформенной HTML5 презентации

#### Структура слайда

Маска для именования презентации: ```[presentationName]_[NL_PID]_[AZ_Brand]_[lang]```.

Маска для именования слайда: ```[slideName]-[slideCopy]_[NL_PID]_[AZ_Brand]_[lang]```

Слайд должен состоять из двух папок: папка ```common``` содержит файлы актуальные для всех слайдов презентации, папка ```assets``` содержит файлы актуальные только для данного конкретного слайда.

Для начала прописываем основные свойства всей презентации в общем файле ```common/scripts/scripts_base.js```. Так же учтем, что папка common является общей для всех слайдов.

1. Создаем карту презентации в виде JSON в переменной map. Для описания вертикальных презентаций достаточно указать родительские презентацию и слайд в переменных "p_pres" и "p_slide". 
2. Указываем генерировать ли нам кастомное меню и с какими элементами, где el_class - класс элемента, show - активен или нет, кроме слайдов указанных в except.
3. Далее в links указываем переходы по ссылкам. Тут рамзещаем все ссылки, включая те, что созданы в предыдущем пункте. Ссылки привязываются к классам элементов.
4. Далее в переменной show_bc указываем генерировать ли хлебные крошки.
5. Переменные goto_back_btn и single_link можно не менять и использовать их по назначению. Создание ссылок через "single_link" НЕ рекомендуется.
6. Далее в функции customEvents прописываем все остальные события, имеющиеся на всех слайдах (например запуск анимации или открытия попап).
7. В функции initOtherPlatforms указываем функции, относящиеся к другим платформам. 

#### Grunt

```npm install``` - загрузить библиотечки.

```grunt copy``` - скопировать общую папку common во все слайды.

```grunt autoshot``` - сгенерировать миниатюру слайда и сохранить в той же папке, что и сам слайд.

```grunt zip``` - заархивировать каждый слайд в отдельный zip архив.

```grunt ctl``` - создать файл ctl для каждого слайда.

```grunt ftp``` - отправить архив и файл ctl на указанный сервер.

```grunt send``` - выполнить последовательно задачи ```zip```, ```ctl``` и ```ftp```.



