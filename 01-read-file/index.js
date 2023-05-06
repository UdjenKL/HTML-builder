// Константа fs содержит модуль Node.js для работы с файловой системой.
const fs = require('fs');

// Создаем readStream для чтения файла 'text.txt' с помощью метода createReadStream
// Параметр 'utf8' указывает, что мы хотим читать файл как текст в кодировке UTF-8.
const readStream = fs.createReadStream('text.txt', 'utf8');

// Добавляем обработчик событий 'data', который вызывается каждый раз, когда readStream получает новый фрагмент данных из файла.
// Мы выводим каждый фрагмент данных в консоль с помощью console.log(chunk).
readStream.on('data', (chunk) => {
  console.log(chunk);
});

// Добавляем обработчик событий 'error', чтобы обрабатывать любые ошибки, которые могут возникнуть при чтении файла.
// Если происходит ошибка, мы выводим ее в консоль с помощью console.error(err).
readStream.on('error', (err) => {
  console.error(err);
});
