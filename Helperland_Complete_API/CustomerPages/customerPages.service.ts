import { Rating } from "../models/rating";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { User } from "../models/user";
import { UserAddress } from "../models/useraddress";
import { CustomerPageRepository } from "./cutomerPages.repository";
import moment from "moment";

export class CustomerPageService {
    public constructor(private readonly customerPageRepository: CustomerPageRepository) {
        this.customerPageRepository = customerPageRepository;
    }

    //////////////////////////////// 5.1 Dashboard APIs ///////////////////////////////////////

    public async getServiceRequest(userId: number): Promise<ServiceRequest[] | null> {
        return this.customerPageRepository.getServiceRequest(userId);
    }

    public async getServiceAddress(addressId: number): Promise<ServiceRequestAddress | null> {
        return this.customerPageRepository.getServiceAddress(addressId);
    }

    public async getServiceRequestById(serviceRequestId: number): Promise<ServiceRequest | null> {
        return this.customerPageRepository.getServiceRequestById(serviceRequestId);
    }

    public async rescheduleTimeandDate(date: Date, time: string, serviceId: number): Promise<[number, ServiceRequest[]]> {
        return this.customerPageRepository.rescheduleTimeandDate(date, time, serviceId);
    }

    public async getAllServiceRequestOfHelper(helperId: number): Promise<ServiceRequest[] | null> {
        return this.customerPageRepository.getAllServiceRequestOfHelper(helperId);
    };

    public async getHelperById(helperId: number): Promise<User | null> {
        return this.customerPageRepository.getHelperById(helperId);
    };

    public compareDateWithCurrentDate(date: string) {
        const formatedDate1 = new Date(date.split("-").reverse().join("-"));
        // const oldDate = date.toString().split(" ");
      
        const formatedDate2 = new Date(moment(new Date()).format("YYYY-MM-DD"));
   
        if (formatedDate1 > formatedDate2) {
            return true;
        } else {
            return false;
        }
    };

    public helperHasFutureSameDateAndTime(
        date: string,
        serviceRequest: ServiceRequest[],
        totalHour: number,
        time: string) {
        let srDate;
        let startTime;
        let endTime;
        const uTime = time.split(":");
        if (uTime[1] === '30') {
            uTime[1] = '0.5';
        }
        const updatedTime = parseFloat(uTime[0]) + parseFloat(uTime[1]);
        const enteredDate = new Date(date.split("-").reverse().join("-"));
        let matched;
        for (let count in serviceRequest) {
            if (new Date(serviceRequest[count].ServiceStartDate) > enteredDate) {
                matched = false;
            }
            else if (
                new Date(serviceRequest[count].ServiceStartDate) < enteredDate
            ) {
                matched = false;
            }
            else {

                const sTime = serviceRequest[count].ServiceStartTime.toString().split(":");
                if (sTime[1] === '30') {
                    sTime[1] = '0.5';
                }
                const availStartTime = parseFloat(sTime[0]) + parseFloat(sTime[1]);
                const availTotalHour =
                    serviceRequest[count].ServiceHours + serviceRequest[count].ExtraHours;
                if (
                    updatedTime + totalHour < availStartTime ||
                    availStartTime + availTotalHour < updatedTime
                ) {
                    matched = false;
                }
                else {
                    srDate = serviceRequest[count].ServiceStartDate.toString().split("-").reverse().join("-");

                    const srTime = availStartTime.toString().split('.');
                    if (srTime[1] === '5') {
                        srTime[1] = '30'
                    } else {
                        srTime[1] = '00'
                    }
                    startTime = srTime.join(':');

                    const eTime = (availStartTime + availTotalHour).toString().split('.');
                    if (parseInt(eTime[1]) === 5) {
                        eTime[1] = '30';
                    } else {
                        eTime[1] = '00';
                    }
                    endTime = eTime.join(':');
                    matched = true;
                    break;
                }

            }
        }
        return { matched, srDate, startTime, endTime };
    };

    public mailData(userEmail: string, date: string, time: string, serviceRequestId: string): typeof mailOptions {
        const mailOptions = {
            from: process.env.USER,
            to: userEmail,
            subject: 'About rescheduled service request assigned to you',
            html: `
            <h1>“Service Request ${serviceRequestId} has been rescheduled by customer. New date and time are ${date} ${time}”.</h1>
            `
        };
        return mailOptions;
    }


    //////////////////////////////// 5.2 Service History APIs ///////////////////////////////////////

    public async getServiceHistory(userId: number): Promise<ServiceRequest[] | null> {
        return this.customerPageRepository.getServiceHistory(userId);
    }

    public async rateSP(rating: { [key: number | string]: Rating }): Promise<Rating> {
        return this.customerPageRepository.rateSP(rating);
    }

    public async getUserWithId(userId: number): Promise<User | null> {
        return this.customerPageRepository.getUserWithId(userId);
    }


    //////////////////////////////// 5.4 My Settings APIs ///////////////////////////////////////

    public async getUserDetailById(userId: number): Promise<User | null> {
        return this.customerPageRepository.getUserDetailById(userId);
    }

    public async updateMyDetails(user: User, userId: number): Promise<[number, User[]]> {
        return this.customerPageRepository.updateMyDetails(user, userId);
    }

    public async getUserAddressesById(userId: number): Promise<UserAddress[] | null> {
        return this.customerPageRepository.getUserAddressesById(userId);
    }

    public async updateMyAddresses(userAddress: UserAddress, addressId: number): Promise<[number, UserAddress[]]> {
        return this.customerPageRepository.updateMyAddresses(userAddress, addressId);
    }

    public async addNewAddress(userAddress: { [key: number | string]: UserAddress }): Promise<UserAddress> {
        return this.customerPageRepository.addNewAddress(userAddress);
    }

    public async deleteUserAddress(addressId: string, userId: string) {
        return this.customerPageRepository.deleteUserAddress(parseInt(addressId), parseInt(userId));
    }

    public async getUserWithEmail(userEmail: string): Promise<User | null> {
        return this.customerPageRepository.getUserWithEmail(userEmail);
    }

    public async changePassById(userId: number): Promise<User | null> {
        return this.customerPageRepository.changePassById(userId);
    }

    public async changePassword(password: string, userId: number): Promise<[number, User[]]> {
        return this.customerPageRepository.changePassword(password, userId);
    }
}