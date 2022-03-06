import { Rating } from "../models/rating";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { User } from "../models/user";
import { UserAddress } from "../models/useraddress";
import { CustomerPageRepository } from "./cutomerPages.repository";

export class CustomerPageService {
    public constructor(private readonly customerPageRepository: CustomerPageRepository){
        this.customerPageRepository = customerPageRepository;
    }

    //////////////////////////////// 5.1 Dashboard APIs ///////////////////////////////////////

    public async getServiceRequest(userId: number): Promise<ServiceRequest[]  | null>{
        return this.customerPageRepository.getServiceRequest(userId);
    }

    public async getServiceAddress(addressId: number): Promise<ServiceRequestAddress | null> {
        return this.customerPageRepository.getServiceAddress(addressId);
    }

    public async getServiceRequestById(serviceRequestId: number): Promise<ServiceRequest | null> {
        return this.customerPageRepository.getServiceRequestById(serviceRequestId);
    }

    public async rescheduleTimeandDate(serviceRequest: ServiceRequest, serviceRequestId: number): Promise<[number, ServiceRequest[]]> {
        return this.customerPageRepository.rescheduleTimeandDate(serviceRequest, serviceRequestId);
    }


    //////////////////////////////// 5.2 Service History APIs ///////////////////////////////////////

    public async getServiceHistory(userId: number): Promise<ServiceRequest[] | null>{
        return this.customerPageRepository.getServiceHistory(userId);
    }

    public async rateSP(rating: {[key: number | string ]: Rating}): Promise<Rating>{
        return this.customerPageRepository.rateSP(rating);
    }

    public async getUserWithId(userId: number): Promise<User | null> {
        return this.customerPageRepository.getUserWithId(userId);
    }


    //////////////////////////////// 5.4 My Settings APIs ///////////////////////////////////////

    public async getUserDetailById(userId:number):Promise<User | null>{
        return this.customerPageRepository.getUserDetailById(userId);
    }

    public async updateMyDetails(user: User, userId: number): Promise<[number, User[]]>{
        return this.customerPageRepository.updateMyDetails(user, userId);
    }

    public async getUserAddressesById(userId:number):Promise<UserAddress[]| null>{
        return this.customerPageRepository.getUserAddressesById(userId);
    }

    public async updateMyAddresses(userAddress: UserAddress, addressId: number): Promise<[number, UserAddress[]]>{
        return this.customerPageRepository.updateMyAddresses(userAddress, addressId);
    }

    public async addNewAddress(userAddress: {[key: number | string]: UserAddress}): Promise<UserAddress> {
        return this.customerPageRepository.addNewAddress(userAddress);
    }

    public async deleteUserAddress(addressId:string, userId:string){
        return this.customerPageRepository.deleteUserAddress(parseInt(addressId), parseInt(userId));
    }

    public async getUserWithEmail(userEmail: string): Promise<User | null> {
        return this.customerPageRepository.getUserWithEmail(userEmail);
    }

    public async changePassById( userId : number ): Promise<User | null> {
        return this.customerPageRepository.changePassById(userId);
    }

    public async changePassword(password:string, userId:number): Promise<[number, User[]]>{
        return this.customerPageRepository.changePassword(password, userId);
    }
}