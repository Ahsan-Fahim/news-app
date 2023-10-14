import { prisma, Role, RoleCode } from './../../../database';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export default Role;
export const RoleEnum = RoleCode;

export const RoleModel = prisma.role;
