import { db } from "../models/index";
import { User } from "../models/user";

export class forgotPassRepository{
    public async forgotPass(userEmail: string): Promise<User | null> {
        return db.Users.findOne({ where: { email: userEmail }});
    }

    public async forgotPassId(userId:number): Promise<User | null>{
        return db.Users.findOne({ where: { id: userId }});
    }

    public async updateUser(password:string, userId:number): Promise<[number, User[]]>{
        return db.Users.update({ password : password }, {where: { id: userId }});
    }
}