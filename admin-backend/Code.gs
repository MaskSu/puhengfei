// ===== 蒲恆菲車業 後台管理系統 - Google Apps Script =====
//
// 設定步驟：
// 1. 前往 https://script.google.com 建立新專案
// 2. 將此檔案內容貼到 Code.gs
// 3. 建立 Admin.html 檔案（從 admin-panel.html 複製）
// 4. 修改下方 CONFIG 設定
// 5. 部署為網頁應用程式

// ===== 設定區 =====
const CONFIG = {
  // Google Sheets 試算表 ID（從網址中取得：docs.google.com/spreadsheets/d/【這段】/edit）
  SPREADSHEET_ID: '1kqaO58kcxKf9h9-n3Ioq9wX6dh3NCJA2JgPHVw7Lcx0',

  // 工作表名稱（預設第一個工作表）
  SHEET_NAME: '工作表1',

  // Google Drive 資料夾 ID（用來存放上傳的圖片）
  // 建立一個資料夾，從網址取得 ID：drive.google.com/drive/folders/【這段】
  DRIVE_FOLDER_ID: '12twZUvTEKOs6AefUw0CKMunQcyzhI2_E',

  // 允許登入的 Google 帳號（可多個）
  ALLOWED_EMAILS: [
    'chienyuan1126@gmail.com'
  ]
};

// ===== 網頁服務 =====
function doGet(e) {
  const user = Session.getActiveUser().getEmail();

  // 檢查權限
  if (!CONFIG.ALLOWED_EMAILS.includes(user)) {
    return HtmlService.createHtmlOutput('<h2>⛔ 無權限存取</h2><p>此帳號未被授權：' + user + '</p>')
      .setTitle('蒲恆菲車業 - 無權限');
  }

  return HtmlService.createHtmlOutputFromFile('Admin')
    .setTitle('蒲恆菲車業 後台管理')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// ===== 取得目前登入的使用者 =====
function getCurrentUser() {
  return Session.getActiveUser().getEmail();
}

// ===== 讀取所有車輛 =====
function getCars() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();

    if (data.length < 2) return [];

    const headers = data[0].map(h => String(h).trim().toLowerCase());
    const cars = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const car = { _row: i + 1 }; // 記錄行號，方便編輯刪除
      headers.forEach((h, j) => {
        car[h] = String(row[j] || '').trim();
      });
      if (car.name) cars.push(car);
    }

    return cars;
  } catch (err) {
    throw new Error('讀取失敗：' + err.message);
  }
}

// ===== 新增車輛 =====
function addCar(carData) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim().toLowerCase());

    const newRow = headers.map(h => carData[h] || '');
    sheet.appendRow(newRow);

    return { success: true, message: '新增成功' };
  } catch (err) {
    throw new Error('新增失敗：' + err.message);
  }
}

// ===== 更新車輛 =====
function updateCar(rowNum, carData) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim().toLowerCase());

    const updatedRow = headers.map(h => carData[h] || '');
    sheet.getRange(rowNum, 1, 1, updatedRow.length).setValues([updatedRow]);

    return { success: true, message: '更新成功' };
  } catch (err) {
    throw new Error('更新失敗：' + err.message);
  }
}

// ===== 刪除車輛 =====
function deleteCar(rowNum) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    sheet.deleteRow(rowNum);

    return { success: true, message: '刪除成功' };
  } catch (err) {
    throw new Error('刪除失敗：' + err.message);
  }
}

// ===== 上傳圖片到 Google Drive =====
function uploadImage(base64Data, fileName) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);

    // base64 轉 Blob
    const mimeMatch = base64Data.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Content), mimeType, fileName);

    // 上傳到 Drive
    const file = folder.createFile(blob);

    // 設定為任何人都可檢視
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const imageUrl = 'https://drive.google.com/file/d/' + fileId + '/view';

    return {
      success: true,
      fileId: fileId,
      url: imageUrl,
      directUrl: 'https://lh3.googleusercontent.com/d/' + fileId + '=w800'
    };
  } catch (err) {
    throw new Error('上傳失敗：' + err.message);
  }
}

// ===== 刪除 Drive 圖片 =====
function deleteImage(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { success: true };
  } catch (err) {
    // 檔案可能已不存在，忽略錯誤
    return { success: true };
  }
}
