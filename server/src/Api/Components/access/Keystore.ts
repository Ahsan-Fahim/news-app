import { prisma, IPrisma } from '../../../database';

export const DOCUMENT_NAME = IPrisma.ModelName.Keystore;
export const COLLECTION_NAME = 'keystores';

export const KeystoreModel = prisma.keystore;
