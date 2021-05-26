// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(AdblockerPlugin());

puppeteer.use(StealthPlugin());

// a = document.querySelector('c-lwc-login-form')
// bb = a.shadowRoot.children[4]
// cc = bb.shadowRoot.querySelector('.slds-card__body')

// var dd = cc.querySelector('slot')
// var ee = dd.assignedNodes()[0]
// ee.querySelectorAll('lightning-input')[1]

// puppeteer usage as normal

puppeteer.launch({ headless: false }).then(async (browser) => {
  console.log('Running tests..');

  const page = await browser.newPage();
  page.on('console', consoleObj => console.log(consoleObj.text()));


  await page.goto('https://www.economist.com/', {
    waitUntil: 'networkidle0',
  });
  // set login
  const loginButton = await page.$('.ds-masthead-nav-beta__item--log-in');
  await loginButton.click();

  await page.waitForTimeout(500);
  const inputForm = await page.$('.ds-form-input');
  await inputForm.click();
  await page.keyboard.type('lebedev.vladimir3@gmail.com', { delay: 100 });
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
  // end set login


  await page.waitForTimeout(5000);
  // await page.screenshot({ path: 'testresult.png', fullPage: true })
  // await browser.close()
  console.log('All done, check the screenshot. ✨');
});

/*
async function blabal() {
  // initial page
  const cookoeAccept = await page.$('.evidon-barrier-acceptbutton');
  if (cookoeAccept && cookoeAccept[0]) cookoeAccept[0].click();
  const menuItem = await page.$('.ds-menu-disclosure');
  await menuItem.click();

  const sections = await page.$('.ds-navigation-list--section');
  await sections.click();
  await page.waitForTimeout(100);
  const world = await page.$$('.ds-navigation-list--section .ds-navigation-link');
  await world[1].click();
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  // articles
  const articles = await page.$$('.teaser--section-collection');
  await articles[0].click();
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  // start parse articles
  // end parse articles
}
*/

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
