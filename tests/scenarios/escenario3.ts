import { Page } from "playwright";
import { addUser } from "../../utils/orangeHRMUtils";


export async function testAddUser(page: Page, userRole: string,nameEmployee:string, status:string,user:string,clave:string) {
  await addUser(page,userRole,nameEmployee,status,user,clave);

}
