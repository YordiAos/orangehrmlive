import { Page } from 'playwright';
import { validateUsersByRole } from '../../utils/orangeHRMUtils';


export async function testValidateUsers(page: Page, role: string) {
  await validateUsersByRole(page, role);
}
