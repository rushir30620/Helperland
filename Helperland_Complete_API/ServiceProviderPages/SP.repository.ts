import {db} from "../models/index";
import { User } from "../models/user";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { Rating } from "../models/rating";
import { UserAddress } from "../models/useraddress";
import { stat } from "fs";
import { FavoriteAndBlocked } from "../models/favoriteandblocked";
import { updateSPDetail } from "./types";

export class SPPageRepository{

    //////////////////////////// 6.1 Accept Service Request API /////////////////////////

    public async getServiceRequest(srId: number): Promise<ServiceRequest[] | null> {
        return db.ServiceRequest.findAll({ where: {ServiceRequestId: srId}, include: [ "CustomerRequest" , "ServiceRequestAddress"]});
    }

    public async getCustomer(userId: number): Promise<User | null> {
        return db.Users.findOne({ where: {id: userId}});
    }

    public async getServiceAddress(addressId: number): Promise<ServiceRequestAddress | null> {
        return db.ServiceRequestAddress.findOne({ where: {ServiceRequestId: addressId}, include: ["ServiceRequest"]});
    }

    public async getServiceRequestById(serviceRequestId: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: {ServiceRequestId: serviceRequestId, Status: 1}, include: ["ServiceRequestAddress", "ExtraService"]});
    }

    public async getAcceptedServiceRequest(serviceRequestId: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: {ServiceRequestId: serviceRequestId, Status: 2}, include: ["ServiceRequestAddress", "ExtraService"]});
    }

    public async getServiceProvider(userId:number):Promise<User[]|null>{
        return db.Users.findAll({where:{id: userId, userTypeId:3}})
    }

    public async getAllServiceRequestsOfHelper(helperId:number):Promise<ServiceRequest[] | null>{
        return db.ServiceRequest.findAll({where:{ServiceProviderId:helperId, Status:2}});
    }

    public async getServiceRequestByZipcode(zipcode:string):Promise<ServiceRequest[] | null>{
        return db.ServiceRequest.findAll({where:{ZipCode:"361210", Status:1}});
    }

    public async getBlockedUserById(spId:number):Promise<FavoriteAndBlocked[]|null>{
        return db.FavoriteAndBlocked.findAll({where:{UserId:spId, IsBlocked:true}});
    }


    //////////////////////////// 6.2 Upcoming Service API /////////////////////////

    public async getUpcomingService(spId: number): Promise<ServiceRequest[] | null> {
        return db.ServiceRequest.findAll({where: { ServiceProviderId: spId, Status:2 }});
    }

    public async getServiceRequestwithId(serviceId: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: { ServiceRequestId: serviceId, Status:2 }});
    }

    public async completeService(serviceId: number, spId: number): Promise<[number, ServiceRequest[]]>{
        return db.ServiceRequest.update({ Status:3, ModifiedBy: spId }, { where: { ServiceRequestId: serviceId }});
    }



    //////////////////////////// 6.4 Service history API /////////////////////////

    public async getSPServiceHistory(spId: number): Promise<ServiceRequest[] | null>{
        return db.ServiceRequest.findAll({ where: {ServiceProviderId: spId, Status:3}, include:["ServiceRequestAddress", "CustomerRequest"]});
    }

    public async getServiceRequestDetailById(srId: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({where: { ServiceRequestId: srId }, include: ["ServiceRequestAddress", "ExtraService"],});
    }

    public async getSPRatings(spId:number):Promise<Rating[] | null> {
        return db.Rating.findAll({where:{RatingTo:spId}, include:["SPRating"]})
    }


    //////////////////////////// 6.6 Block customer API /////////////////////////

    public async getBlockedUser(spId:number, targetId:number):Promise<FavoriteAndBlocked | null>{
        return db.FavoriteAndBlocked.findOne({where:{UserId:spId, TargetUserId:targetId}});
    }

    public async blockUser(spId:number, targetId:number):Promise<[number,FavoriteAndBlocked[]]>{
        return db.FavoriteAndBlocked.update({IsBlocked:true},{where:{UserId:spId, TargetUserId:targetId}});
    }

    public async unBlockUser(spId:number, targetId:number):Promise<[number,FavoriteAndBlocked[]]>{
        return db.FavoriteAndBlocked.update({IsBlocked:false},{where:{UserId:spId, TargetUserId:targetId}});
    }

    public async createBlockUser(blockedUser:{[key: number|string]:FavoriteAndBlocked}):Promise<FavoriteAndBlocked>{
        return db.FavoriteAndBlocked.create(blockedUser);
    }
    


    //////////////////////////// 6.7 My settings API /////////////////////////

    public async getSPDetailById(userId:number):Promise<User | null>{
        return db.Users.findOne({where:{id:userId, userTypeId:3}, include: ["UserAddress"]});
    }

    public async getSPaddress(userId:number):Promise<UserAddress| null>{
        return db.UserAddress.findOne({where:{UserId:userId, IsDeleted:false}, include: ["Users"]});
    }
    
    public async updateMyDetails(sp: updateSPDetail, userId: number): Promise<[number, User[]]>{
        return db.Users.update({
            firstName:sp.firstName,
            lastName:sp.lastName,
            mobile:sp.mobile,
            dateOfBirth:sp.dateOfBirth,
            nationalityId:sp.nationalityId,
            gender:sp.gender,
            ModifiedBy:userId,
            zipCode:sp.userAddress.PostalCode
        }, { where: {id: userId}});
    }

    public async updateAddMyAddress(address: updateSPDetail, addressId:number){
        return db.UserAddress.update({
            Addressline1:address.userAddress.StreetName,
            Addressline2:address.userAddress.HouseNumber,
            PostalCode:address.userAddress.PostalCode,
            City:address.userAddress.City
        },{ where: {AddressId: addressId}});
    }

    public async createNewAddress(userId:number, userAddress: updateSPDetail){
        return db.UserAddress.create({
            Addressline1:userAddress.userAddress.StreetName,
            Addressline2:userAddress.userAddress.HouseNumber,
            PostalCode:userAddress.userAddress.PostalCode,
            City:userAddress.userAddress.City,
            IsDefault:true,
            IsDeleted:false,
            UserId:userId
        });
    }

    public async changeSPPassword(password: string, userId: number): Promise<[number, User[]]>{
        return db.Users.update({ password: password }, { where: { id: userId }});
    }

    public async changePassById(userId:number): Promise<User | null>{
        return db.Users.findOne({ where: { id: userId }});
    }
}