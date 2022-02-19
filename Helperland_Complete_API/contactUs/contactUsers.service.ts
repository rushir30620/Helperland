import { ContactUS } from "../models/contactus";
import { ContactUsersRepository } from "../contactUs/contactUsers.repository";

export class ContactUsersService {
    public constructor(private readonly contactUsersRepository: ContactUsersRepository){
        this.contactUsersRepository = contactUsersRepository;
    }

    public async getAllContactUsers():Promise<ContactUS[]>{
        return this.contactUsersRepository.getAllContactUsers();
    }

    public async getContactUsersById(contactUsId: number): Promise<ContactUS | null>{
        return this.contactUsersRepository.getContactUsersById(contactUsId);
    }

    public async addContactUsers(contactUsers:{[key: number | string ]: ContactUS}): Promise<ContactUS> {
        return this.contactUsersRepository.addContactUsers(contactUsers);
    }

    public async deleteContactUser(contactUsId: number): Promise<number>{
        return this.contactUsersRepository.deleteContactUser(contactUsId);
    }
}