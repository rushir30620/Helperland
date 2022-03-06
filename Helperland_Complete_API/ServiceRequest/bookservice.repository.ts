import { db } from "../models/index";
import { User } from "../models/user";
import { UserAddress } from "../models/useraddress";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { ServiceRequestExtra } from "../models/servicerequestextra";
import { FavoriteAndBlocked } from "../models/favoriteandblocked";

export class ServiceBookRepository {
    public async createService(servicerequest: { [key: number|string] : ServiceRequest }): Promise<ServiceRequest>{
        return db.ServiceRequest.create(servicerequest);
    }

    public async createScheduleRequestWithAddress(servicerequest:{[key: number|string]:ServiceRequest}): Promise<ServiceRequest>{
        return db.ServiceRequest.create(servicerequest,{include:['ServiceRequestAddress', 'ExtraService']});
    }

    public async addNewAddress(userAddress: {[key: number|string]:UserAddress}): Promise<UserAddress>{
        return db.UserAddress.create(userAddress);
    }

    public async getAllServiceProvider(): Promise<User[]>{
        return db.Users.findAll({ where: { userTypeId : 3 }});
    }

    public async getUserWithEmail(userEmail:string): Promise<User | null>{
        return db.Users.findOne({where: {email: userEmail}}); 
    }

    public async getFavoriteAndBlockedSP(userId:number): Promise<FavoriteAndBlocked[]>{
        return db.FavoriteAndBlocked.findAll({where:{UserId:userId}});
    }

    public async getUserWithId(userId: number[]): Promise<User[]> {
        return db.Users.findAll({where:{id:userId}});
    }

    public async getUserWithAddress(userId:number): Promise<UserAddress[]> {
        return db.UserAddress.findAll({where:{UserId:userId}});
    }

    public async getServiceProvider(zipCode:string): Promise<User[]> {
        return db.Users.findAll({where:{userTypeId:3, zipCode:zipCode}});
    }

}