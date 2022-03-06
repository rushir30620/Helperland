import {db} from "../models/index";
import { User, UserModelAttributes } from "../models/user";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { UserAddress } from "../models/useraddress";
import { Rating } from "../models/rating";

export class CustomerPageRepository{

    //////////////////////////////// 5.1 Dashboard APIs ///////////////////////////////////////

    public async getServiceRequest(userId: number): Promise<ServiceRequest[] | null>{
        return db.ServiceRequest.findAll({ where: {UserId: userId, Status: [1,2]}});
    }

    public async getServiceAddress(addressId: number): Promise<ServiceRequestAddress | null> {
        return db.ServiceRequestAddress.findOne({ where: {ServiceRequestId: addressId}});
    }

    public async getServiceRequestById(serviceRequestId: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: {ServiceRequestId: serviceRequestId}});
    }

    public async rescheduleTimeandDate(serviceRequest: ServiceRequest, serviceRequestId: number): Promise<[number, ServiceRequest[]]> {
        return db.ServiceRequest.update(serviceRequest, { where: { ServiceRequestId: serviceRequestId }});
    }


    //////////////////////////////// 5.2 Service History APIs ///////////////////////////////////////

    public async getServiceHistory(userId: number): Promise<ServiceRequest[] | null>{
        return db.ServiceRequest.findAll({ where: {UserId: userId, Status: [3,4]}});
    }

    public async rateSP(rating: {[key: number | string ]: Rating}): Promise<Rating>{
        return db.Rating.create(rating);
    }

    public async getUserWithId(userId: number): Promise<User | null> {
        return db.Users.findOne({where:{id:userId}});
    }


    //////////////////////////////// 5.4 My Settings APIs ///////////////////////////////////////

    public async getUserDetailById(userId:number):Promise<User | null>{
        return db.Users.findOne({where:{id:userId, UserTypeId:4}});
    }

    public async updateMyDetails(user: User, userId: number): Promise<[number, User[]]>{
        return db.Users.update(user, { where: {id: userId}});
    }

    public async getUserAddressesById(userId:number):Promise<UserAddress[]| null>{
        return db.UserAddress.findAll({where:{UserId:userId, IsDeleted:false}});
    }

    public async updateMyAddresses(userAddress: UserAddress, addressId: number): Promise<[number, UserAddress[]]>{
        return db.UserAddress.update(userAddress, { where: {AddressId: addressId}});
    }

    public async addNewAddress(userAddress: {[key: number|string]:UserAddress}): Promise<UserAddress>{
        return db.UserAddress.create(userAddress);
    }

    public async deleteUserAddress(addressId:number, userId:number){
        return db.UserAddress.update({IsDeleted:true},{where:{AddressId:addressId, UserId:userId}});
    }

    public async getUserWithEmail(userEmail:string): Promise<User | null>{
        return db.Users.findOne({where: {email: userEmail}}); 
    }

    public async changePassword(password: string, userId: number): Promise<[number, User[]]>{
        return db.Users.update({ password: password }, { where: { id: userId }});
    }

    public async changePassById(userId:number): Promise<User | null>{
        return db.Users.findOne({ where: { id: userId }});
    }
}