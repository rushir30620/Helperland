import {db} from "../models/index";
import { ContactUS } from "../models/contactus";

export class ContactUsersRepository{
    public async getContactUsersById(contactUsId: number): Promise<ContactUS | null>{
        return db.ContactUS.findOne({ where: {id: contactUsId}});
    }

    public async getAllContactUsers(): Promise<ContactUS[]> {
        return db.ContactUS.findAll();
    }

    public async addContactUsers(contactUsers: {[key: number | string ]: ContactUS}): Promise<ContactUS> {
        return db.ContactUS.create(contactUsers);
    }

    public async deleteContactUser(contactUsId: number): Promise<number>{
        return db.ContactUS.destroy({ where: {id: contactUsId }});
    }
}