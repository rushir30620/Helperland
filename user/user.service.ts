import { User } from "../models/user";
import { UserRepository } from "./user.repository";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export class UserService {
    public constructor(private readonly userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async createUsers(users: {[key: number | string ]: User}): Promise<User>{
        return this.userRepository.createUsers(users);
    }

    public async loginUser(userEmail: string): Promise<User | null>{
        return this.userRepository.loginUser(userEmail);
    }

    // public isUserRegister(user: User){
    //     return user.isRegisteredUser;
    // }

    // public async comparePassword(originalPass:string,password:string):Promise<boolean>{
    //     const same = await bcrypt.compare(originalPass, password);
    //     return same;
    // }
    
    // public createToken(userEmail:string):string{
    //     const token = jwt.sign({userEmail},process.env.JWT_KEY!,{expiresIn:'2h'});
    //     return token;
    // }
}