import { test, expect } from '@playwright/test';

const adminUser = {
  email: 'benmouelliachraf@gmail.com',
  password: 'admin123',
};

async function loginAsAdmin(page: any) {
  await page.goto('/admin/login');
  await page.waitForLoadState('networkidle');
  await page.fill('#email', adminUser.email);
  await page.fill('#password', adminUser.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/admin', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
}

test.describe.serial('Parcours administration', () => {

  test('Page login admin — éléments visibles', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'BookNGo' })).toBeVisible();
    await expect(page.locator('text=Administration')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible();
  });

  test('Admin — Dashboard affiche les stats', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Répartition des réservations')).toBeVisible();
  });

  test('Admin — Gestion des hôtels (liste)', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/hotels');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Hôtels' })).toBeVisible();
    await expect(page.locator('text=Ajouter')).toBeVisible();
  });

  test('Admin — Formulaire nouvel hôtel', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/hotels/new');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nouvel hôtel' })).toBeVisible();
    await expect(page.locator('button:has-text("Créer l\'hôtel")')).toBeVisible();
  });

  test('Admin — Gestion des réservations', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/reservations');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Réservations' })).toBeVisible();
  });

  test('Admin — Gestion des utilisateurs', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Utilisateurs' })).toBeVisible();
    await expect(page.locator('text=Ajouter')).toBeVisible();
  });

  test('Admin — Déconnexion depuis la sidebar', async ({ page }) => {
    await loginAsAdmin(page);
    const logoutBtn = page.locator('text=Déconnexion');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    await page.waitForURL('/admin/login', { timeout: 10000 });
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible();
  });
});
