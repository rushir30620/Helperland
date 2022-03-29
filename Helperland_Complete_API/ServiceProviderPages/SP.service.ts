import moment from "moment";
import { FavoriteAndBlocked } from "../models/favoriteandblocked";
import { Rating } from "../models/rating";
import { ServiceRequest } from "../models/servicerequest";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import { User } from "../models/user";
import { UserAddress } from "../models/useraddress";
import { SPPageRepository } from "./SP.repository";
import db from "../models";
import { updateSPDetail } from "./types";

export class SPPageService {
  public constructor(private readonly spPageRepository: SPPageRepository) {
    this.spPageRepository = spPageRepository;
  }

  //////////////////////////// 6.1 Accept Service Request API /////////////////////////

  public async getServiceRequest(userId: number): Promise<ServiceRequest[] | null> {
    return this.spPageRepository.getServiceRequest(userId);
  }

  public async getCustomer(userId: number): Promise<User | null> {
    return this.spPageRepository.getCustomer(userId);
  }

  public async getServiceAddress(addressId: number): Promise<ServiceRequestAddress | null> {
    return this.spPageRepository.getServiceAddress(addressId);
  }

  public async getServiceRequestById(serviceRequestId: string): Promise<ServiceRequest | null> {
    return this.spPageRepository.getServiceRequestById(parseInt(serviceRequestId));
  }

  public async getAcceptedServiceRequest(serviceRequestId: number): Promise<ServiceRequest | null> {
    return this.spPageRepository.getAcceptedServiceRequest(serviceRequestId);
  }

  public async getServiceProvider(userId: number): Promise<User[] | null> {
    return this.spPageRepository.getServiceProvider(userId);
  }

  public async getAllServiceRequestsOfHelper(helperId: string): Promise<ServiceRequest[] | null> {
    return this.spPageRepository.getAllServiceRequestsOfHelper(parseInt(helperId));
  }

  public async getServiceRequestByZipcode(zipcode: string, spId: string): Promise<ServiceRequest[] | null> {
    let Request: ServiceRequest[] = [];
    const serviceRequest = await this.spPageRepository.getServiceRequestByZipcode(zipcode);

    const blockUser = await this.spPageRepository.getBlockedUserById(parseInt(spId));

    if (serviceRequest) {
      if (blockUser) {
        Request = serviceRequest.filter(sr => !blockUser.find(rm => (rm.TargetUserId === sr.UserId)));
      }
    }
    return Request;
  }

  public async filterServiceRequestsCompatibleWithHelper(
    includePets: boolean,
    serviceRequests: ServiceRequest[]
  ) {
    let sRequests: ServiceRequest[] = [];
    if (includePets === false) {
      for (let sr in serviceRequests) {
        if (serviceRequests[sr].HasPets === false) {
          sRequests.push(serviceRequests[sr]);
        }
      }
    } else {
      return serviceRequests;
    }
    return sRequests;
  }

  public async displayRequestDetail(srequest: ServiceRequest[]): Promise<Object[]> {
    let services:Object[] = [];
    for (let sr in srequest) {
      let requestAddress = await db.ServiceRequestAddress.findOne({ where: { ServiceRequestId: srequest[sr].ServiceRequestId } });
      let user = await db.Users.findOne({ where: { id: srequest[sr].UserId } });
      const startTime = srequest[sr].ServiceStartTime.toString().split(":")!;
      const endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + srequest[sr].ServiceHours! + srequest[sr].ExtraHours!).toString().split(".");
      if (endTime[1]) {
        endTime[1] = (parseInt(endTime[1]) * 6).toString();
      }
      else {
        endTime[1] = "00";
      }
      if (user) {
        if (requestAddress) {
          services.push({
            ServiceRequestId: srequest[sr].ServiceRequestId,
            ServiceStartDate: srequest[sr].ServiceStartDate.toString().split("-").reverse().join("-"),
            ServiceStartTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1],
            Customer: user.firstName + " " + user.lastName,
            Address: {
              Street: requestAddress.Addressline1,
              HouseNumber: requestAddress.Addressline2,
              City: requestAddress.City,
              PostalCode: requestAddress.PostalCode,
            },
            Payment: srequest[sr].TotalCost + " €"

          })
        }
      }
    }
    return services;
  }


  public helperHasFutureSameDateAndTime(
    date: Date,
    serviceRequest: ServiceRequest[],
    acceptTotalHour: number,
    time: number
  ) {
    let srId;
    let matched = false;
    for (let sr in serviceRequest) {
      if (serviceRequest[sr].ServiceStartDate.toLocaleDateString() === date.toLocaleDateString()) {
        const acceptTime = time.toString().split(":");
        if (acceptTime[1] === "30") {
          acceptTime[1] = "0.5";
        }
        const acceptStartTime =
          parseFloat(acceptTime[0]) + parseFloat(acceptTime[1]);

        const availableTime =
          serviceRequest[sr].ServiceStartTime.toString().split(":");
        if (availableTime[1] === "30") {
          availableTime[1] = "0.5";
        }
        const availableStartTime =
          parseFloat(availableTime[0]) + parseFloat(availableTime[1]);
        const availableTotalHour =
          serviceRequest[sr].ServiceHours + serviceRequest[sr].ExtraHours;
        const totalAcceptTime = acceptStartTime + acceptTotalHour + 1;
        const totalAvailableTime = availableStartTime + availableTotalHour + 1;
        if (
          availableStartTime >= totalAcceptTime ||
          acceptStartTime >= totalAvailableTime
        ) {
          matched = false;
        } else {
          srId = serviceRequest[sr].ServiceRequestId;
          matched = true;
          break;
        }
      } else {
        matched = false;
      }
    }
    return { matched, srId };
  }

  public mailData(userEmail: string, serviceRequestId: string): typeof mailOptions {
    const mailOptions = {
      from: process.env.USER,
      to: userEmail,
      subject: "Service Request Assigned",
      html: `<h3>A service request ${serviceRequestId} has already been accepted by someone and is no more available to you.</h3>`
    };
    return mailOptions;
  }


  //////////////////////////// 6.2 Upcoming Service API /////////////////////////

  public async getUpcomingService(spId: string): Promise<ServiceRequest[] | null> {
    return this.spPageRepository.getUpcomingService(parseInt(spId));
  }

  public async getServiceRequestwithId(serviceId: string): Promise<ServiceRequest | null> {
    return this.spPageRepository.getServiceRequestwithId(parseInt(serviceId));
  }

  public async completeService(serviceId: string, spId: string): Promise<[number, ServiceRequest[]]> {
    return this.spPageRepository.completeService(parseInt(serviceId), parseInt(spId));
  }

  public async compareCurrentAndServiceDateTime(serviceRequest: ServiceRequest): Promise<ServiceRequest | null> {
    const serviceDate = new Date(serviceRequest!?.ServiceStartDate);
    const currentDate = new Date(moment(new Date()).format("YYYY-MM-DD"));

    var time = serviceRequest.ServiceStartTime.toString().split(":");
    const serviceTime = parseFloat(time[0]) + parseFloat(time[1]) / 60;
    const serviceTotalTime = serviceTime + serviceRequest.ServiceHours + serviceRequest.ExtraHours;
    const currentTotalTime = new Date().getHours() + new Date().getMinutes() / 60;

    if (serviceDate < currentDate) {
      return serviceRequest;
    }
    else if (serviceDate > currentDate) {
      return null;
    }
    else {
      if (serviceTotalTime < currentTotalTime) {
        return serviceRequest;
      }
      else {
        return null;
      }
    }
  }




  //////////////////////////// 6.4 Service history API /////////////////////////

  public async getSPServiceHistory(spId: number): Promise<ServiceRequest[] | null> {
    return this.spPageRepository.getSPServiceHistory(spId);
  }

  public async getServiceRequestDetailById(srId: number): Promise<ServiceRequest | null> {
    return this.spPageRepository.getServiceRequestDetailById(srId);
  }

  public async getSPRatings(spId: string): Promise<Rating[] | null> {
    return this.spPageRepository.getSPRatings(parseInt(spId));
  }

  public compareDateWithCurrentDate(requestHistory: ServiceRequest[]) {
    const srHistory: ServiceRequest[] = [];
    const formatedDate2 = new Date(moment(new Date()).format("YYYY-MM-DD"));

    for (let sr in requestHistory) {
      const date = requestHistory[sr].ServiceStartDate;
      const formatedDate1 = new Date(moment(date).format("YYYY-MM-DD"));

      if (formatedDate1 <= formatedDate2) {
        srHistory.push(requestHistory[sr]);
      }
    }
    return srHistory;
  }

  public async getExcelDataForExport(serviceRequest: ServiceRequest[]): Promise<Object[]>{
    let historyData: Object[] = [];
    for (let history in serviceRequest) {
      let user = await this.spPageRepository.getCustomer(serviceRequest[history].UserId);
      historyData.push({
        ServiceId: serviceRequest[history].ServiceRequestId,
        StartDate: serviceRequest[history].ServiceStartDate,
        Customer: user?.firstName! + " " + user?.lastName!,
        Payment: serviceRequest[history].TotalCost,
      });
    }
    return historyData;
  }

  

  //////////////////////////// 6.7 My settings API /////////////////////////

  public async getBlockedUser(spId: string, targetId: string): Promise<FavoriteAndBlocked | null> {
    return this.spPageRepository.getBlockedUser(parseInt(spId), parseInt(targetId));
  }

  public async blockUser(spId: string, targetId: string): Promise<[number, FavoriteAndBlocked[]]> {
    return this.spPageRepository.blockUser(parseInt(spId), parseInt(targetId));
  }

  public async unBlockUser(spId: string, targetId: string): Promise<[number, FavoriteAndBlocked[]]> {
    return this.spPageRepository.unBlockUser(parseInt(spId), parseInt(targetId));
  }

  public async createBlockUser(blockedUser: { [key: number | string]: FavoriteAndBlocked }): Promise<FavoriteAndBlocked> {
    return this.spPageRepository.createBlockUser(blockedUser);
  }


  //////////////////////////// 6.7 My settings API /////////////////////////

  public async getSPDetailById(userId: number): Promise<User | null> {
    return this.spPageRepository.getSPDetailById(userId);
  }

  public async getSPaddress(userId: number): Promise<UserAddress | null> {
    return this.spPageRepository.getSPaddress(userId);
  }

  public async updateMyDetails(sp: updateSPDetail, userId: number): Promise<[number, User[]]> {
    return this.spPageRepository.updateMyDetails(sp, userId);
  }

  public async updateAddMyAddress(address: updateSPDetail, addressId:number){
    return this.spPageRepository.updateAddMyAddress(address, addressId);
  }

  public async createNewAddress(userId:number, userAddress: updateSPDetail){
    return this.spPageRepository.createNewAddress(userId,userAddress);
  }

  public async changePassById(userId: number): Promise<User | null> {
    return this.spPageRepository.changePassById(userId);
  }

  public async changeSPPassword(password: string, userId: number): Promise<[number, User[]]> {
    return this.spPageRepository.changeSPPassword(password, userId);
  }

  public convertStringtoDate(date:any){
    const updateddate = date.toString().split('-').reverse().join('-');
    const convertedDate = new Date(updateddate);
    return convertedDate;
  }
}