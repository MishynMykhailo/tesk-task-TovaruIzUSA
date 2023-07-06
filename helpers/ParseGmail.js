const puppeteer = require("puppeteer-extra");
const colors = require("colors");

class ParseGmail {
  constructor() {
    this.browser = null;
    this.page = null;
  }
  //   Создать браузер
  async initializeParser(headless = true) {
    try {
      this.browser = await puppeteer.launch({
        //   executablePath: pathForBrowser,
        headless: headless,
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  // Создать страницу
  async createPage(duration = "30000") {
    try {
      this.page = await this.browser.newPage();
      this.page.setDefaultNavigationTimeout(duration);
    } catch (err) {
      console.log(err.message);
    }
  }
  // Переход по ссылке
  async gotoLink(url) {
    await this.page.goto(`${url}`);
  }
  // Вход в Google Account
  async authorizationGoogle({ login, pass }) {
    await this.page.type('input[type="email"]', login);
    await this.page.click("#identifierNext");
    await this.page.waitForNavigation();
    await this.page.waitForSelector("#password");
    await this.page.waitForSelector('input[type="password"]');
    await this.page.waitForTimeout(2000);
    await this.page.type('input[type="password"]', pass);
    await this.page.click("#passwordNext");
    await this.page.waitForNavigation();
  }
  // Спарсить письма на почте
  async parseEmail() {
    const result = await this.page.evaluate(() => {
      const numberLetters = document.querySelector(".bsU")?.innerText;
      return numberLetters;
    });
    if (result < 1 || result == undefined) {
      this.formatMessage(`У вас нет непрочитанных писем 👍`);
    } else {
      this.formatMessage(
        `У вас ${result} ${
          result <= 1 ? "- непрочитанное письмо" : "- непрочитанных писем"
        } 👍`
      );
    }
  }
  // Доп. настройка для оформления вывода результата
  formatMessage(message) {
    let line = "=";
    for (let i = 0; i < message.length; i += 1) {
      line += "=";
    }
    console.log(line.yellow);
    console.log(colors.brightGreen.bold(message));
    console.log(line.yellow);
  }
  // Скриншот для просмотра скрина с письмами
  async screenshot() {
    await this.page.screenshot({ path: "gmail-letters.png" });
    console.log("Скриншот сохранен".magenta);
  }
  // Завершить работу
  async closeBrowser() {
    try {
      await this.browser.close();
      console.log("Работа завершена".brightGreen.bold);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new ParseGmail();
