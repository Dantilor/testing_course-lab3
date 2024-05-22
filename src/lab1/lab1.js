const { Builder } = require('selenium-webdriver');
const SampleTodoAppPage = require('./PageObject1');
const { describe, it, before, after } = require('mocha');
const { strictEqual } = require('assert');

describe('Sample Todo App Tests', function() {
    let driver;
    let page;

    before(async function() {
        this.timeout(10000);
        try {
            driver = await new Builder().forBrowser('chrome').build();
            page = new SampleTodoAppPage(driver);
            await driver.get("https://lambdatest.github.io/sample-todo-app/");
            await driver.manage().window().maximize();
            await driver.sleep(5000);
        } catch (error) {
            console.error('Ошибка при загрузке страницы: %s', error);
            throw error;
        }
    });

    it('should verify page title', async function() {
        let pageTitle = await driver.getTitle();
        strictEqual(pageTitle, "Sample page - lambdatest.com");
    });

    it('should verify remaining items text', async function() {
        let text = await page.getText();
        strictEqual(text, "5 of 5 remaining");
    });

    it('should verify first item class', async function() {
        let firstItemClass = await page.getFirstItemClass();
        strictEqual(firstItemClass.includes("done-true"), false);
    });

    it('should mark first item as done', async function() {
        await page.clickFirstItemCheckbox();
        let firstItemClass = await page.getFirstItemClass();
        strictEqual(firstItemClass.includes("done-false"), false);
    });

    it('should mark remaining items as done', async function() {
        for (let i = 2; i <= 5; i++) {
            await page.clickListItemCheckbox(i);
            let itemClass = await page.getFirstItemClass();
            strictEqual(itemClass.includes("done-false"), false);
        }
    });

    it('should add a new item', async function() {
        await page.addNewItem("Новый элемент");
    });

    after(async function() {
        try {
            await driver.takeScreenshot().then(function(image) {
                require('fs').writeFileSync('screenshot_error.png', image, 'base64');
            });
        } catch (err) {
            console.error('Ошибка при сохранении скриншота: %s', err);
        } finally {
            await driver.quit();
        }
    });
});