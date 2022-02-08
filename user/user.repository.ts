import { db } from "../models/index";
import { User } from "../models/user";

export class UserRepository{
    public async createUsers(users: {[key: number | string ]: User}): Promise<User> {
        return db.Users.create(users);
    }

    public async loginUser(userEmail: string): Promise<User | null>{
        return db.Users.findOne({ where: {email: userEmail}});
    }
}