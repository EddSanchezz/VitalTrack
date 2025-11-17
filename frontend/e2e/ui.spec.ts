import { test, expect, Page } from '@playwright/test';

async function createUsuario(page: Page) {
  const suffix = Date.now();
  const cedula = `E2E-${suffix}`;
  const nombre = `Usuario E2E ${suffix}`;
  const email = `e2e_${suffix}@test.dev`;
  const fecha = new Date();
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  const fechaNacimiento = `${yyyy}-${mm}-${dd}`;

  await page.getByRole('button', { name: 'Usuarios' }).click();
  await page.waitForSelector('text=Gestión de Usuarios');

  await page.fill('#cedula', cedula);
  await page.fill('#nombre', nombre);
  await page.fill('#email', email);
  await page.fill('#fecha_nacimiento', fechaNacimiento);
  const privacidad = page.locator('input[name="consentimiento_privacidad"]');
  if (!(await privacidad.isChecked())) {
    await privacidad.check();
  }
  await page.getByRole('button', { name: 'Crear Usuario' }).click();

  await expect(page.getByText('Usuario creado')).toBeVisible();
  await expect(page.locator('.usuarios-table')).toBeVisible();

  const row = page.locator('.usuarios-table tbody tr').filter({ hasText: email });
  await expect(row).toHaveCount(1);

  // Extract the ID from the first cell
  const idText = (await row.locator('td').first().textContent())?.trim() || '';
  const id = Number(idText);
  expect(Number.isFinite(id)).toBeTruthy();

  return { id, cedula, nombre, email };
}

function toDateTimeLocal(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

test.describe.configure({ mode: 'serial' });

test('E2E UI: CRUD Usuarios, Perfiles, Actividades, Dispositivos y Reporte PDF', async ({ page, context, baseURL }) => {
  // Go to app
  await page.goto(baseURL || 'http://localhost:4200');

  // Create a user to use across tabs
  const user = await createUsuario(page);

  // Edit user
  const userRow = page.locator('.usuarios-table tbody tr').filter({ hasText: user.email });
  await userRow.getByRole('button', { name: 'Editar' }).click();
  const nuevoNombre = user.nombre + ' Editado';
  await userRow.locator('input.edit-input').nth(1).fill(nuevoNombre); // nombre input in edit mode
  await userRow.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Usuario actualizado')).toBeVisible();
  await expect(userRow).toContainText(nuevoNombre);

  // Perfiles CRUD
  await page.getByRole('button', { name: 'Perfiles' }).click();
  await page.waitForSelector('text=Gestión de Perfiles');

  await page.fill('#usuario_id', String(user.id));
  await page.fill('#objetivo', 'Bajar peso');
  await page.selectOption('#sexo', 'otro');
  await page.fill('#altura', '175');
  await page.selectOption('#estado', 'activo');
  await page.getByRole('button', { name: 'Crear Perfil' }).click();
  await expect(page.getByText('Perfil creado')).toBeVisible();
  await expect(page.locator('.usuarios-table')).toBeVisible();
  const perfilRow = page.locator('.usuarios-table tbody tr').filter({ hasText: String(user.id) });
  await expect(perfilRow).toHaveCount(1);

  // Edit perfil
  await perfilRow.getByRole('button', { name: 'Editar' }).click();
  await perfilRow.locator('input.edit-input').first().fill(String(user.id)); // usuario_id stays same
  // objetivo field is next edit input with text
  await perfilRow.locator('input.edit-input').nth(1).fill('Ganar masa');
  await perfilRow.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Perfil actualizado')).toBeVisible();
  await expect(perfilRow).toContainText('Ganar masa');

  // Actividades CRUD
  await page.getByRole('button', { name: 'Actividades' }).click();
  await page.waitForSelector('text=Registro de Actividades');

  await page.fill('#act_usuario_id', String(user.id));
  await page.fill('#tipo', 'Correr');
  const start = new Date();
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  await page.fill('#hora_inicio', toDateTimeLocal(start));
  await page.fill('#hora_fin', toDateTimeLocal(end));
  await page.getByRole('button', { name: 'Crear Actividad' }).click();
  await expect(page.getByText('Actividad creada')).toBeVisible();
  const actRow = page.locator('.usuarios-table tbody tr').filter({ hasText: 'Correr' });
  await expect(actRow).toHaveCount(1);

  // Edit actividad
  await actRow.getByRole('button', { name: 'Editar' }).click();
  await actRow.locator('input.edit-input').nth(1).fill('Caminar');
  await actRow.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Actividad actualizada')).toBeVisible();
  await expect(actRow).toContainText('Caminar');

  // Dispositivos CRUD
  await page.getByRole('button', { name: 'Dispositivos' }).click();
  await page.waitForSelector('text=Dispositivos Conectados');

  const serial1 = `E2E-${Date.now()}`;
  await page.fill('#disp_usuario_id', String(user.id));
  await page.fill('#serial', serial1);
  await page.fill('#marca', 'TestBrand');
  await page.fill('#modelo', 'ModelX');
  const fechaVinc = new Date();
  const fYYYY = fechaVinc.getFullYear();
  const fMM = String(fechaVinc.getMonth() + 1).padStart(2, '0');
  const fDD = String(fechaVinc.getDate()).padStart(2, '0');
  await page.fill('#fecha_vinculacion', `${fYYYY}-${fMM}-${fDD}`);
  await page.getByRole('button', { name: 'Crear Dispositivo' }).click();
  await expect(page.getByText('Dispositivo creado')).toBeVisible();
  const dispRow = page.locator('.usuarios-table tbody tr').filter({ hasText: serial1 });
  await expect(dispRow).toHaveCount(1);

  // Edit dispositivo (change serial)
  await dispRow.getByRole('button', { name: 'Editar' }).click();
  const serial2 = serial1 + '-2';
  await dispRow.locator('input.edit-input').nth(1).fill(serial2);
  await dispRow.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Dispositivo actualizado')).toBeVisible();
  await expect(dispRow).toContainText(serial2);

  // Reporte PDF download
  await page.getByRole('button', { name: 'Reportes' }).click();
  await page.waitForSelector('text=Generación de Reportes');

  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Generar Reporte PDF' }).click(),
  ]);
  const suggested = download.suggestedFilename();
  expect(suggested).toContain('reporte_vitaltrack');
  const path = await download.path();
  expect(path).not.toBeNull();
});
