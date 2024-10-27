import { Page } from "playwright";
export async function filterUsersByRole(page:Page,role: string) {
    
    await page.evaluate(() => {
      document.documentElement.requestFullscreen();
    });
  
  
    try {
      await page.goto(
        "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
      );      
      await page.fill('input[name="username"]', "Admin");
      await page.fill('input[name="password"]', "admin123");
      await page.click('button[type="submit"]');
      
      await page.goto(
        "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers"
      );
      
      await page.waitForSelector(".oxd-select-text--after", { state: "visible" });
      await page.click(".oxd-select-text--after");
  
      await page.click(`div.oxd-select-option:has(span:has-text("${role}"))`);
  
      console.log(`Rol "${role}" seleccionado exitosamente.`);
      await page.click('button[type="submit"]');
      console.log("Filtro aplicado exitosamente.");
    } catch (error) {
      console.error("Error durante la ejecución:", error);
    } finally {
      
    }
  }
  