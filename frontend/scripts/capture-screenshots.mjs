import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { user, rates, units, bills, unitDetails } from './screenshot-fixtures.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.RENTAL_CAPTURE_OUTPUT_DIR || path.join(root, 'src/assets/screenshots');
const server = await createServer({ root, server: { host: '127.0.0.1', port: 5184, strictPort: true } });
const base = 'http://127.0.0.1:5184';
const unitRoute = '/units/unit-1';
const billRoute = `${unitRoute}/bills/bill-draft`;
const manifest = [];
const errors = [];
let browser;
const openDownload = async page => page.getByTitle('Download bill', { exact: true }).first().click();
const scenarios = [
  { name: 'landing', route: '/', public: true, ready: '#landing-title' },
  { name: 'sign-in', route: '/login', public: true, ready: 'input[name=email]' },
  { name: 'sign-up', route: '/register', public: true, ready: 'input[name=full_name]' },
  { name: 'dashboard', route: '/dashboard', ready: 'text=Recent Bills' },
  { name: 'units', route: '/units', ready: 'text=My Units' },
  { name: 'unit-create', route: '/units', ready: 'text=My Units', prepare: async page => {
    await page.getByRole('button', { name: '+ Add Unit', exact: true }).click();
    await page.locator('[name=unit_name]').fill('Courtyard Studio');
    await page.locator('[name=monthly_rent]').fill('8500');
  } },
  { name: 'unit-occupied', route: unitRoute, ready: 'text=Tenant Info' },
  { name: 'unit-vacant', route: '/units/unit-4', ready: 'text=No tenant assigned yet' },
  { name: 'tenant-add', route: '/units/unit-4', ready: 'text=No tenant assigned yet', prepare: async page => {
    await page.getByRole('button', { name: 'Add Tenant', exact: true }).click();
    await page.locator('[name=tenant_name]').fill('Luis Mendoza');
    await page.locator('[name=person_count]').fill('2');
  } },
  { name: 'tenant-edit', route: unitRoute, ready: 'text=Tenant Info', prepare: async page => page.getByRole('button', { name: 'Edit', exact: true }).click() },
  { name: 'bill-generate', route: unitRoute, ready: 'text=Bill History', prepare: async page => {
    await page.getByRole('button', { name: 'Generate Bill', exact: true }).click();
    await page.locator('[name=billing_month]').fill('2026-12');
    await page.locator('[name=current_kwh]').fill('1400');
  } },
  { name: 'bill-draft', route: billRoute, ready: 'text=Meter Readings' },
  { name: 'bill-breakdown', route: billRoute, ready: 'text=Bill Breakdown', prepare: async page => page.getByRole('heading', { name: 'Bill Breakdown', exact: true }).scrollIntoViewIfNeeded() },
  { name: 'bill-confirmed', route: `${unitRoute}/bills/bill-confirmed`, ready: 'text=Confirmed on' },
  { name: 'bill-rate-warning', route: billRoute, ready: 'text=Meter Readings', warning: true, prepare: async page => {
    await page.getByRole('button', { name: 'Confirm Bill', exact: true }).click();
    await page.getByText('Rate has changed since this bill was generated', { exact: true }).waitFor();
    await page.getByText('Rate has changed since this bill was generated', { exact: true }).scrollIntoViewIfNeeded();
  } },
  { name: 'bill-download-options', route: unitRoute, ready: 'text=Bill History', prepare: openDownload },
  { name: 'bill-preview', route: unitRoute, ready: 'text=Bill History', prepare: async page => {
    await openDownload(page);
    await page.getByRole('button', { name: 'Preview Bill', exact: true }).click();
  } },
  { name: 'rate-settings', route: '/settings/rates', ready: 'text=Rate History' },
  { name: 'rate-create', route: '/settings/rates', ready: 'text=Rate History', prepare: async page => {
    await page.getByRole('button', { name: 'New Rate', exact: true }).click();
    await page.locator('[name=electricity_rate]').fill('13');
    await page.locator('[name=water_rate]').fill('175');
    await page.locator('[name=effective_from]').fill('2026-12-01');
  } },
];

try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } })) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'en-PH', timezoneId: 'Asia/Manila', reducedMotion: 'reduce', colorScheme: 'dark' });
    let scenario;
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === base && !['fetch', 'xhr'].includes(request.resourceType())) return route.continue();
      const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
      // All API calls are mocked. No real account or backend is contacted.
      const apiPath = url.pathname.replace(/^.*\/api(?=\/)/, '');
      if (apiPath === '/auth/me') return scenario?.public ? json({ message: 'No demo session' }, 401) : json(user);
      if (apiPath === '/units') return json(units);
      if (apiPath.startsWith('/units/')) return json(unitDetails.find(unit => unit.id === apiPath.split('/')[2]));
      if (apiPath === '/bills') return json(bills);
      if (apiPath.endsWith('/confirm') && scenario?.warning) return json({ warning: true, message: 'Rate has changed since this bill was generated', current_bill_rates: { electricity_rate: 12.5, water_rate: 150 }, new_rates: { electricity_rate: 13, water_rate: 175 } }, 400);
      if (apiPath.startsWith('/bills/')) return json(bills.find(bill => bill.id === apiPath.split('/')[2]));
      if (apiPath === '/settings/rates') return json(rates);
      if (url.origin === base && !url.pathname.startsWith('/api/')) return route.continue();
      return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
    for (scenario of scenarios) {
      await page.goto(`${base}${scenario.route}`, { waitUntil: 'networkidle' });
      await page.locator(scenario.ready).first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (scenario.prepare) await scenario.prepare(page);
      if (scenario.name === 'landing') {
        await page.getByRole('button', { name: 'Room 2B', exact: true }).click();
        await page.getByText('₱9,950', { exact: true }).waitFor();
        await page.getByRole('button', { name: 'Room 1A', exact: true }).click();
        const links = await page.locator('header nav a').evaluateAll(links => links.map(link => link.getAttribute('href')));
        if (!links.includes('/login') || !links.includes('/register')) throw Error('Missing authentication navigation.');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (overflow) throw Error(`Landing page overflows at ${viewport.width}px.`);
      }
      await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
      await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
      const file = `${device}/forest/${scenario.name}.png`;
      await mkdir(path.dirname(path.join(output, file)), { recursive: true });
      await page.screenshot({ path: path.join(output, file), fullPage: true, animations: 'disabled' });
      manifest.push({ file, route: scenario.route, viewport, theme: 'forest', mockData: true });
      console.log(`Saved ${file}`);
    }
    if (device === 'mobile') {
      scenario = { public: false };
      await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Toggle menu', exact: true }).click();
      await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' });
      const file = 'mobile/forest/navigation-menu.png';
      await page.screenshot({ path: path.join(output, file), animations: 'disabled' });
      manifest.push({ file, route: '/dashboard', viewport, theme: 'forest', mockData: true });
    }
    await context.close();
  }
  await writeFile(path.join(output, 'manifest.json'), JSON.stringify({ description: 'Rental Manager pages and features with fictional data', screenshots: manifest }, null, 2) + '\n');
  if (errors.length) throw Error([...new Set(errors)].join('\n'));
  console.log(`Completed ${manifest.length} screenshots; no page errors.`);
} finally {
  await browser?.close();
  await server.close();
}
