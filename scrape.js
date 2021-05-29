/* eslint-disable */
const puppeteer = require('puppeteer-extra');
// const mongoose = require('./config/mongoose');

// mongoose.connect();

const Articles = require('./api/models/article');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(AdblockerPlugin());

puppeteer.use(StealthPlugin());

const excludeSections = ['Technology Quarterly', 'Special reports'];
// puppeteer usage as normal
module.exports = () => {
  puppeteer.launch({headless: true, args: ['--no-sandbox']}).then(async (browser) => {

    console.log('Running scraping..');
    const page = await browser.newPage();
    // page.on('console', consoleObj => console.log(consoleObj.text()));

    await page.goto('https://www.economist.com/', {
      waitUntil: 'networkidle0',
    });
    // await login(page)
    await goToArticles(page);

    await page.waitForTimeout(1000);
    // await page.screenshot({ path: 'testresult.png', fullPage: true })
    // await browser.close()
    console.log('Scraping done ✨');
    page.close();
    browser.close();
  });
};


async function goToArticles(page) {
  // initial page
  let articleObject = {};
  const cookoeAccept = await page.$('.evidon-barrier-acceptbutton');
  if (cookoeAccept && cookoeAccept[0]) cookoeAccept[0].click();
  const menuItem = await page.$('.ds-menu-disclosure');
  await menuItem.click();

  const sections = await page.$('.ds-navigation-list--section');
  await sections.click();
  await page.waitForTimeout(100);
  let world = await page.$$('.ds-navigation-list--section .ds-navigation-link');
  const lengthSectopm = world.length;

  const sectionNames = await getSectionsNames(page);

  for (let k = 1; k < lengthSectopm; k += 1) {
    if (excludeSections.includes(sectionNames[k])) continue;
    await page.waitForSelector('.ds-navigation-list--section .ds-navigation-link');
    world = await page.$$('.ds-navigation-list--section .ds-navigation-link');

    await world[k].click();
    await page.waitForSelector('.teaser--section-collection');

    // await page.waitForNavigation({
    //   waitUntil: 'networkidle0',
    // });

    for (let j = 0; j < 1; j += 1) {
      // articles
      let length = 0;
      try {
        await page.waitForSelector('.teaser--section-collection');

        const articlesLinks = await page.$$('.teaser--section-collection');
        length = articlesLinks.length;
      } catch (e) {
        break;
        console.error(e);
      }
      for (let i = 0; i < length; i += 1) {
        try {
          const articlesLinks = await page.$$('.teaser--section-collection');
          articleObject = {};
          const link = articlesLinks[i];
          await link.click();
          await page.waitForSelector('.article__subheadline');

          // assign values

          articleObject.date = getDate(await page.url());
          articleObject.subheadline = await page.$eval('.article__subheadline', el => el.innerText);
          articleObject.headline = await page.$eval('.article__headline', el => el.innerText);
          articleObject.description = await page.$eval('.article__description', el => el.innerText);
          articleObject.section = await page.$eval('.article__section-headline a', el => el.innerText);
          articleObject.imageUrl = await page.evaluate('document.querySelector("img").getAttribute("src")');
          articleObject.bodyText = await getBodyText(page);
          // articles.push(articleObject)
          await createArticleOrUpdate(articleObject);
          await page.goBack();
          await page.waitForSelector('.teaser--section-collection');
        } catch (e) {
          break;
          console.error(e);
        }
      }

      try {
        await page.evaluate(() => {
          const next = document.querySelector('.ds-pagination__item--active').nextSibling;
          next.querySelector('a').click();
        });
      } catch (e) {
        break;
        console.error(e);
      }
    }

    await page.waitForSelector('.ds-menu-disclosure');

    await page.waitForSelector('.ds-menu-disclosure');
    const menuItem = await page.$('.ds-menu-disclosure');
    await menuItem.click();

    await page.waitForSelector('.ds-navigation-list--section');
    const sections = await page.$('.ds-navigation-list--section');
    await sections.click();
  }
}

function getDate(url) {
  const array = url.split('/');
  return `${array[4]}-${array[5]}-${array[6]}`;
}

async function getBodyText(page) {
  return await page.$$eval('.article__body-text', options =>
    options.map(option => option.textContent));
}

async function getSectionsNames(page) {
  return await page.$$eval(
    '.ds-navigation-list--section .ds-navigation-link > span',
    options =>
      options.map(option => option.textContent),
  );
}


async function login(page) {
  const loginButton = await page.$('.ds-masthead-nav-beta__item--log-in');
  await loginButton.click();

  await page.waitForTimeout(500);
  const inputForm = await page.$('.ds-form-input');
  await inputForm.click();
  await page.keyboard.type('lebedev.vladimir3@gmail.com', {delay: 100});
  await page.click('button[type="submit"]');

  // second login with password
  // var aa = document.querySelector('.slds-container_small div')

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  await page.evaluate(async () => {
    const a = document.querySelector('c-lwc-login-form');// eslint-disable-line
    const bb = a.shadowRoot.children[4];

    const cc = bb.shadowRoot.querySelector('.slds-card__body');

    const dd = cc.querySelector('slot');
    const ee = dd.assignedNodes()[0];

    const qq = ee.querySelectorAll('lightning-input')[1];
    const input = qq.shadowRoot.querySelector('div input');
    input.value = 'vladimir1';
    await input.focus();
    await input.select();
  });
  await page.keyboard.type(String.fromCharCode(13));
}

async function createArticleOrUpdate(data) {
  try {
    let found = await Articles.findOne({imageUrl: data.imageUrl}).exec();
    if (found) {
      found = Object.assign(found, data);

      await found.save();
      return;
    }
    const article = new Articles(data);
    await article.save();
  } catch (error) {
    console.error(error);
  }
}

/*
await page.evaluate(async () => {

  let articles = document.getElementsByClassName('ds-layout-grid teaser teaser--section-collection')
  const teaser__subheadline = articles[0].getElementsByClassName('teaser__subheadline')[0].innerText
  const teaser__headline = articles[0].getElementsByClassName('teaser__headline')[0].innerText
  const teaser__description = articles[0].getElementsByClassName('teaser__description')[0].innerText
  //
  console.log('articlesarticlesarticles')
  console.log(teaser__subheadline)
  console.log(teaser__description)

})
*/
