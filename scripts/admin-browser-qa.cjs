const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({headless:true});
  const writes = [];
  fs.mkdirSync('qa-artifacts',{recursive:true});
  try {
    for (const width of [390,320]) {
      const context=await browser.newContext({viewport:{width,height:844}});
      await context.route('**/*',route=>{
        const req=route.request();
        if (!['GET','HEAD'].includes(req.method())) writes.push(req.url());
        if (!req.url().startsWith('http://127.0.0.1:4393/')) return route.abort();
        return route.continue();
      });
      const page=await context.newPage();
      await page.goto('http://127.0.0.1:4393/admin/');
      await page.getByRole('heading',{name:'キャンペーンを下書き'}).waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await page.locator('#store_name').fill('合成テスト店舗');
      await page.locator('#title').fill('保存されない確認用');
      await page.locator('#price_display').fill('100円');
      await page.locator('#image_url').fill('http://127.0.0.1:4393/test-image.png');
      await page.locator('#expires_at').fill('2030-01-01T12:00');
      for(let i=0;i<3;i++) await page.getByRole('button',{name:'入力内容を確認',exact:true}).click();
      assert.equal(await page.getByRole('status').count(),1);
      assert.match(await page.getByRole('status').textContent(),/未保存/);
      assert.match(await page.getByRole('status').textContent(),/合成テスト店舗/);
      await page.screenshot({path:`qa-artifacts/admin-${width}.png`,fullPage:true});
      await page.locator('#store_name').fill('変更後');
      assert.equal(await page.getByRole('status').count(),0);
      await page.getByRole('button',{name:'入力内容を確認',exact:true}).click();
      assert.match(await page.getByRole('status').textContent(),/変更後/);
      await page.getByRole('button',{name:'キャンセル',exact:true}).click();
      await page.waitForURL('http://127.0.0.1:4393/');
      await page.goto('http://127.0.0.1:4393/admin/');
      assert.equal(await page.locator('#store_name').inputValue(),'');
      assert.equal(await page.getByRole('status').count(),0);
      await context.close();
    }
    assert.deepEqual(writes,[],'preview must not POST/PUT/PATCH/DELETE');
    console.log('PASS: 390/320, repeated preview, edit invalidation, cancel/reentry; no write requests');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
