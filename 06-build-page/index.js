const fs = require('fs'); // Подключаем модуль для работы с файловой системой
const path = require('path'); // Подключаем модуль для работы с путями
const { promisify } = require('util'); // Подключаем модуль для промисификации функций

const COMPONENTS_DIR = path.join(__dirname, 'components'); // Путь к директории с компонентами
const STYLES_DIR = path.join(__dirname, 'styles'); // Путь к директории со стилями
const ASSETS_DIR = path.join(__dirname, 'assets'); // Путь к директории с ресурсами
const DIST_DIR = path.join(__dirname, 'project-dist'); // Путь к директории, в которую будет собираться проект

const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const copyFileAsync = promisify(fs.copyFile);
const statAsync = promisify(fs.stat);

async function buildPage() {
  try {
    // Проверяем, существует ли директория project-dist
    const dirExists = await fs.promises.access(DIST_DIR, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    // Если директория не существует, создаем ее
    if (!dirExists) {
      await mkdirAsync(DIST_DIR);
    }

    // Загружаем и читаем шаблон index.html
    const template = await readFileAsync(path.join(__dirname, 'template.html'), 'utf-8');

    // Получаем список файлов компонентов
    const componentFiles = await readdirAsync(COMPONENTS_DIR);

    // Загружаем и читаем содержимое файлов компонентов
    const components = await Promise.all(
      componentFiles.map((filename) => readFileAsync(path.join(COMPONENTS_DIR, filename), 'utf-8'))
    );

    // Заменяем теги шаблона на содержимое компонентов
    const html = componentFiles.reduce((acc, filename, index) => {
      const componentName = path.parse(filename).name;
      return acc.replace(new RegExp(`{{${componentName}}}`, 'g'), components[index]);
    }, template);

    // Создаем файл index.html в директории project-dist
    await writeFileAsync(path.join(DIST_DIR, 'index.html'), html);

    // Собираем стили
    const styleFiles = await readdirAsync(STYLES_DIR);

    const styles = await Promise.all(
      styleFiles.map((filename) => readFileAsync(path.join(STYLES_DIR, filename), 'utf-8'))
    );

    const css = styles.join('\n');

    await writeFileAsync(path.join(DIST_DIR, 'style.css'), css);

    await mkdirAsync(path.join(DIST_DIR, 'assets'), { recursive: true });

    const assetFiles = await readdirAsync(ASSETS_DIR);

    await Promise.all(
      assetFiles.map(async (filename) => {
        const srcPath = path.join(ASSETS_DIR, filename);
        const destPath = path.join(DIST_DIR, 'assets', filename);
        const stats = await statAsync(srcPath);
        if (stats.isFile()) {
          return copyFileAsync(srcPath, destPath);
        }
      })
    );

    console.log('Build successful!');
  } catch (err) {
    console.error('Build failed:', err);
  }
}

buildPage();
