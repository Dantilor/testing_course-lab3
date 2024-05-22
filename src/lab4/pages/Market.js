const { By, until, Key } = require('selenium-webdriver')


class MarketPage {
    constructor(driver) {
        this.driver = driver
        this.title = By.xpath('//span[text()=\'Каталог\']')
        this.search = By.xpath('//input[@id=\'1\']')
        this.card = By.className('product-card__title-line-container')
        this.score = By.className('value')
        this.delivery = By.xpath('//a[text()=\'Доставка\']')
        this.deliveryTitle = By.xpath('//h1')
    }

    async open() {
        await this.driver.get('https://www.mvideo.ru/')
        await this.driver.manage().window().maximize()
        await this.driver.wait(until.elementLocated(this.title), 5000, 'Заголовок не появился')
    }

    async checkScore() {
        await this.driver.wait(until.elementLocated(this.search), 5000)
        const search = await this.driver.findElement(this.search)
        await search.sendKeys('iphone 15', Key.RETURN)

        await this.driver.wait(until.elementLocated(this.card), 5000)

        const card = await this.driver.findElement(this.card)

        const score = await card.findElement(this.score)
        const scoreText = await score.getText()

        const scoreNumber = parseInt(scoreText, 10)
        return scoreNumber
    }

    async checkDelivery() {
        await this.driver.wait(until.elementLocated(this.delivery), 5000)
        const delivery = await this.driver.findElement(this.delivery)
        await delivery.click()

        await this.driver.wait(until.elementLocated(this.deliveryTitle), 5000)

        const deliveryTitle = await this.driver.findElement(this.deliveryTitle)
        const deliveryTitleText = await deliveryTitle.getText()
        return deliveryTitleText
    }
}

module.exports = MarketPage
