const { By, until } = require('selenium-webdriver')

class MarketPage {
    constructor(driver) {
        this.driver = driver
        this.catalogMenu = By.xpath("//button[.//span[text()='Каталог']]")
        this.categoryMenu = By.xpath("//a/span[text()='Все для гейминга']")
        this.mobileGamingPath = By.xpath("//div[@data-apiary-widget-name='@marketplace/StaticScrollBoxViewport']/div[6]")
        this.gamingPhoneMenu = By.xpath("//span[text()='Игровые телефоны']")
        this.filterOption = By.xpath("//fieldset[.//h4[text()='Производитель']]//div[@data-zone-name='FilterValue']//span[text()='Samsung']")
        this.productCard = By.xpath("//div[@data-auto-themename='listDetailed' and .//button[@title='Добавить в избранное']]")
        this.productTitle = By.xpath(".//h3[@data-auto='snippet-title']")
    }

    async open() {
        await this.driver.get('https://market.yandex.ru')
        await this.driver.manage().window().maximize()
        // чтобы пройти капчу
        await this.driver.sleep(20000)
        await this.driver.wait(until.elementLocated(this.catalogMenu), 5000, 'Заголовок не появился')
    }

    async navigateToGamingPhones() {
        await this.driver.wait(until.elementLocated(this.catalogMenu), 5000)
        const catalogMenu = await this.driver.findElement(this.catalogMenu)
        await catalogMenu.click()
        await this.driver.wait(until.elementLocated(this.categoryMenu), 5000)
        const categoryMenu = await this.driver.findElement(this.categoryMenu)
        await categoryMenu.click()
        const mobileGaming =  await this.driver.findElement(this.mobileGamingPath)
        await mobileGaming.click()
        await this.driver.wait(until.elementLocated(this.gamingPhoneMenu), 5000)
        const gamingPhoneMenu = await this.driver.findElement(this.gamingPhoneMenu)
        await gamingPhoneMenu.click()
    }

    async setSamsungManufacturer() {
        await this.driver.wait(until.elementLocated(this.filterOption), 5000)
        const sortOption = await this.driver.findElement(this.filterOption)
        await sortOption.click()
    }

    async getFirstFiveProducts() {
        const products = await this.driver.findElements(this.productCard)
        const elements = []
        let count = 0
        let i = 0
        while (count < 5 && i < products.length) {
            const productName = await products[i].findElement(this.productTitle).getText()
            let newElement = { name: productName }
            elements.push(newElement)
            count++
            i++
        }
        return elements
    }

    isSamsungProducts(products) {
        for (let i = 0; i < products.length; i++) {
            if (!products[i].name.includes('Samsung')) {
                return false
            }
        }
        return true
    }

}

module.exports = MarketPage