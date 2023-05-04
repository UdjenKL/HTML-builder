const fs = require('fs');
const path = require('path');

const folderPath = './secret-folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Фильтруем список файлов, чтобы оставить только файлы без расширений
  const filteredFiles = files.filter((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    return stats.isFile();
  });

  // Отображаем информацию о каждом файле
  filteredFiles.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    // Если файл не является директорией, отображаем информацию о нем
    if (stats.isFile()) {
      const fileSize = stats.size / 1024; // конвертация в Кб
      console.log(`${file}-${path.extname(file).slice(1)}-${fileSize.toFixed(3)}kb`);
    }
  });
});
