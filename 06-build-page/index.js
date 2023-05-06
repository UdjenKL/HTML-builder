const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const DIST_DIR = path.join(__dirname, 'project-dist');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const copyFileAsync = promisify(fs.copyFile);

async function buildPage() {
  // Создание директории project-dist
  await mkdirAsync(DIST_DIR);

  // Загрузка и чтение шаблона index.html
  const template = await readFileAsync(path.join(__dirname, 'template.html'), 'utf-8');

  // Получение списка компонентов
  const componentFiles = await fs.promises.readdir(COMPONENTS_DIR);

  // Загрузка и чтение содержимого компонентов
  const components = await Promise.all(
    componentFiles.map((filename) => readFileAsync(path.join(COMPONENTS_DIR, filename), 'utf-8'))
  );

  // Замена тегов в шаблоне на содержимое компонентов
  const html = componentFiles.reduce((acc, filename, index) => {
    const componentName = path.parse(filename).name;
    return acc.replace(new RegExp(`{{${componentName}}}`, 'g'), components[index]);
  }, template);

  // Создание файла index.html в директории project-dist
  await writeFileAsync(path.join(DIST_DIR, 'index.html'), html);

  // Сборка стилей
  const styleFiles = await fs.promises.readdir(STYLES_DIR);

  const styles = await Promise.all(
    styleFiles.map((filename) => readFileAsync(path.join(STYLES_DIR, filename), 'utf-8'))
  );

  const css = styles.join('\n');

  // Создание файла style.css в директории project-dist
  await writeFileAsync(path.join(DIST_DIR, 'style.css'), css);

  // Копирование папки assets в директорию project-dist/assets
  await fs.promises.mkdir(path.join(DIST_DIR, 'assets'), { recursive: true });

  const assetFiles = await fs.promises.readdir(ASSETS_DIR);

  await Promise.all(
    assetFiles.map((filename) =>
      copyFileAsync(path.join(ASSETS_DIR, filename), path.join(DIST_DIR, 'assets', filename))
    )
  );
}

buildPage().catch((err) => console.error(err));
