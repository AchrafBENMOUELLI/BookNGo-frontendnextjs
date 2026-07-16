import { test, expect } from '@playwright/test';

/**
 * Test E2E : Validation des formulaires (côté client)
 *
 * Ces tests vérifient que les messages d'erreur Zod
 * s'affichent quand on soumet des données invalides.
 * On teste UNIQUEMENT le frontend (pas besoin de BDD).
 *
 * Les messages d'erreur sont définis dans:
 *   src/schemas/auth.schema.ts
 *
 * Messages exacts:
 *   - "Invalid email address"
 *   - "Password must be at least 8 characters"
 *   - "Name must be at least 2 characters"
 *   - "Passwords do not match"
 */

test('Register — email invalide', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#name', 'Test');
  await page.fill('#email', 'pas-un-email');
  await page.fill('#password', 'password123');
  await page.fill('#password_confirmation', 'password123');

  // Désactiver la validation HTML5 du navigateur pour que Zod prenne le relais
  await page.locator('form').evaluate(form => form.setAttribute('novalidate', ''));
  await page.click('button[type="submit"]');

  // Zod message: "Invalid email address"
  await expect(page.getByText('Invalid email address')).toBeVisible();
});

test('Register — mot de passe trop court', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#name', 'Test');
  await page.fill('#email', 'test@test.com');
  await page.fill('#password', '123');
  await page.fill('#password_confirmation', '123');

  await page.click('button[type="submit"]');

  // Zod message: "Password must be at least 8 characters"
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
});

test('Register — confirmation différente', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#name', 'Test');
  await page.fill('#email', 'test@test.com');
  await page.fill('#password', 'password123');
  await page.fill('#password_confirmation', 'different');

  await page.click('button[type="submit"]');

  // Zod message: "Passwords do not match"
  await expect(page.getByText('Passwords do not match')).toBeVisible();
});

test('Register — nom trop court', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#name', 'J');
  await page.fill('#email', 'test@test.com');
  await page.fill('#password', 'password123');
  await page.fill('#password_confirmation', 'password123');

  await page.click('button[type="submit"]');

  // Zod message: "Name must be at least 2 characters"
  await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
});

test('Login — email invalide', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'pas-un-email');
  await page.fill('#password', 'password123');

  // Désactiver la validation HTML5 du navigateur pour que Zod prenne le relais
  await page.locator('form').evaluate(form => form.setAttribute('novalidate', ''));
  await page.click('button[type="submit"]');

  // Zod message: "Invalid email address"
  await expect(page.getByText('Invalid email address')).toBeVisible();
});

test('Login — mot de passe trop court', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'test@test.com');
  await page.fill('#password', '123');

  await page.click('button[type="submit"]');

  // Zod message: "Password must be at least 8 characters"
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
});
