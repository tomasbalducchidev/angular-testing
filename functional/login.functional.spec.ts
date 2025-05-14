import { test, expect } from '@playwright/test'

test('deberia redirigir al dashboard en login exitoso', async ({ page }) => {
  await page.route('**/api/login', async (route) => { // Si hay una api en un ambiente dev, se puede usar esa api, pero en este caso mockeamos.
    await route.fulfill({ status: 200})
  })

  await page.goto('http://localhost:4200')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('http://localhost:4200/dashboard')
})

test('deberia de mostrar un mensaje de error en login fallido', async ({page}) => {
  await page.route('**/api/login', async (route) => {
    await route.fulfill({
      status: 401,
      body: JSON.stringify({ message: 'Invalid email or password'})
    })
  })

  await page.goto('http://localhost:4200')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'wrongPassword')
  await page.click('button[type="submit"]')

  const errorMessage = page.locator('text=Invalid email or password')
  await expect(errorMessage).toBeVisible()
})