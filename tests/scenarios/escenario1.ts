import { Page } from "playwright";
import { loginToOrangeHRM } from "../../utils/orangeHRMUtils";


export async function testLogin(page: Page, username: string, password: string) {
  await loginToOrangeHRM(page, username, password);
}
