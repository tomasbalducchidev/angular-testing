import { test, expect } from '@playwright/test'

test('flujo completo de login exitoso', async ({page}) => {
  // mockear la api de login para caso exitoso
  await page.route('**/api/login', async route => {
    const requestBody = await route.request().postDataJSON()
    if (requestBody.email == 'user@example.com' && requestBody.password == 'password123') {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      })
    } else {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Invalid email or password' })
      })
    }
  })

  // iniciar sesion
  await page.goto('http://localhost:4200')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  // verificar la redireccion
  await expect(page).toHaveURL('http://localhost:4200/dashboard')
})

test('flujo completo de login fallido', async ({page}) => {
  // mockear la api de login para caso fallido
  await page.route('**/api/login', async route => {
    const requestBody = await route.request().postDataJSON()
    if (requestBody.email == 'user@example.com' && requestBody.password == 'wrongPassword') {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Invalid email or password' })
      })
    } else { // mmm medio raro esto. Si ya hago un flujo completo de login exitoso, por que contemplar el else? No tiene sentido.
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      })
    }
  })

  // iniciar sesion
  await page.goto('http://localhost:4200')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'wrongPassword')
  await page.click('button[type="submit"]')

  // verificar mensaje de error
  const errorMessage = page.locator("text=Invalid email or password")
  await expect(errorMessage).toBeVisible()
})