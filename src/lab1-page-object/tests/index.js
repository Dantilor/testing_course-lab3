const { Builder } = require('selenium-webdriver')
const assert = require('assert')
const fs = require('fs')
const TodoApp = require('../pages/TodoApp.js')
const { describe, it, before, after } = require('mocha')

describe('LambdaTest Sample To-Do App', function() {
    this.timeout(30000)
    let driver
    let todoPage

    before(async () => {
        driver = new Builder().forBrowser('chrome').build()
        todoPage = new TodoApp(driver)
        await driver.manage().window().maximize()
        await driver.get('https://lambdatest.github.io/sample-todo-app/')
        await driver.sleep(1000)
    })

    after(async () => {
        await driver.quit()
    })

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            const image = await driver.takeScreenshot()
            const timestamp = new Date()
            const testCaseName = 'TodoApp'
            const screenshotFilename = `${testCaseName}_${timestamp.toLocaleDateString('ru-RU')}_${timestamp.getHours()}_${timestamp.getMinutes()}_${timestamp.getSeconds()}.png`
            fs.writeFileSync(screenshotFilename, image, 'base64')
            console.error(`Тест упал по причине ошибки: ${this.currentTest.err.message}. Скриншот сохранен в файл: ${screenshotFilename}`)
        }
    })

    it('should have the correct title', async () => {
        const titleText = await todoPage.getTitle()
        assert.strictEqual(titleText, 'LambdaTest Sample App')
    })

    it('should display correct remaining count initially', async () => {
        const remainingText = await todoPage.getRemainingCount()
        assert.strictEqual(remainingText, '5 of 5 remaining')
    })

    it('should mark items as done correctly', async () => {
        let total = 5
        let remaining = 5

        for (let i = 1; i <= total; i++) {
            let remainingText = await todoPage.getRemainingCount()
            assert.strictEqual(remainingText, `${remaining} of ${total} remaining`)

            const item = await todoPage.getItem(i)
            await todoPage.verifyItemClass(item, 'done-false')

            await todoPage.toggleItem(i)
            remaining--
            await driver.sleep(1000)
            await todoPage.verifyItemClass(item, 'done-true')
        }
    })

    it('should add a new item correctly', async () => {
        const newItemText = 'New item'

        await todoPage.addNewItem(newItemText)

        const item = await todoPage.getItem(6)
        const itemText = await item.getText()

        assert.strictEqual(itemText, newItemText)
        await todoPage.verifyItemClass(item, 'done-false')

        await todoPage.toggleItem(6)
        await todoPage.verifyItemClass(item, 'done-true')
    })

})
