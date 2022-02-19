import { User } from "../models/user";
import { UserRepository } from "./user.repository";

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
}