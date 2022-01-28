import {db} from "../models/index";
import { ContactUS } from "../models/contactus";

export class ContactUsersRepository{
    public async getContactUsersById(contactUsId: number): Promise<ContactUS | null>{
        return db.ContactUSs.findOne({ where: {id: contactUsId}});
    }

    public async getAllContactUsers(): Promise<ContactUS[]> {
        return db.ContactUSs.findAll();
    }

    public async addContactUsers(contactUsers: {[key: number | string ]: ContactUS}): Promise<ContactUS> {
        return db.ContactUSs.create(contactUsers);
    }

    public async deleteContactUser(contactUsId: number): Promise<number>{
        return db.ContactUSs.destroy({ where: {id: contactUsId }});
    }
}