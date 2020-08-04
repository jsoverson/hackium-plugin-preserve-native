import { expect } from 'chai';
import { Hackium } from 'hackium';
import plugin from '../src';
import { start, TestServer } from '@jsoverson/test-server';

describe('preserve-native', function () {
  this.timeout(20000);
  let instance: Hackium | undefined;
  let server: TestServer;

  before(async () => {
    server = await start(__dirname, '_server_root');
  });

  after(async () => {
    await server.stop();
  });

  afterEach(async () => {
    if (instance) {
      return instance.close();
    }
  });

  it('should preserve root level functions like JSON.stringify', async () => {
    instance = new Hackium({ url: server.url('index.html'), plugins: [plugin] });
    const browser = await instance.cliBehavior();
    const [page] = await browser.pages();
    const existing = await page.evaluate(() => {
      return JSON.stringify({ a: 'b' });
    });
    expect(existing).to.equal('JSON.stringify overridden');
    const preserved = await page.evaluate(() => {
      //@ts-ignore
      return hackium.JSON.stringify({ a: 'b' });
    });
    expect(preserved).to.equal(JSON.stringify({ a: 'b' }));
  });
  it('should preserve prototype level functions like Function.prototype.toString', async () => {
    instance = new Hackium({ url: server.url('index.html'), plugins: [plugin] });
    const browser = await instance.cliBehavior();
    const [page] = await browser.pages();
    const existing = await page.evaluate(() => {
      return function () {
        'test';
      }.toString();
    });
    expect(existing).to.equal('Function.prototype.toString overridden');
    const preserved = await page.evaluate(() => {
      //@ts-ignore
      return hackium.Function.prototype.toString.call(function () {
        'test';
      });
    });
    expect(preserved).to.match(/test/);
  });
});
