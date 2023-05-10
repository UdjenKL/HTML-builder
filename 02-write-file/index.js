// Readline используется для создания объекта, который позволяет считывать данные с консоли ввода. Fs - модуль для работы с файловой системой.
const readline = require('readline');
const fs = require('fs');

// Создаем объект для чтения из консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Выводим приветствие в консоль
console.log('Добро пожаловать! Введите текст:');

// Обработчик события для ввода текста
rl.on('line', (input) => {
  // Записываем введенный текст в файл
  fs.writeFile('02-write-file/output.txt', input, (err) => {
    if (err) throw err;
    console.log('Текст успешно записан в файл output.txt!');
    rl.close(); // Закрываем объект для чтения из консоли
  });
});
