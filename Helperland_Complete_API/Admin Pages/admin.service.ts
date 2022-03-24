import { User } from "../models/user";
import { AdminRepository } from "./admin.repository";
import { ServiceRequest } from "../models/servicerequest";
import moment from "moment";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { editServiceDetail } from "./rescheduleTypes";

export class AdminService {
    public constructor(private readonly adminRepository: AdminRepository){
        this.adminRepository = adminRepository;
    };

/////////////////////////////////////////// 7.1 Service Requets API //////////////////////////////////////////////////


    public async getAllServiceRequests():Promise<ServiceRequest[]> {
        return this.adminRepository.getAllServiceRequests();
    };

    public async getCustomerDetail(custId:number):Promise<User | null>{
        return this.adminRepository.getCustomerDetail(custId);
    };

    public async getSPDetail(spId:number): Promise<User | null> {
        return this.adminRepository.getSPDetail(spId);
    }

    public async getSRAddress(srId:number): Promise<ServiceRequestAddress | null> {
        return this.adminRepository.getSRAddress(srId);
    }

    public async getServiceRequest(serviceRequestId: number): Promise<ServiceRequest | null> {
        return this.adminRepository.getServiceRequest(serviceRequestId);
    }

    public async getServiceRequestByZipcode(postalCode: string): Promise<ServiceRequest | null> {
        return this.adminRepository.getServiceRequestByZipcode(postalCode);
    }

    public async getAllSPRequest(helperId: number): Promise<ServiceRequest[] | null> {
        return this.adminRepository.getAllSPRequest(helperId);
    };

    public async rescheduleDateandTime(sr: editServiceDetail, serviceId: number): Promise<[number, ServiceRequest[]]> {
        return this.adminRepository.rescheduleDateandTime(sr, serviceId);
    }

    public async getSRaddress(srId:number):Promise<ServiceRequestAddress| null>{
        return this.adminRepository.getSRAddress(srId);
    }

    public async updateMyAddress(address: editServiceDetail, addressId:number){
        return this.adminRepository.updateMyAddress(address, addressId);
    }

    public async getServiceRequests(srId : number): Promise<ServiceRequest[]> {
        return this.adminRepository.getServiceRequests(srId)
    }

    public compareTwoDates(date: string){
        const date1 = new Date(date.split("-").reverse().join("-"));
        const date2 = new Date(moment(new Date()).format("YYYY-MM-DD"));
        if (date1 > date2) {
            return true;
        } else {
            return false;
        }
    }

    public mailData(userEmail: string, serviceRequestId: number): typeof mailOptions {
        const mailOptions = {
          from: process.env.USER,
          to: userEmail,
          subject: "Service Request Rescheduled",
          html: `<h3>A service request ${serviceRequestId} has been rescheduled. Please check it out.</h3>`
        };
        return mailOptions;
    }


////////////////////////////////////////////// 7.2 Filters API ///////////////////////////////////////////////

    public async searchByServiceId(serviceId:number):Promise<ServiceRequest[]>{
        return this.adminRepository.searchByServiceId(serviceId);
    }

    public async searchByPostalcode(postalCode:string):Promise<ServiceRequest[]>{
        return this.adminRepository.searchByPostalcode(postalCode);
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return this.adminRepository.getUserByEmail(email);
    }

    public async getUserByName(name1: string, name2: string): Promise<User | null> {
        return  this.adminRepository.getUserByName(name1, name2);
    }

    public async searchByEmailAndNameWithUserID(userId:number):Promise<ServiceRequest[]>{
        return this.adminRepository.searchByEmailAndNameWithUserID(userId);
    }

    public async getServiceByStatus(status: number): Promise<ServiceRequest | null> {
        return this.adminRepository.getServiceByStatus(status);
    }

    public async searchByStatus(status:number):Promise<ServiceRequest[]>{
        return this.adminRepository.searchByStatus(status);
    }

    public async getServiceByHasIssue(hasIssue: boolean): Promise<ServiceRequest | null> {
        return this.adminRepository.getServiceByHasIssue(hasIssue);
    }

    public async searchByHasIssue(hasIssue: boolean):Promise<ServiceRequest[]>{
        return this.adminRepository.searchByHasIssue(hasIssue);
    }

    public async getServiceByDate(date: Date): Promise<ServiceRequest | null> {
        return this.adminRepository.getServiceByDate(date);
    }

    public async searchByDate(date: Date):Promise<ServiceRequest[]>{
        return this.adminRepository.searchByDate(date);
    }

    public async requestData(request:ServiceRequest[]):Promise<Object[]>{
        let serviceDetail : Object[] = [];
        for(let sr in request){
            const user = await this.adminRepository.getCustomerDetail(request[sr].UserId);
            const address = await this.adminRepository.getSRAddress(request[sr].ServiceRequestId);
            const helper = await this.adminRepository.getSPDetail(request[sr].ServiceProviderId);
            const startTime = request[sr].ServiceStartTime.toString().split(":")!;
            const endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + request[sr].ServiceHours! + request[sr].ExtraHours!).toString().split(".");
            if (endTime[1]) {
                endTime[1] = (parseInt(endTime[1]) * 6).toString();
            }
            else {
                endTime[1] = "00";
            }

            if(user && address && helper){
                serviceDetail.push({
                    ServiceId: request[sr].ServiceRequestId,
                    ServiceDate: request[sr].ServiceStartDate.toString().split("-").reverse().join("-"),
                    ServiceTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1],
                    Customer: user.firstName + " " + user.lastName,
                    serviceAddress: {
                        Street: address.Addressline1,
                        HouseNumber: address.Addressline2,
                        City: address.City,
                        PostalCode: address.PostalCode
                    },
                    ServiceProvider: helper.firstName + " " + helper.lastName,
                    GrossAmount: request[sr].TotalCost + " €",
                    NetAmount: request[sr].TotalCost + " €",
                    Discount: request[sr].Discount,
                    Status: request[sr].Status
                })
            }
        }
        return serviceDetail;
    }

    public convertStringtoDate(date:any){
        const updateddate = date.toString().split('-').reverse().join('-');
        const convertedDate = new Date(updateddate);
        return convertedDate;
    }


/////////////////////////////////////////// 7.3 User Management API //////////////////////////////////////////////////

public async getAllUsers():Promise<User[]> {
    return this.adminRepository.getAllUsers();
};

public async getUserManageDetail(usId: number): Promise<User | null> {
    return this.adminRepository.getUserManageDetail(usId);
}

public async userManageData(users:User[]):Promise<Object[]>{
    let userDetail : Object[] = [];
    for(let us in users){
        const user = await this.adminRepository.getUserManageDetail(users[us].id);
        let userType : string | undefined;
        if(user?.userTypeId === 3){
            userType = "Service Provider"
        }
        else{
            userType = "Customer"
        }
        if(user){
            userDetail.push({
                UserName: user.firstName + " " + user.lastName,
                DateOfRegistration: user.createdAt.toString().split("-").reverse().join("-"),
                UserType: userType,
                Phone: user.mobile,
                PostalCode: user.zipCode,
                Status: user.isRegisteredUser
            })
        }
    }
    return userDetail;
}

}