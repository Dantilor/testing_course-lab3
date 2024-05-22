const { By } = require('selenium-webdriver')
const { equal } = require('assert')

class TodoApp {
    constructor(driver) {
        this.driver = driver
        this.title = By.xpath('//h2')
    }

    async getTitle() {
        return await this.driver.findElement(this.title).getText()
    }

    async getRemainingCount() {
        const remainingElem = await this.driver.findElement(By.xpath('//span[@class=\'ng-binding\']'))
        return await remainingElem.getText()
    }

    async getItem(index) {
        return await this.driver.findElement(By.xpath(`//input[@name='li${index}']/following-sibling::span`))
    }

    async toggleItem(index) {
        await this.driver.findElement(By.name(`li${index}`)).click()
    }

    async addNewItem(text) {
        await this.driver.findElement(By.id('sampletodotext')).sendKeys(text)
        await this.driver.findElement(By.id('addbutton')).click()
    }

    async verifyItemClass(item, expectedClass) {
        const itemClass = await item.getAttribute('class')
        equal(itemClass, expectedClass)
    }
}

module.exports = TodoApp
