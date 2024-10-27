import { Page } from 'playwright';

export async function loginToOrangeHRM(page: Page, username: string, password: string) {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000);
  
  const isLoginSuccessful = await page.isVisible(".oxd-topbar-header-title");
  if (isLoginSuccessful) {
    console.log("Login exitoso");
  } else {
    console.log("Login fallido");
  }
  
}

export async function validateUsersByRole(page: Page, role: string) {
  try {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
    console.log(`Navegado a la sección de usuarios para el rol: ${role}`);
    await page.waitForSelector('.oxd-select-text--after', { state: 'visible' });
    await page.click('.oxd-select-text--after');
    
    await page.click(`div.oxd-select-option:has(span:has-text("${role}"))`);
    console.log(`Rol "${role}" seleccionado en el filtro.`);
    await page.click('button[type="submit"]');
    console.log(`Filtro aplicado para el rol "${role}".`);
    
    await page.waitForTimeout(2000);
    const users = await page.$$('.oxd-table-row');
    let isFirstIteration = true;
    for (const user of users) {
      if (isFirstIteration) {
        isFirstIteration = false;
        continue;
      }    
      const editButton = await user.$('button:has(i.bi-pencil-fill)');
      const deleteButton = await user.$('button:has(i.bi-trash)');
      
      if (!editButton || !deleteButton) {
        console.error(`Error: Un usuario no tiene opciones de "editar" o "eliminar" disponibles.`);
      } else {
        console.log(`Usuario con opciones "editar" y "eliminar" encontradas correctamente.`);
      }
    }
    
    const errorMessage = await page.$('oxd-layout-context');
    if (errorMessage) {
      const errorText = await errorMessage.textContent();
      console.error(`Mensaje de error encontrado.`);
    } else {
      console.log("No se encontraron mensajes de error.");
    }

  } catch (error) {
    console.error("Error durante la validación del filtro:", error);
  }
}

export async function addUser(page: Page, userRole: string, nameEmployee:string,status: string, user: string,clave:string) {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
  await page.click('button:has-text("Add")');
  await page.waitForSelector(".oxd-select-text--after", { state: "visible" });
  
  await page.locator('.oxd-select-text--after').nth(0).click();
  await page.click(`div.oxd-select-option:has(span:has-text("${userRole}"))`);
  
  await page.fill('input[placeholder="Type for hints..."]', "Jo");
  await page.waitForTimeout(3000);
  
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.locator('.oxd-select-text--after').nth(1).click();
  await page.click(`div.oxd-select-option:has(span:has-text("${status}"))`);

  await page.locator('.oxd-input.oxd-input').nth(1).click();
  await page.locator('.oxd-input.oxd-input').nth(1).fill(`${user}`);

  await page.locator('.oxd-input.oxd-input').nth(2).click();
  await page.locator('.oxd-input.oxd-input').nth(2).fill(`${clave}`);

  await page.locator('.oxd-input.oxd-input').nth(3).click();
  await page.locator('.oxd-input.oxd-input').nth(3).fill(`${clave}`);

  await page.click('button[type="submit"]');
  
  await waitForSuccessMessage(page);
}

async function waitForSuccessMessage(page: Page) {
  const timeout = 10000;
  const interval = 1500;
  const startTime = Date.now(); 

  while (Date.now() - startTime < timeout) {
    const isVisible = await page.isVisible('text="Success"');

    if (isVisible) {
      console.log("¡Usuario creado!");
      return true;
    }
    await page.waitForTimeout(interval);
  }

  console.log("El mensaje de éxito no fue encontrado en el tiempo permitido.");
  return false; 
}


export function generarCadenaAleatoria(longitud: number): string {
  return Array.from(
    { length: longitud },
    () => Math.random().toString(36).charAt(2) 
  ).join("");
}
