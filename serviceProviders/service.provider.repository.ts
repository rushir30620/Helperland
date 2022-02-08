import { db } from "../models/index";
import { User } from "../models/user";

export class ServiceProviderRepository{
    public async createServiceProvider(users: {[key: number | string ]: User}): Promise<User> {
        return db.Users.create(users);
    }

    public async loginServiceProvider(userEmail: string): Promise<User | null>{
        return db.Users.findOne({ where: {email: userEmail}});
    }
}