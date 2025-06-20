import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { Client } from 'pg';

// Подключение к базе данных

const login = {
  user: 'electron',
  password: '123test',
  host: 'localhost',
  port: 5433,
  database: 'electron',
};

const withDatabaseConnection = async (callback) => {
  const client = new Client(login);

  try {
    await client.connect();
    return await callback(client);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      dialog.showErrorBox('Ошибка!', 'Партнер с таким именем уже существует.');
    } else {
      dialog.showErrorBox('Ошибка!', err);
    }
  } finally {
    await client.end();
  }
};

// Команды запросов к базе данных

const getPartners = () => {
  return withDatabaseConnection(async (client) => {
    const res = await client.query('SELECT * FROM PARTNERS;');
    return res.rows;
  });
};

const getPartnerById = (_, id) => {
  return withDatabaseConnection(async (client) => {
    const res = await client.query('SELECT * FROM PARTNERS WHERE id=$1;', [id]);
    return res.rows[0];
  });
};

const addPartner = (_, partner) => {
  return withDatabaseConnection(async (client) => {
    const { name, type, adress, ceo, phone, email, rating } = partner;
    await client.query(
      'INSERT INTO PARTNERS (name, type, adress, ceo, phone, email, rating) VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [name, type, adress, ceo, phone, email, rating]
    );
    dialog.showMessageBox({ message: 'Успех! Партнер создан.' });
  });
};

const editPartner = (_, partner) => {
  return withDatabaseConnection(async (client) => {
    const { name, type, adress, ceo, phone, email, rating, id } = partner;
    await client.query(
      `UPDATE PARTNERS 
        SET name = $1, type = $2, adress = $3, ceo = $4, phone = $5, email = $6, rating = $7 
        WHERE id = $8;`,
      [name, type, adress, ceo, phone, email, rating, id]
    );
    dialog.showMessageBox({ message: 'Успех! Информация обновлена.' });
  });
};

/*
  Скидка зависит от общего количества реализованной 
  партнером продукции и составляет: до 10000 – 0%, от 10000 –
  до 50000 – 5%, от 50000 – до 300000 – 10%, более 300000 – 15%.
*/

const getDiscount = (_, id) => {
  return withDatabaseConnection(async (client) => {
    const res = await client.query(
      'SELECT SUM(quantity) FROM sales WHERE partner_id = $1;',
      [id]
    );
    const sum = res.rows[0].sum || 0;

    let discount = 0;
    if (sum > 300000) {
      discount = 15;
    } else if (sum > 50000) {
      discount = 10;
    } else if (sum > 10000) {
      discount = 5;
    }

    return discount;
  });
};

// Создание относительного пути к иконке приложения
const baseIconPath = join(__dirname, '../../resources/Мастер пол');

// Создание главного окна
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    icon:
      process.platform === 'linux'
        ? `${baseIconPath}.png`
        : `${baseIconPath}.ico`,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  // Отправка команд с запросами в preload
  ipcMain.handle('getPartners', getPartners);
  ipcMain.handle('getDiscount', getDiscount);
  ipcMain.handle('addPartner', addPartner);
  ipcMain.handle('editPartner', editPartner);
  ipcMain.handle('getPartnerById', getPartnerById);

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
