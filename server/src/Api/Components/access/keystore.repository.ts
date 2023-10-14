import { KeystoreModel } from './Keystore';
import User from './User';

export default class KeystoreRepo {

    public static findforKey(client: User["id"], key: string): Promise<any | null> {
        return KeystoreModel.findFirst({
            where: {
                clientId: client, primaryKey: key, status: 'PUBLIC'
            }
        })
    }

    public static remove(id: User["id"]): Promise<any | null> {
        return KeystoreModel.delete({ where: { id } });
    }

    public static find(
        client: User["id"],
        primaryKey: string,
        secondaryKey: string,
    ): Promise<any | null> {
        return KeystoreModel.findFirst({
            where: {
                clientId: client,
                primaryKey: primaryKey,
                secondaryKey: secondaryKey,
            }
        })
    }

    public static async create(
        client: User["id"],
        primaryKey: string,
        secondaryKey: string,
    ): Promise<any> {
        const keystore = await KeystoreModel.create({
            data: {
                clientId: client,
                primaryKey: primaryKey,
                secondaryKey: secondaryKey
            }
        });
        return keystore;
    }
}
