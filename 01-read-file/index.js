// импортируем модуль для работы с файловой системой
const fs = require('fs');

// Функция readFile (асинхронная функция) используется для чтения содержимого файла
fs.readFile('text.txt','utf8',(err,data)=> {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});