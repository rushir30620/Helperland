import { User } from "../models/user";
import { ServiceProviderRepository } from "./service.provider.repository";

export class ServiceProviderService {
    public constructor(private readonly serviceProviderRepository: ServiceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }

    public async createServiceProvider(users: {[key: number | string ]: User}): Promise<User>{
        return this.serviceProviderRepository.createServiceProvider(users);
    }

    public async loginServiceProvider(userEmail: string): Promise<User | null>{
        return this.serviceProviderRepository.loginServiceProvider(userEmail);
    }
}