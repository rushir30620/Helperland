import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { ServiceRequest } from "../models/servicerequest";
import db from "../models";
import nodemailer from "nodemailer";

export class AdminController {
    public constructor(private readonly adminService: AdminService) {
        this.adminService = adminService;
    }

    /////////////////////////////////////////// 7.1 Service Request API //////////////////////////////////////////////////

    public getAllServiceRequests = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            return this.adminService.getAllServiceRequests()
                .then(async (serviceRequest) => {
                    if (serviceRequest) {
                        const completeServiceDetail = await this.adminService.requestData(serviceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(402).json({ msg: "Service Request Not Found" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(404).json({ msg: "User not found" });
        }
    };

    public rescheduleDateandTime = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const serviceId = +req.params.serviceId;
        const isAvailable = this.adminService.compareTwoDates(req.body.ServiceStartDate);
        if(isAvailable){
            if (req.body.user.userTypeId === 2) {
                return this.adminService.getServiceRequest(serviceId)
                    .then((serviceRequest) => {
                        if (serviceRequest) {
                            req.body.totalHour = serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                            req.body.helperId = serviceRequest.ServiceProviderId;
                            if (serviceRequest.ServiceProviderId) {
                                return this.adminService.getAllSPRequest(serviceRequest.ServiceProviderId)
                                    .then(async (servicerequest) => {
                                        if (servicerequest) {

                                            let newServiceDate = new Date(req.body.ServiceStartDate.split("-").reverse().join("-"));
                                            newServiceDate.setHours(parseInt(req.body.ServiceStartTime.toString().split(':')[0]));
                                            newServiceDate.setMinutes(parseInt(req.body.ServiceStartTime.toString().split(':')[1]));
                                            let newServiceEnd = new Date(newServiceDate);


                                            newServiceEnd.setHours(newServiceDate.getHours() + Math.floor(req.body.totalHour));
                                            newServiceEnd.setMinutes((req.body.totalHour - Math.floor(req.body.totalHour)) * 60);

                                            let flag = true;
                                            servicerequest.forEach((s) => {

                                                let oldServiceStart = new Date(s.ServiceStartDate);
                                                oldServiceStart.setHours(parseInt(s.ServiceStartTime.toString().split(':')[0]));
                                                oldServiceStart.setMinutes(parseInt(s.ServiceStartTime.toString().split(':')[1]));

                                                const total = s.ServiceHours + s.ExtraHours;

                                                let oldServiceEnd = oldServiceStart;
                                                oldServiceEnd.setHours(oldServiceEnd.getHours() + Math.floor(total));
                                                oldServiceEnd.setMinutes((total - Math.floor(total)) * 60);
                                                if (
                                                    (newServiceDate >= oldServiceStart && newServiceDate < oldServiceEnd) ||
                                                    (newServiceEnd > oldServiceStart && newServiceEnd <= oldServiceEnd) ||
                                                    (oldServiceStart >= newServiceDate && oldServiceEnd < newServiceEnd)
                                                ) {
                                                    return res.status(404).json({ msg: "This service cannot assign to this service provider. Please choose another service date and time." });
                                                }

                                                else {
                                                    flag = false;

                                                }
                                            });
                                            if (!flag) {
                                                return this.adminService.rescheduleDateandTime(req.body, +req.params.serviceId)
                                                    .then((rescheduleService) => {
                                                        if (rescheduleService.length > 0) {
                                                            console.log("In next");

                                                            next();
                                                        }
                                                        else {
                                                            return res.status(402).json({ msg: "Cannot update date and time" });
                                                        }
                                                    })
                                                    .catch((error: Error) => {
                                                        console.log(error);
                                                        return res.status(500).json({ error: error });
                                                    });
                                            }
                                        }
                                        else {
                                            return res.status(402).json({ msg: "Service Request not found" });
                                        }
                                    }).
                                    catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({ error: error });
                                    })
                            }
                            else {
                                return res.status(401).json({ msg: "Service provider not found" });
                            }
                        }
                        else {
                            return res.status(402).json({ msg: "Service request not found" });
                        }
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })
            }
            else {
                return res.status(401).json({ msg: "admin not found" });
            }
        }
        else{
            return res.status(422).json({msg:"Please enter valid date"});
        }
    };

    public updateMyAddress = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        let  UserAndSPIdList: number[] = [];
        let UserAndSPDetail: string[] = [];
        const srId = +req.params.serviceId;
        if (srId && req.body.user.userTypeId === 2) {
            return this.adminService.getSRaddress(srId)
                .then(srAddress => {
                    if (srAddress) {
                        return this.adminService.updateMyAddress(req.body, srAddress.ServiceRequestId)
                            .then(newSRAddress => {
                                if (newSRAddress) {
                                    return this.adminService.getServiceRequests(srAddress.ServiceRequestId)
                                    .then(serviceRequest => {
                                        if(serviceRequest.length > 0){
                                            for(let sr in serviceRequest){
                                                UserAndSPIdList.push(serviceRequest[sr].UserId, serviceRequest[sr].ServiceProviderId);
                                            }
                                            return this.adminService.getAllUsers()
                                            .then(user => {
                                                if(user.length > 0){       
                                                    for(let us in user){
                                                            if(UserAndSPIdList[0] === user[us].id){
                                                                UserAndSPDetail.push(user[us].email!);
                                                            }
                                                            else if(UserAndSPIdList[1] === user[us].id){
                                                                UserAndSPDetail.push(user[us].email!);
                                                            }
                                                    }
                                                    for(let spUser in UserAndSPDetail){
                                                        const transporter = nodemailer.createTransport({
                                                            service: process.env.SERVICE,
                                                            auth: {
                                                                user: process.env.USER,
                                                                pass: process.env.PASS,
                                                            },
                                                        });
            
                                                        const mailOptions = this.adminService.mailData(UserAndSPDetail[spUser], srAddress.ServiceRequestId!);
                                                        transporter.sendMail(mailOptions, (error, info) => {
                                                            if (error) {
                                                                res.status(404).json({
                                                                    error: error,
                                                                    message: "Email cannot be sent.."
                                                                });
                                                            }
                                                        });
                                                    }
                                                     return res.status(200).json({ msg: "Service Rescheduled Successfully" });
                                                }
                                                else{
                                                    return res.status(401).json({msg:"User not found"});
                                                }
                                            })
                                            .catch((error: Error) => {
                                                console.log(error);
                                                return res.status(500).json({ error: error });
                                            });
                                        }
                                        else{
                                            return res.status(402).json({msg:"Service Request not found"});
                                        }
                                    })
                                    .catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({ error: error });
                                    });
                                }
                                else {
                                    return res.status(402).json({ msg: " Error!! cannot updated your address" });
                                }
                            })
                            .catch((error: Error) => {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                })
        }
        else {
            return res.status(401).json({ msg: "User not found" });
        }
    };


    ///////////////////////////////////////// 7.2 Filters API /////////////////////////////////////////////////

    public searchByServiceId = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const serviceRequestId = req.body.ServiceRequestId;
            return this.adminService.getServiceRequest(serviceRequestId)
                .then(async (service) => {
                    if (service?.ServiceRequestId === serviceRequestId) {
                        const allServiceRequest = await this.adminService.searchByServiceId(serviceRequestId);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this service id" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

    public searchByPostalcode = async (req: Request, res: Response): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const postalCode = req.body.ZipCode;
            return this.adminService.getServiceRequestByZipcode(postalCode)
                .then(async (service) => {
                    if (service?.ZipCode === postalCode) {
                        const allServiceRequest = await this.adminService.searchByPostalcode(postalCode);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this postalcode" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

    public searchByEmail = async (req: Request, res: Response): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const email = req.body.email;
            return this.adminService.getUserByEmail(email)
                .then(async (service) => {
                    if (service?.email === email) {
                        const allServiceRequest = await this.adminService.searchByEmailAndNameWithUserID(service?.id!);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this email" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

    public searchByName = async (req: Request, res: Response): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const name1 = req.body.Name.split(" ")[0];
            const name2 = req.body.Name.split(" ")[1];
            return this.adminService.getUserByName(name1, name2)
                .then(async (service) => {
                    if (service) {
                        const allServiceRequest = await this.adminService.searchByEmailAndNameWithUserID(service?.id!);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this name" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    }

    public searchByServiceProvider = async (req: Request, res: Response): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const name1 = req.body.SPName.split(" ")[0];
            const name2 = req.body.SPName.split(" ")[1];
            return this.adminService.getUserByName(name1, name2)
                .then(async (service) => {
                    if (service?.firstName === name1 && service?.lastName === name2 && service?.userTypeId === 3) {
                        const allServiceRequest = await this.adminService.searchByPostalcode(service?.zipCode!);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this service provider" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

    public searchByStatus = async (req: Request, res: Response): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const status = req.body.Status;
            let newStatus: number | undefined;
            if (status === 'New') {
                newStatus = 1;
            }
            else if (status === 'Accepted') {
                newStatus = 2;
            }
            else if (status === 'Completed') {
                newStatus = 3;
            }
            else {
                newStatus = 4;
            }
            return this.adminService.getServiceByStatus(newStatus)
                .then(async (service) => {
                    if (service?.Status === newStatus) {
                        const allServiceRequest = await this.adminService.searchByStatus(newStatus!);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this status" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

    public searchByHasIssue = async (req: Request, res: Response): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            const hasIssue = req.body.HasIssue;
            return this.adminService.getServiceByHasIssue(hasIssue)
                .then(async (service) => {
                    if (service?.HasIssue === hasIssue) {
                        const allServiceRequest = await this.adminService.searchByHasIssue(hasIssue);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

    public searchByDate = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            req.body.ServiceStartDate = this.adminService.convertStringtoDate(req.body.ServiceStartDate);
            const date = req.body.ServiceStartDate;
            return this.adminService.getServiceByDate(req.body.ServiceStartDate)
                .then(async (service) => {
                    if (date.toLocaleDateString() === service?.ServiceStartDate.toLocaleDateString()) {
                        const allServiceRequest = await this.adminService.searchByDate(date);
                        const completeServiceDetail = await this.adminService.requestData(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this date" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(402).json({ msg: "Admin not found" });
        }
    };

///////////////////////////////////// 7.3 User Management //////////////////////////////////////////////

    public getUserList = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            return this.adminService.getAllUsers()
                .then(async (user) => {
                    if (user) {
                        const completeUserDetail = await this.adminService.userManageData(user);
                        return res.status(200).json(completeUserDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "Users Not Found" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(404).json({ msg: "User not found" });
        }
    };

    public activeUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            if (req.body.isRegisteredUser === true) {
                return this.adminService.getSPDetail(+req.params.userId)
                    .then(async (user) => {
                        const userObj = {
                            isRegisteredUser: req.body.isRegisteredUser
                        }
                        if (user && user?.isRegisteredUser === false) {
                            const activateUser = await db.Users.update(userObj, { where: { id: user.id } });
                            if (activateUser) {
                                return res.status(200).json({ msg: "Service Provider Activate Successfully" });
                            }
                            else {
                                return res.status(402).json({ msg: "Error!!! Service Provider cannot activate" });
                            }
                        }
                        else if (user && user.isRegisteredUser === true) {
                            return res.status(201).json({ msg: "Service Provider Already activate" });
                        }
                        else {
                            return res.status(404).json({ msg: "New service provider not found" })
                        }
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    });
            }
            else {
                next();
            }
        }
        else {
            return res.status(401).json({ msg: "Admin Not Found" });
        }
    };

    public deactiveUser = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            return this.adminService.getSPDetail(+req.params.userId)
                .then(async (user) => {
                    const userObj = {
                        isRegisteredUser: req.body.isRegisteredUser
                    }
                    if (user && user?.isRegisteredUser === true) {
                        const activateUser = await db.Users.update(userObj, { where: { id: user.id } });
                        if (activateUser) {
                            return res.status(200).json({ msg: "Service Provider De-Activate Successfully" });
                        }
                        else {
                            return res.status(402).json({ msg: "Error!!! Service Provider cannot deactivate" });
                        }
                    }
                    else if (user && user.isRegisteredUser === false) {
                        return res.status(201).json({ msg: "Service Provider Already deactivate" });
                    }
                    else {
                        return res.status(404).json({ msg: "New service provider not found" })
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                })
        }
        else {
            return res.status(404).json({ msg: "Admin Not Found" });
        }
    };


}