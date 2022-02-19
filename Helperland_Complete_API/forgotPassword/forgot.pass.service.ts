import { User } from "../models/user";
import { forgotPassRepository } from "./forgot.pass.repository";

export class forgotPassService {
    public constructor(private readonly forgotPassRepository: forgotPassRepository){
        this.forgotPassRepository = forgotPassRepository;
    }

    public async forgotPass(userEmail: string): Promise<User | null> {
        return this.forgotPassRepository.forgotPass(userEmail);
    }

    public async forgotPassId( userId : number ): Promise<User | null> {
        return this.forgotPassRepository.forgotPassId(userId);
    }

    public async updateUser(password:string, userId:number): Promise<[number, User[]]>{
        return this.forgotPassRepository.updateUser(password, userId);
    }
}