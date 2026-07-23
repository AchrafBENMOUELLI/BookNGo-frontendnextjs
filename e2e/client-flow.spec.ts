import { test, expect } from '@playwright/test';

/**
 * Test E2E : Parcours client
 *
 * Chaque test est indépendant et gère son propre état.
 * Cela évite les problèmes de partage de cookies/session
 * entre workers parallèles.
 */
const uniqueId = Date.now();
const testUser = {
  name: 'Test Client',
  email: `client-${uniqueId}@test.tn`,
  password: 'password123',
};

test('Page d\'accueil affiche les éléments clés', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Find your perfect stay');
  await expect(page.locator('text=Browse Hotels')).toBeVisible();
});

test('Parcourir la liste des hôtels', async ({ page }) => {
  await page.goto('/hotels');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: /Hôtels/ })).toBeVisible();
});

test('Consulter le détail d\'un hôtel', async ({ page }) => {
  await page.goto('/hotels');
  await page.waitForLoadState('networkidle');

  // Clique sur le premier lien hôtel de la liste
  const firstHotel = page.locator('a[href*="/hotels/"]').first();
  const count = await firstHotel.count();
  if (count > 0) {
    await firstHotel.click();
    await page.waitForLoadState('networkidle');
    // Vérifie qu'on a atterri sur une page détail (URL /hotels/{id})
    await expect(page).toHaveURL(/\/hotels\/\d+/);
  }
});

// describe.serial exécute les tests les uns après les autres
// dans le même worker, évitant les conflits d'authentification
test.describe.serial('Parcours authentifié', () => {

  test('Inscription', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('#name', testUser.name);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#password_confirmation', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/', { timeout: 15000 });
  });

  test('Se connecter', async ({ page }) => {
    await page.goto('.');
    await page.waitForLoadState('networkidle');

    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/', { timeout: 15000 });
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('Consulter ses réservations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 15000 });

    await page.goto('/my-reservations');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Mes réservations')).toBeVisible();
  });

  test('Se déconnecter', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 15000 });

    const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Se déconnecter"), a:has-text("Se déconnecter")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Create Account')).toBeVisible();
    }
  });
});
