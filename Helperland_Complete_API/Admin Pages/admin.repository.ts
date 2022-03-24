import { db } from "../models/index";
import { User } from "../models/user";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { editServiceDetail } from "../Admin Pages/rescheduleTypes";


export class AdminRepository {

    /////////////////////////////////////////// 7.1 Service Requests API //////////////////////////////////////////////////

    public async getAllServiceRequests(): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll();
    }

    public async getCustomerDetail(custId: number): Promise<User | null> {
        return db.Users.findOne({ where: { id: custId, userTypeId: 4 } });
    }

    public async getSPDetail(spId: number): Promise<User | null> {
        return db.Users.findOne({ where: { id: spId, userTypeId: 3 } });
    }

    public async getSRAddress(srId: number): Promise<ServiceRequestAddress | null> {
        return db.ServiceRequestAddress.findOne({ where: { ServiceRequestId: srId } });
    }

    public async getServiceRequest(serviceRequestId: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: { ServiceRequestId: serviceRequestId }, include: ["ServiceRequestAddress", "ExtraService"] });
    }

    public async getServiceRequestByZipcode(postalCode: string): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: { ZipCode: postalCode } });
    }

    public async getAllSPRequest(helperId: number): Promise<ServiceRequest[] | null> {
        return db.ServiceRequest.findAll({
            where: { ServiceProviderId: helperId },
        });
    }

    // public async rescheduleDateandTime(date: Date,time: string,serviceId: number): Promise<[number, ServiceRequest[]]> {
    //     return db.ServiceRequest.update(
    //       { ServiceStartDate: date, ServiceStartTime: time },
    //       { where: { ServiceRequestId: serviceId } }
    //     );
    // }

    public async rescheduleDateandTime(sr: editServiceDetail, serviceId: number): Promise<[number, ServiceRequest[]]> {
        return db.ServiceRequest.update(
            { ServiceStartDate: new Date(sr.ServiceStartDate.toString().split("-").reverse().join('-')), ServiceStartTime: sr.ServiceStartTime, Comments: sr.Comments + sr.Note },
            { where: { ServiceRequestId: serviceId } }
        );
    }

    // public async updateMyAddress(address: ServiceRequestAddress, addressId:number){
    //     return db.ServiceRequestAddress.update(address, { where: {ServiceRequestId: addressId}});
    // }

    public async updateMyAddress(address: editServiceDetail, addressId: number) {
        return db.ServiceRequestAddress.update({
            Addressline1: address.serviceAddress.StreetName,
            Addressline2: address.serviceAddress.HouseNumber,
            PostalCode: address.serviceAddress.PostalCode,
            City: address.serviceAddress.City
        }, { where: { ServiceRequestId: addressId } });
    }

    public async getServiceRequests(srId : number): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({where: { ServiceRequestId: srId }});
    }


    /////////////////////////////////////////// 7.2 Filters API //////////////////////////////////////////////////

    public async searchByServiceId(serviceId: number): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: { ServiceRequestId: serviceId } });
    }

    public async searchByPostalcode(postalCode: string): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: { ZipCode: postalCode } });
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return db.Users.findOne({ where: { email: email } });
    }

    public async getUserByName(name1: string, name2: string): Promise<User | null> {
        return db.Users.findOne({ where: { firstName: name1, lastName: name2 } });
    }

    public async searchByEmailAndNameWithUserID(userId: number): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: { UserId: userId } });
    }

    public async getServiceByStatus(status: number): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: { Status: status } });
    }

    public async searchByStatus(status: number): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: { Status: status } });
    }

    public async getServiceByHasIssue(hasIssue: boolean): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: { HasIssue: hasIssue } });
    }

    public async searchByHasIssue(hasIssue: boolean): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: { HasIssue: hasIssue } });
    }

    public async getServiceByDate(date: Date): Promise<ServiceRequest | null> {
        return db.ServiceRequest.findOne({ where: { ServiceStartDate: date } });
    }

    public async searchByDate(date: Date): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: { ServiceStartDate: date } });
    }


    /////////////////////////////////////////// 7.3 User Management API //////////////////////////////////////////////////

    public async getAllUsers(): Promise<User[]> {
        return db.Users.findAll();
    }

    public async getUserManageDetail(usId: number): Promise<User | null> {
        return db.Users.findOne({ where: { id: usId, userTypeId: [3,4] } });
    }


}