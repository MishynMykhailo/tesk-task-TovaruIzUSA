const { ParseGmail } = require("./helpers");
require("dotenv").config();

// ССылка для перехода
const linkForGmailLogin = "https://mail.google.com/";

// Заполните данные в файле .env, подробнее прочитайте в .env.example
const { GOOGLE_LOGIN, GOOGLE_PASS } = process.env;
(async () => {
  // Создать браузер
  await ParseGmail.initializeParser("new");
  // Создать страницу
  await ParseGmail.createPage();
  // Перейти по ссылке
  await ParseGmail.gotoLink(linkForGmailLogin);
  // Пройти Авторизацию гугл
  await ParseGmail.authorizationGoogle({
    login: GOOGLE_LOGIN,
    pass: GOOGLE_PASS,
  });
  // Получить число писем
  await ParseGmail.parseEmail();
  // Сделать скрин
  await ParseGmail.screenshot();
  // Завершить работу
  await ParseGmail.closeBrowser();
})();
