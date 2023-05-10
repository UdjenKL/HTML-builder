const fs = require('fs');
const path = require('path');

const stylesDir = './05-merge-styles/styles';
const distDir = './05-merge-styles/project-dist';

// Получаем список файлов в директории styles
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Фильтруем только файлы с расширением .css
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  // Создаем пустой файл bundle.css в директории project-dist
  fs.writeFile(path.join(distDir, 'bundle.css'), '', (err) => {
    if (err) {
      console.error(err);
      return;
    }

    // Добавляем содержимое каждого css-файла в bundle.css
    cssFiles.forEach((file) => {
      fs.appendFile(
        path.join(distDir, 'bundle.css'),
        fs.readFileSync(path.join(stylesDir, file)),
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`${file} was appended to bundle.css`);
        }
      );
    });
  });
});
