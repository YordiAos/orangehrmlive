import { chromium, firefox, Browser } from "playwright";

import { testLogin } from "./scenarios/escenario1";
import { testValidateUsers } from "./scenarios/escenario2";
import { testAddUser } from "./scenarios/escenario3";
import { generarCadenaAleatoria } from "../utils/orangeHRMUtils";

async function createBrowser(browserType: 'chrome' | 'firefox'): Promise<Browser> {
  if (browserType === 'chrome') {
    return await chromium.launch({ headless: false });
  } else if (browserType === 'firefox') {
    return await firefox.launch({ headless: false });
  } else {
    throw new Error(`Browser type ${browserType} is not supported.`);
  }
}

async function run01TestLogin(browserType: 'chrome' | 'firefox', username: string, password: string) {
  const browser = await createBrowser(browserType);
  const page = await browser.newPage();
  await testLogin(page, username, password);  
  await browser.close();
}

async function run02TestFiltrosPorRol(browserType: 'chrome' | 'firefox', typeRol: string) {
  const browser = await createBrowser(browserType);
  const page = await browser.newPage();
  await testLogin(page, "Admin", "admin123");  
  await testValidateUsers(page, typeRol);
  await browser.close();
}

async function run03TestCreateUser(browserType: 'chrome' | 'firefox', typeRol: string, nameEmployee: string, status: string, user: string, clave: string) {
  const browser = await createBrowser(browserType);
  const page = await browser.newPage();
  
  await testLogin(page, "Admin", "admin123");  
  const cadenaUsuario = generarCadenaAleatoria(5);
  await testAddUser(page, typeRol, nameEmployee, status, cadenaUsuario + user, clave);
  await browser.close();
}

(async () => {
  const browsers: ('chrome' | 'firefox')[] = ['chrome', 'firefox']; 

  for (const browserType of browsers) {
    // Login exitoso y fallido
    await run01TestLogin(browserType, "admin", "admin123");
    await run01TestLogin(browserType, "admin", "adminxyz");
    
    // Validar usuarios por rol
    await run02TestFiltrosPorRol(browserType, "Admin");
    await run02TestFiltrosPorRol(browserType, "ESS");
    
    // Agregar un nuevo usuario
    await run03TestCreateUser(browserType, "Admin", "John A. Doe", "Enabled", "HappyTesting", "HappyTesting123");
  }
})();
