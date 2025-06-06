# 🧪 Решение ГИА (демоэкзамена ) 2025 на JavaScript

[![Electron](https://img.shields.io/badge/Electron-2C2E3B?style=flat&logo=electron&logoColor=9FEAF9)](https://www.electronjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/ru/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)

Решение ГИА 2025 (демоэкзамена) по специальности "Программист" (КОД 09.02.07-2-2025) на **чистом JavaScript** без использования React.

> Инструкция написана для студентов Хекслет колледжа, у которых будет первичный шаблон на экзамене. Если вы пришли в этот репозиторий из поиска, то не обращайте внимания на инструкцию по работе с шаблоном, можете просто посмотреть сам проект.

---

## 📚 Оглавление

- [🛠️ Технологии](#️-технологии)
- [📝 Инструкция по редактированию базового шаблона на экзамене](#-инструкция-по-редактированию-базового-шаблона-на-экзамене)
  - [1. Удаление зависимостей React](#1-удаление-зависимостей-react)
  - [2. Обновление зависимостей](#2-обновление-зависимостей)
  - [3. Удаление JSX](#3-удаление-jsx)
  - [4. Изменение HTML и скриптов](#4-изменение-html-и-скриптов)
  - [5. Удаление импортов React](#5-удаление-импортов-react)
  - [6. Измените файл electronviteconfigmjs](#6-измените-файл-electronviteconfigmjs)
- [‼️ ОЧЕНЬ ВАЖНАЯ ИНФОРАЦИЯ](#️-очень-важная-информация)
- [💡 Важная информация при работе с редактором](💡-важная-информация-при-работе-с-редактором)
- [⚙️ Стандартные команды Электрона:](⚙️-стандартные-команды-электрона)

---

## 🛠️ Технологии

- **Electron JS**  
- **JavaScript**  
- **HTML/CSS**

---

## 📝 Инструкция по редактированию базового шаблона на экзамене

Поскольку шаблон Сергея на экзамене будет использовать React, вам нужно отредактировать несколько файлов, чтобы он заработал **без Реакта**.


### 1. Удаление зависимостей React

Откройте файл `package.json` и удалите все зависимости, которые касаются Реакта.

То есть:
- `"react-router": "^7.1.5"`
- `"@vitejs/plugin-react": "^4.3.1"`
- `"eslint-plugin-react": "^7.34.3"`
- `"react": "^18.3.1"`
- `"react-dom": "^18.3.1"`


### 2. Обновление зависимостей

В терминале выполните:
```bash
$ npm i
```

> Команда работает даже без интернета. Это удалит все стертые зависимости из проекта.

### 3. Удаление JSX
Удалите все файлы с форматом JSX.

> Придется писать логику с нуля, но прикол чистого JS в том, что она будет намного проще и меньше, чем в Реакте.

### 4. Изменение HTML и скриптов
- Удалите `div` с классом root из файла `index.html`.
- Создайте новый файл скрипта, например, `main.js`, в папке `src/renderer/src`.
- Исправьте путь к скрипту `main.js` в `index.html`.

### 5. Удаление импортов React
Удалите все существующие импорты, собенно из файла `electron.vite.config.mjs`:

```javascript
import react from '@vitejs/plugin-react'
```

### 6. Измените файл electron.vite.config.mjs
**Это самое важное!** Если вы этого не сделаете, ваш проект не будет билдиться.

Оригинальный файл сборщика в шаблоне выглядит вот так:
```javascript
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
```

Вам надо исправить его вот на это:
```javascript
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          main: resolve('src/renderer/index.html')
        }
      }
    }
  }
})
```

## ‼️ ОЧЕНЬ ВАЖНАЯ ИНФОРМАЦИЯ
В JS, в отличии от реакта, нет компонентов, поэтому все страницы нужно делать через новые HTML файлы. 
После создания КАЖДОГО нового HTML-файла, вы должны прописывать путь к нему:

```js
main: resolve('src/renderer/index.html')
```

📌 Например, если у вас три страницы, то финальный код будет таким:
```js
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          main: resolve('src/renderer/index.html'),
          add: resolve('src/renderer/add.html'),
          edit: resolve('src/renderer/edit.html')
        }
      }
    }
  }
})
```

## 💡 Важная информация при работе с редактором
Не забудьте сохранять ваш код после изменения!

- Либо используйте ручное сохранение (Ctrl+S)
- Либо включите автосохранение

На вашем личном компьютере autosave скорее всего включен, но на компьютерах колледжа возможно нет, и без сохранения билд может не запуститься.
А учитывая, что вы меняете даже корневые файлы, без сохранения проект не заработает ВООБЩЕ.

## ⚙️ Стандартные команды Электрона
### Development

```bash
$ npm run dev
```
### Preview

```bash
$ npm run start
```
### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
