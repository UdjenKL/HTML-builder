// подключаем модуль fs и используем промисифицированные функции из раздела "Promise API".
const fs = require('fs').promises;

// подключаем модуль path для работы с путями к файлам и папкам.
const path = require('path');

// функция принимает 2 аргумента (исходную папку и целевую папку)
async function copyDir(sourceDir, targetDir) {
  try {
    // создаем папку files-copy, если ее нет
    await fs.mkdir(targetDir, { recursive: true });

    // получаем список файлов в исходной папке
    const files = await fs.readdir(sourceDir);

    // копируем каждый файл в целевую папку
    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      await fs.copyFile(sourceFile, targetFile);
    }
  } catch (err) {
    console.error(err);
  }
}

// пример использования
copyDir('04-copy-directory/files', '04-copy-directory/files-copy');
