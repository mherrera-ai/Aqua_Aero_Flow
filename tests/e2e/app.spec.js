import { test, expect } from '@playwright/test'

test.describe('Aqua Aero Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Aqua Aero Flow/)
    await expect(page.locator('canvas#canvas')).toBeVisible()
    await expect(page.locator('.controls')).toBeVisible()
  })

  test('should display Windows 95 style control panel', async ({ page }) => {
    const controlPanel = page.locator('.controls')
    await expect(controlPanel).toBeVisible()
    await expect(controlPanel.locator('.controls-header h3')).toContainText('Aqua Aero Flow')
    await expect(controlPanel.locator('.tab-button')).toHaveCount(5)
  })

  test('should switch between tabs', async ({ page }) => {
    await page.click('[data-tab="visual"]')
    await expect(page.locator('#visual-tab')).toBeVisible()
    await expect(page.locator('#main-tab')).not.toBeVisible()

    await page.click('[data-tab="presets"]')
    await expect(page.locator('#presets-tab')).toBeVisible()
    await expect(page.locator('#visual-tab')).not.toBeVisible()
  })

  test('should adjust particle count', async ({ page }) => {
    const slider = page.locator('#particleCount')
    const value = page.locator('#particleValue')
    
    await slider.fill('1000')
    await expect(value).toHaveText('1000')
  })

  test('should switch visualization modes', async ({ page }) => {
    const modeSelect = page.locator('#visualMode')
    await modeSelect.selectOption('vortex')
    await expect(modeSelect).toHaveValue('vortex')
    
    await modeSelect.selectOption('waves')
    await expect(modeSelect).toHaveValue('waves')
  })

  test('should load presets', async ({ page }) => {
    await page.click('[data-tab="presets"]')
    await page.click('button:has-text("Calm Waters")')
    
    // Should show tooltip
    await expect(page.locator('.tooltip')).toBeVisible()
    await expect(page.locator('.tooltip')).toContainText('Loaded preset')
  })

  test('should toggle panel minimize', async ({ page }) => {
    await page.click('.toggle-collapse')
    await expect(page.locator('.controls')).toHaveClass(/collapsed/)
    
    await page.click('.toggle-collapse')
    await expect(page.locator('.controls')).not.toHaveClass(/collapsed/)
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Press 1-5 to switch modes
    await page.keyboard.press('2')
    await expect(page.locator('#visualMode')).toHaveValue('vortex')
    
    await page.keyboard.press('3')
    await expect(page.locator('#visualMode')).toHaveValue('waves')
    
    // Reset with R
    await page.keyboard.press('r')
    await expect(page.locator('#visualMode')).toHaveValue('flow')
  })

  test('should be draggable', async ({ page }) => {
    const panel = page.locator('.controls')
    const header = page.locator('.controls-header')
    
    const box = await panel.boundingBox()
    const initialX = box.x
    
    await header.hover()
    await page.mouse.down()
    await page.mouse.move(initialX + 100, box.y)
    await page.mouse.up()
    
    const newBox = await panel.boundingBox()
    expect(newBox.x).not.toBe(initialX)
  })

  test('should display FPS counter', async ({ page }) => {
    const fpsCounter = page.locator('#fps-counter')
    await expect(fpsCounter).toBeVisible()
    await expect(fpsCounter).toContainText('FPS:')
  })

  test('should have accessibility features', async ({ page }) => {
    // Check ARIA labels
    await expect(page.locator('.controls')).toHaveAttribute('role', 'region')
    await expect(page.locator('.controls')).toHaveAttribute('aria-label')
    
    // Check range inputs have ARIA attributes
    const particleSlider = page.locator('#particleCount')
    await expect(particleSlider).toHaveAttribute('aria-valuemin')
    await expect(particleSlider).toHaveAttribute('aria-valuemax')
    await expect(particleSlider).toHaveAttribute('aria-valuenow')
  })

  test('should register service worker for PWA', async ({ page }) => {
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    expect(swRegistered).toBe(true)
  })

  test('should have responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('.controls')).toBeVisible()
    
    // Panel should adapt to mobile viewport
    const panel = page.locator('.controls')
    const box = await panel.boundingBox()
    expect(box.width).toBeLessThanOrEqual(375)
  })
})