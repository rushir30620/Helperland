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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
                });
        }
        else {
            return res.status(404).json({ msg: "User not found" });
        }
    };

    public rescheduleDateandTime = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const serviceId = +req.params.serviceId;
        const isAvailable = this.adminService.compareTwoDates(req.body.ServiceStartDate);
        if (isAvailable) {
            if (req.body.user.userTypeId === 2) {
                return this.adminService.getServiceRequest(serviceId)
                    .then((serviceRequest) => {
                        if (serviceRequest) {
                            req.body.totalHour = serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                            req.body.helperId = serviceRequest.ServiceProviderId;
                            if (serviceRequest.Status === 2) {
                                return this.adminService.getAllSPRequest(serviceRequest.ServiceProviderId)
                                    .then(async (servicerequest) => {
                                        if (servicerequest) {
                                            const { flag } = await this.adminService.check(req.body.ServiceStartDate, servicerequest, req.body.ServiceStartTime, req.body.totalHour);
                                            if (flag === false) {
                                                return this.adminService.rescheduleDateandTime(req.body, +req.params.serviceId)
                                                    .then((rescheduleService) => {
                                                        if (rescheduleService.length > 0) {
                                                            next();
                                                        }
                                                        else {
                                                            return res.status(402).json({ msg: "Cannot update date and time" });
                                                        }
                                                    })
                                                    .catch((error: Error) => {
                                                        console.log(error.message);
                                                        return res.status(500).json({ error: error.message });
                                                    });
                                            }
                                            else {
                                                return res.status(404).json({ msg: "This service cannot assign to this service provider. Please choose another service date and time." })
                                            }
                                        }
                                    }).
                                    catch((error: Error) => {
                                        console.log(error.message);
                                        return res.status(500).json({ error: error.message });
                                    })
                            }
                            else if (serviceRequest.Status === 1) {
                                return this.adminService.rescheduleDateandTime(req.body, +req.params.serviceId)
                                    .then((rescheduleService) => {
                                        if (rescheduleService.length > 0) {
                                            next();
                                        }
                                        else {
                                            return res.status(402).json({ msg: "Cannot update date and time" });
                                        }
                                    })
                                    .catch((error: Error) => {
                                        console.log(error.message);
                                        return res.status(500).json({ error: error.message });
                                    });
                            }
                        }
                        else {
                            return res.status(402).json({ msg: "Service request not found" });
                        }
                    })
                    .catch((error: Error) => {
                        console.log(error.message);
                        return res.status(500).json({ error: error.message });
                    })
            }
            else {
                return res.status(401).json({ msg: "admin not found" });
            }
        }
        else {
            return res.status(422).json({ msg: "Please enter valid date" });
        }
    };

    public updateMyAddress = async (req: Request, res: Response): Promise<Response | void> => {
        const srId = +req.params.serviceId;
        if (srId && req.body.user.userTypeId === 2) {
            return this.adminService.getSRaddress(srId)
                .then(srAddress => {
                    if (srAddress) {
                        return this.adminService.updateMyAddress(req.body, srAddress.ServiceRequestId)
                            .then(newSRAddress => {
                                if (newSRAddress) {
                                    return this.adminService.getServiceRequest(srAddress.ServiceRequestId)
                                        .then(async (serviceRequest) => {
                                            if (serviceRequest) {
                                                const user = await this.adminService.getCustomerDetail(serviceRequest?.UserId!);
                                                const sp = await this.adminService.getSPDetail(serviceRequest?.ServiceProviderId);
                                                const transporter = nodemailer.createTransport({
                                                    service: process.env.SERVICE,
                                                    auth: {
                                                        user: process.env.USER,
                                                        pass: process.env.PASS,
                                                    },
                                                });
                                                const mailOptions = this.adminService.mailData(user?.email!, sp?.email!, serviceRequest?.ServiceRequestId);

                                                transporter.sendMail(mailOptions, (error) => {
                                                    if (error) {
                                                        return res.status(404).json({
                                                            error: error,
                                                            message: "Email cannot be sent.."
                                                        });
                                                    }
                                                });
                                                return res.status(200).json({ msg: "Service Rescheduled successfully" });
                                            }
                                            else {
                                                return res.status(404).json({ msg: "Service request not found" });
                                            }
                                        })
                                        .catch((error: Error) => {
                                            //console.log(error.message);
                                            return res.status(500).json({ error: error.message });
                                        });
                                }
                                else {
                                    return res.status(402).json({ msg: " Error!! cannot updated your address" });
                                }
                            })
                            .catch((error: Error) => {
                                //console.log(error.message);
                                return res.status(500).json({ error: error.message });
                            });
                    }
                    else {
                        return res.status(404).json({ msg: "Service address not found" });
                    }
                })
                .catch((error: Error) => {
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
                })
        }
        else {
            return res.status(401).json({ msg: "User not found" });
        }
    };

    public cancelServiceRequestFromAdmin = async (req: Request, res: Response): Promise<Response> => {
        const serviceRequestId = +req.params.serviceRequestId;
        if (serviceRequestId) {
            return this.adminService.getAcceptedServiceRequest(+req.params.serviceRequestId)
                .then(async (serviceRequest) => {
                    if (!serviceRequest) {
                        return res.status(404).json({ msg: "Service Request Not Found" });
                    }
                    else {
                        const spObj = {
                            ServiceRequestId: serviceRequest.ServiceRequestId,
                            ServiceId: serviceRequest.ServiceId,
                            ServiceStartDate: serviceRequest.ServiceStartDate,
                            ServiceStartTime: serviceRequest.ServiceStartTime,
                            ZipCode: serviceRequest.ZipCode,
                            ServiceHourlyRate: serviceRequest.ServiceHourlyRate,
                            ServiceHours: serviceRequest.ServiceHours,
                            ExtraHours: serviceRequest.ExtraHours,
                            SubTotal: serviceRequest.SubTotal,
                            Discount: serviceRequest.Discount,
                            TotalCost: serviceRequest.TotalCost,
                            Comments: req.body.Comments,
                            PaymentTransactionRefNo: serviceRequest.PaymentTransactionRefNo,
                            PaymentDue: serviceRequest.PaymentDue,
                            SPAcceptedDate: serviceRequest.SPAcceptedDate,
                            HasPets: serviceRequest.HasPets,
                            Status: 4,
                            ModifiedBy: serviceRequest.ModifiedBy,
                            RefundedAmount: serviceRequest.RefundedAmount,
                            Distance: serviceRequest.Distance,
                            HasIssue: serviceRequest.HasIssue,
                            PaymentDone: serviceRequest.PaymentDone,
                            RecordVersion: serviceRequest.RecordVersion,
                            UserId: serviceRequest.UserId,
                            ServiceProviderId: serviceRequest.ServiceProviderId
                        }
                        const result = await db.ServiceRequest.update(spObj, { where: { ServiceRequestId: serviceRequestId } });

                        if (result) {
                            return res.status(200).json({ spObj });
                        }
                        else {
                            return res.status(500).json({ msg: "Not Found" });
                        };
                    }
                })
                .catch((error: Error) => {
                    return res.status(500).json({ error: error });
                })
        }
        return res.status(404).json({ error: 'NotFound' });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    console.log(service);
                    console.log(service?.ZipCode);
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    if (service && service?.userTypeId === 3) {
                        const allServiceRequest = await this.adminService.searchByPostalcode(service?.zipCode!);
                        const completeServiceDetail = await this.adminService.requestData2(allServiceRequest);
                        return res.status(200).json(completeServiceDetail);
                    }
                    else {
                        return res.status(404).json({ msg: "No similar service available for this service provider" });
                    }
                })
                .catch((error: Error) => {
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
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
                        //console.log(error.message);
                        return res.status(500).json({ error: error.message });
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
                    //console.log(error.message);
                    return res.status(500).json({ error: error.message });
                })
        }
        else {
            return res.status(404).json({ msg: "Admin Not Found" });
        }
    };

    ///////////////////////////////////// 7.4 Refund Amount //////////////////////////////////////////////

    public refundAmount = async (req: Request, res: Response): Promise<Response> => {
        let RefundArray: any[] = [];
        const serviceRequestId = +req.params.serviceRequestId;
        let inValid: boolean;
        let flag: boolean;
        if (req.body.user.id && req.body.user.userTypeId === 2) {
            return this.adminService.getServiceRequest(+req.params.serviceRequestId)
                .then(async (serviceRequest) => {
                    if (serviceRequest) {
                        req.body.TotalCost = serviceRequest.TotalCost;
                        req.body.InBalanceAmount = serviceRequest.TotalCost - serviceRequest.RefundedAmount;
                        if (serviceRequest.RefundedAmount === null) {
                            serviceRequest.RefundedAmount = 0;
                        }
                        RefundArray.push(req.body.TotalCost);
                        for (let refund in RefundArray) {
                            if (req.body.Amount && req.body.Mode && serviceRequest.Status != 1) {
                                if (req.body.Mode === "Fixed") {
                                    req.body.calculate = req.body.Amount;
                                    serviceRequest.RefundedAmount = +serviceRequest.RefundedAmount + req.body.calculate;
                                    req.body.InBalanceAmount = req.body.TotalCost - serviceRequest.RefundedAmount;
                                    RefundArray.push(req.body.InBalanceAmount);
                                }
                                else if (req.body.Mode === "Percentage") {
                                    req.body.calculate = (req.body.InBalanceAmount * req.body.Amount) / 100;
                                    serviceRequest.RefundedAmount = req.body.calculate + +serviceRequest.RefundedAmount;
                                    req.body.InBalanceAmount = req.body.TotalCost - serviceRequest.RefundedAmount;
                                    RefundArray.push(req.body.InBalanceAmount);
                                }
                                else {
                                    inValid = true;
                                    break;
                                }
                                if (RefundArray[refund] >= serviceRequest.RefundedAmount) {
                                    flag = true;
                                }
                                else {
                                    flag = false;
                                    break;
                                }
                            }
                        }
                        const refundObj = {
                            PaidAmount: serviceRequest.TotalCost,
                            RefundedAmount: serviceRequest.RefundedAmount,
                            InBalancedAmount: req.body.InBalanceAmount,
                            Amount: req.body.Amount,
                            Mode: req.body.Mode,
                            Comments: serviceRequest.Comments + " " + req.body.Comments,
                        }
                        if (flag) {
                            const result = await db.ServiceRequest.update(refundObj, { where: { ServiceRequestId: serviceRequestId } });
                            if (result) {
                                return res.status(200).json({ refundObj, msg: "Your service amount refunded successfully" });
                            }
                            else {
                                return res.status(401).json({ msg: "Error!! While refund your service amount" });
                            }
                        }
                        else if(inValid){
                            return res.status(402).json({msg: "Invalid input"});
                        }
                        else {
                            return res.status(403).json({ msg: "Refund amount cannot greater than total service amount" });
                        }
                    }
                    else {
                        return res.status(404).json({ msg: "Service Request not found" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(404).json({ msg: "Admin not found" });
        }
    }

}