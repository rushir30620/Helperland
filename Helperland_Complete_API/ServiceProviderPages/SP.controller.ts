import { ServiceRequest } from "../models/servicerequest";
import { NextFunction, Request, Response } from "express";
import { SPPageService } from "./SP.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import db from "../models";
import { Rating } from "../models/rating";
import { ServiceRequestAddress } from "../models/servicerequestaddress";
import moment from "moment";
import exceljs from "exceljs";

export class SPPageController {
    public constructor(private readonly spPageService: SPPageService) {
        this.spPageService = spPageService;
    }

    /////////////////////////////////////////// 6.1 Accept Service Request API ////////////////////////////////////////////////

    public getAllNewServiceRequests = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.userTypeId == 3) {
            if (req.body.user.id) {
                return this.spPageService.getSPDetailById(req.body.user.id)
                    .then((sp) => {
                        if (sp) {

                            if (sp.zipCode == null) {
                                return res.status(404).json({ message: "Zipcode not found!! Please add zipCode in your profile" });
                            }
                            else {

                                const zipcode: string = sp.zipCode;
                                return this.spPageService.getServiceRequestByZipcode(sp.zipCode, req.body.user.id)
                                    .then(async (serviceRequests) => {
                                        if (serviceRequests && serviceRequests.length > 0) {

                                            const sRequests = await this.spPageService.filterServiceRequestsCompatibleWithHelper(
                                                req.body.PetsAtHome,
                                                serviceRequests
                                            );
                                            if (sRequests) {

                                                const requestDetail = await this.spPageService.displayRequestDetail(sRequests);
                                                return res.status(200).json(requestDetail);
                                            }
                                            else {
                                                return res.status(401).json({ message: "service requests not found" });
                                            }
                                        }
                                        else {
                                            return res.status(404).json({ message: "service requests not found" });
                                        }
                                    })
                                    .catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({ error: error });
                                    });
                            }
                        }
                        else {
                            return res.status(404).json({ message: "helper not found" });
                        }
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    });
            }
            else {
                return res.status(422).json({ message: "helperId not found in request body" });
            }
        }
        else {
            return res.status(401).json({ message: "unauthorised user" });
        }
    };

    public getServiceRequestDetail = async (req: Request, res: Response): Promise<Response> => {
        return this.spPageService.getServiceAddress(+req.params.addressId)
            .then((address: ServiceRequestAddress | null) => {
                if (!address) {
                    return res.status(404).json({ error: "Service Request address not found" });
                }
                else {
                    return this.spPageService.getCustomer(req.body.user.id)
                        .then((user) => {
                            if (!user) {
                                return res.status(201).json({ msg: "User detail not found for this request" });
                            }
                            else {
                                return this.spPageService.getServiceRequest(address.ServiceRequestId)
                                    .then((customer) => {
                                        if (!customer) {
                                            return res.status(201).json({ msg: "No service request found" });
                                        }
                                        else {
                                            return res.status(200).json({ customer });
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
                        });
                }
            })
            .catch((error: Error) => {
                console.log(error);
                return res.status(500).json({ error: error });
            });
    };

    public acceptRequest = async (req: Request, res: Response): Promise<Response> => {
        // const serviceRequest = req.params.serviceId;
        if (req.params.serviceRequestId) {
            return this.spPageService.getServiceRequestById(req.params.serviceRequestId)
                .then(async (service) => {
                    if (!service) {
                        return res.status(404).json({ msg: "No such service request found" });
                    }
                    else {
                        if (service.Status === 2) {
                            return res.status(201).json({ msg: "This service request is no more available. It has been assigned to another Service provider." });
                        }
                        else {
                            const serviceObj = {
                                ServiceRequestId: service.ServiceRequestId,
                                Status: 2,
                                ServiceProviderId: service.ServiceProviderId,
                                ModifiedBy: service.ServiceProviderId,
                                SPAcceptedDate: new Date()
                            }
                            const result = await db.ServiceRequest.update(serviceObj, { where: { ServiceRequestId: req.params.serviceRequestId } });
                            if (result) {
                                return this.spPageService.getServiceProvider(req.body.user.id)
                                    .then((helpers) => {
                                        if (helpers) {
                                            for (let sp in helpers) {
                                                if (helpers[sp].email === req.body.user.email) {
                                                    continue;
                                                }
                                                const transporter = nodemailer.createTransport({
                                                    service: process.env.SERVICE,
                                                    auth: {
                                                        user: process.env.USER,
                                                        pass: process.env.PASS,
                                                    },
                                                });
                                                const data = this.spPageService.mailData(helpers[sp].email!, req.params.serviceId);
                                                transporter.sendMail(data, (error, info) => {
                                                    if (error) {
                                                        res.status(404).json({
                                                            error: error,
                                                            message: "Email cannot be sent.."
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                        return res.status(200).json({ serviceObj, msg: "Service accepted successfully" });
                                    })
                                    .catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({ error: error });
                                    });
                            }
                            else {
                                return res.status(201).json({ msg: "Error!! Please try again later" });
                            };
                        }
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(403).json({ msg: "No such service request found" });
        }
    };

    public IsServiceAvailableOrNot = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (req.params.serviceRequestId) {
            return this.spPageService
                .getServiceRequestById(req.params.serviceRequestId)
                .then((serviceRequest) => {
                    if (serviceRequest) {
                        req.body.ZipCode = serviceRequest.ZipCode;
                        return this.spPageService
                            .getAllServiceRequestsOfHelper(req.body.user.id)
                            .then(async (serviceRequests) => {
                                req.body.totalHour =
                                    serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                                if (serviceRequests) {
                                    const { srId, matched } =
                                        await this.spPageService.helperHasFutureSameDateAndTime(
                                            serviceRequest.ServiceStartDate,
                                            serviceRequests,
                                            req.body.totalHour,
                                            serviceRequest.ServiceStartTime
                                        );
                                    if (matched) {
                                        return res.status(200).json({
                                            message:
                                                "Another service request " +
                                                srId +
                                                " has already been assigned which has time overlap with this service request. You can’t pick this one!",
                                        });
                                    }
                                    else {
                                        next();
                                    }
                                }
                                else {
                                    next();
                                }
                            })
                            .catch((error: Error) => {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            });
                    }
                    else {
                        return res.status(201).json({
                            message:
                                "This service request is no more available. It has been assigned to another provider",
                        });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res
                .status(400)
                .json({ message: "proper input not found in request" });
        }
    };


    ///////////////////////////////////////////////// 6.2 Upcoming Service API /////////////////////////////////////////////

    public getUpcomingService = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 3) {
            return this.spPageService.getUpcomingService(req.body.user.id)
                .then((services) => {
                    const serviceArray: ServiceRequest[] = [];
                    const currentDate = new Date(moment(new Date()).format("YYYY-MM-DD"));
                    if (services) {
                        for (let service in services) {
                            let serviceDate = new Date(services[service].ServiceStartDate);
                            if (currentDate > serviceDate) {
                                continue;
                            }
                            serviceArray.push(services[service]);
                        }
                        return res.status(200).json({ serviceArray });
                    }
                    else {
                        return res.status(404).json({ msg: "Upcoming request not found" });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(401).json({ msg: "User not found " });
        }
    };

    public completeService = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 3) {
            if (req.params.serviceRequestId) {
                return this.spPageService.getServiceRequestwithId(req.params.serviceRequestId)
                    .then((serviceRequest) => {
                        if (serviceRequest) {
                            if (serviceRequest.ServiceProviderId === req.body.user.id) {
                                return this.spPageService.compareCurrentAndServiceDateTime(serviceRequest)
                                    .then((newSR) => {
                                        if (newSR) {
                                            return this.spPageService.completeService(req.params.serviceRequestId, req.body.user.id)
                                                .then((editedSR) => {
                                                    if (editedSR) {
                                                        return res.status(200).json({ msg: "Service Request completed" });
                                                    }
                                                    else {
                                                        return res.status(404).json({ msg: "Error!! Please try again later" });
                                                    }
                                                })
                                                .catch((error: Error) => {
                                                    console.log(error);
                                                    return res.status(500).json({ error: error });
                                                })
                                        }
                                        else {
                                            return res.status(201).json({ message: "Your service hours not completed yet!! Please try again later" });
                                        }
                                    })
                                    .catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({ error: error });
                                    })
                            }
                            else {
                                return res.status(401).json({ message: "Service Provider Not found" });
                            }
                        }
                        else {
                            return res.status(401).json({ message: "Service Request Not found" });
                        }
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })
            }
            else {
                return res.status(400).json({ message: "Service Request Not found" });
            }
        }
        else {
            return res.status(401).json({ message: "User Not found" });
        }
    }

    public cancelServiceRequest = async (req: Request, res: Response): Promise<Response> => {
        const serviceRequestId = +req.params.serviceRequestId;
        if (serviceRequestId) {
            return this.spPageService.getAcceptedServiceRequest(+req.params.serviceRequestId)
                .then(async (serviceRequest) => {
                    if (!serviceRequest) {
                        return res.status(404).json({ msg: "Service Request Not Found" });
                    }
                    else{
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


    ///////////////////////////////////////////////// 6.4 Service history API //////////////////////////////////////////////////

    public getSPServiceHistory = async (req: Request, res: Response): Promise<Response> => {
        return this.spPageService.getSPServiceHistory(parseInt(req.body.user.id))
            .then(async serviceHistory => {
                if (serviceHistory) {
                    const oldServiceHistory = this.spPageService.compareDateWithCurrentDate(serviceHistory);
                    if (serviceHistory.length > 0) {
                        let services = [];
                        for (let sr in oldServiceHistory) {
                            let sa = await db.ServiceRequestAddress.findOne({ where: { ServiceRequestId: oldServiceHistory[sr].ServiceRequestId } });
                            let u = await db.Users.findOne({ where: { id: oldServiceHistory[sr].UserId } });
                            const startTime = oldServiceHistory[sr].ServiceStartTime.toString().split(":");
                            const endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + oldServiceHistory[sr].ServiceHours + oldServiceHistory[sr].ExtraHours).toString().split(".");
                            if (endTime[1]) {
                                endTime[1] = (parseInt(endTime[1]) * 6).toString();
                            }
                            else {
                                endTime[1] = "00";
                            }
                            const obj = {
                                ServiceRequestId: oldServiceHistory[sr].ServiceRequestId,
                                ServiceStartDate: oldServiceHistory[sr].ServiceStartDate.toString().split("-").reverse().join("-"),
                                ServiceHours: oldServiceHistory[sr].ServiceHours,
                                Username: u?.firstName + " " + u?.lastName,
                                Address: {
                                    Street: sa?.Addressline1,
                                    HouseNumber: sa?.Addressline2,
                                    City: sa?.City,
                                    PostalCode: sa?.PostalCode,
                                },
                                ServiceStartTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1]
                            };
                            services.push(obj);
                        }
                        return res.status(200).json(services);
                    }
                    else {
                        return res.status(404).json({ msg: "Past service history is not available" })
                    }
                }
                else {
                    return res.status(404).json({ msg: "Service history not found" });
                }
            })
            .catch((error: Error) => {
                return res.status(500).json({ error: error });
            });
    };

    public getServiceHistoryDetail = async (req: Request, res: Response): Promise<Response> => {
        return this.spPageService.getServiceAddress(+req.params.addressId)
            .then((address: ServiceRequestAddress | null) => {
                if (!address) {
                    return res.status(404).json({ error: "Service Request address not found" });
                }
                else {
                    return this.spPageService.getCustomer(req.body.user.id)
                        .then((user) => {
                            if (!user) {
                                return res.status(201).json({ msg: "User detail not found for this request" });
                            }
                            else {
                                return this.spPageService.getServiceRequest(address.ServiceRequestId)
                                    .then((customer) => {
                                        if (!customer) {
                                            return res.status(201).json({ msg: "No service request found" });
                                        }
                                        else {
                                            return res.status(200).json({ customer });
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
                        });
                }
            })
            .catch((error: Error) => {
                console.log(error);
                return res.status(500).json({ error: error });
            });
    };

    public downloadExcelData = async(req: Request, res: Response):Promise<Response | void> => {
        let historyData = [];
        return this.spPageService.getSPServiceHistory(parseInt(req.body.user.id))
        .then(async historydata => {
            if(historydata){
                const checkDate = this.spPageService.compareDateWithCurrentDate(historydata)
                if(historydata.length > 0){
                    historyData = await this.spPageService.getExcelDataForExport(checkDate)
                    let workbook = new exceljs.Workbook();
                    let worksheet = workbook.addWorksheet("Service Provider history");
                    worksheet.columns = [
                        { header: "ServiceId", key:"ServiceId", width: 25},
                        { header: "StartDate", key:"StartDate", width: 25},
                        { header: "Customer", key: "Customer", width: 25},
                        { header: "Payment", key:"Payment", width: 15},
                    ];
                    worksheet.addRows(historyData);
                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                     res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + "ServiceProviderHistory.xlsx"
                    ); 
                    return workbook.xlsx.write(res).then(function(err) {
                        res.status(200).end();
                    });
                }
                else{
                    return res.status(404).json({ msg: "History data not found"});
                }
            }
            else{
                return res.status(402).json(" msg: History data not found ");
            }
        })
        .catch((error: Error) => {
            console.log(error);
            return res.status(500).json({error:error});
        })
    };


    ////////////////////////////////////////////////////// 6.5 My Ratings API ////////////////////////////////////////////////

    public getSPRatings = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id && req.body.user.userTypeId === 3) {
            return this.spPageService.getSPRatings(req.body.user.id)
                .then(async (rating) => {
                    if (rating) {
                        let ratings = [];
                        for (let star in rating) {
                            let srDetail = await this.spPageService.getServiceRequestDetailById(rating[star].ServiceRequestId)!;
                            const startTime = srDetail?.ServiceStartTime.toString().split(":")!;
                            const endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + srDetail?.ServiceHours! + srDetail?.ExtraHours!).toString().split(".");
                            if (endTime[1]) {
                                endTime[1] = (parseInt(endTime[1]) * 6).toString();
                            }
                            else {
                                endTime[1] = "00";
                            }
                            let uDetail = await db.Users.findOne({ where: { id: rating[star].RatingFrom } });
                            const ratingObj = {
                                ServiceRequestId: rating[star].ServiceRequestId,
                                ServiceStartDate: srDetail?.ServiceStartDate.toString().split("-").reverse().join("-"),
                                Username: uDetail?.firstName + " " + uDetail?.lastName,
                                Comments: rating[star].Comments,
                                Ratings: rating[star].Ratings,
                                ServiceStartTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1]
                            };
                            ratings.push(ratingObj);
                        }
                        return res.status(200).json(ratings);
                    }
                    else {
                        return res.status(404).json({ msg: "Ratings not found" })
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


    ////////////////////////////////////////////////////// 6.6 Block User API ////////////////////////////////////////////////

    public getUserWorkedWithSP = async (req: Request, res: Response): Promise<Response> => {
        if (req.body.user.id) {
            let user = [];
            const serviceProvider = await this.spPageService.getSPServiceHistory(req.body.user.id);
            if (serviceProvider) {
                for (let sp in serviceProvider) {
                    const customer = await this.spPageService.getCustomer(serviceProvider[sp].UserId);
                    if (customer) {
                        user.push({
                            Name: customer.firstName! + " " + customer.lastName!,
                            UserId: customer.id
                        })
                    }
                }
            }
            const userIds = user.map(o => o.UserId)
            const filterArray = user.filter(({ UserId }, index) => !userIds.includes(UserId, index + 1));
            if (filterArray) {
                return res.status(200).json(filterArray);
            }
            else {
                return res.status(404).json({ msg: "User not found" });
            }
        }
        else {
            return res.status(401).json({ msg: "User not found" });
        };
    };

    public createBlockUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (req.body.user.id) {
            req.body.TargetUserId = parseInt(req.params.customerId);
            if (req.body.IsBlocked) {
                let matched = false;
                let user = [];
                const serviceProvider = await this.spPageService.getSPServiceHistory(req.body.user.id);
                if (serviceProvider) {
                    for (let sp in serviceProvider) {
                        const customer = await this.spPageService.getCustomer(serviceProvider[sp].UserId);
                        if (customer) {
                            user.push({
                                Name: customer.firstName! + " " + customer.lastName!,
                                UserId: customer.id
                            });
                        }
                    }
                }
                const userIds = user.map(o => o.UserId)
                const filterArray = user.filter(({ UserId }, index) => !userIds.includes(UserId, index + 1));
                if (filterArray) {
                    for (let us in filterArray) {
                        if (filterArray[us].UserId === parseInt(req.params.customerId)) {
                            matched = true;
                            break;
                        }
                        else {
                            matched = false;
                        }
                    }
                }
                else {
                    matched = false;
                }
                if (matched) {
                    return this.spPageService.getBlockedUser(req.body.user.id, req.params.customerId)
                        .then((blockedCS) => {
                            if (blockedCS && blockedCS.IsBlocked) {
                                return res.status(201).json({ msg: "User already blocked" });
                            }
                            else if (blockedCS && blockedCS.IsBlocked === false) {
                                return this.spPageService.blockUser(req.body.user.id, req.params.customerId)
                                    .then(addBlockCS => {
                                        if (addBlockCS[0] === 1) {
                                            return res.status(200).json({ msg: 'User block successfully' });
                                        }
                                        else {
                                            return res.status(200).json({ msg: 'User cannot block' });
                                        }
                                    })
                                    .catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({ error: error });
                                    });
                            }
                            else {
                                req.body.UserId = req.body.user.id;
                                req.body.IsFavorite = false;
                                return this.spPageService.createBlockUser(req.body)
                                    .then(blockUser => {
                                        if (blockUser) {
                                            return res.status(200).json(blockUser);
                                        }
                                        else {
                                            return res.status(404).json({ msg: "Cannot block user" });
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
                        });
                }
                else {
                    return res.status(400).json({ message: 'helper has not worked for this customer' });
                }
            }
            else {
                next();
            }
        }
        else {
            return res.status(404).json({ msg: "User not found" });
        }
    };

    public unBlockUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        if (req.body.IsBlocked === false) {
            return this.spPageService.getBlockedUser(req.body.user.id, req.params.customerId)
                .then(blockUser => {
                    if (blockUser && blockUser.IsBlocked) {
                        return this.spPageService.unBlockUser(req.body.user.id, req.params.customerId)
                            .then(updateBlockCS => {
                                if (updateBlockCS[0] === 1) {
                                    return res.status(200).json({ message: 'User block successfully' });
                                }
                                else {
                                    return res.status(422).json({ message: 'Cannot block user' });
                                }
                            })
                            .catch((error: Error) => {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            })

                    }
                    else if (blockUser && blockUser.IsBlocked === false) {
                        return res.status(201).json({ message: 'User is already in unblock mode' })
                    }
                    else {
                        return res.status(404).json({ message: 'no customer in blocklist to unblock' });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    };


    ////////////////////////////////////////////////////// 6.7 My settings API ////////////////////////////////////////////////

    public getUserDetailById = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.body.user.id;
        if (userId && req.body.user.userTypeId == 3) {
            return this.spPageService
                .getSPaddress(userId)
                .then((userDetail) => {
                    if (userDetail) {
                        return this.spPageService.getSPDetailById(userDetail.UserId)
                            .then((detail) => {
                                if (userId === detail?.id) {
                                    return res.status(200).json({ detail });
                                }
                                else {
                                    return res.status(404).json({ msg: "User detail not found" });
                                }
                            })
                    } else {
                        return res.status(404).json({ message: 'User not found' });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(400).json({ message: 'user not found' });
        }
    };

    public updateMyDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response|void> => {
        if (req.body.user.id) {
            req.body.dateOfBirth = this.spPageService.convertStringtoDate(req.body.dateOfBirth);
            return this.spPageService.updateMyDetails(req.body, req.body.user.id)
                .then((user) => {
                    if (!user) {
                        return res.status(401).json({ msg: "Error!! while updating detail" });
                    }
                    else {
                        next();
                    }
                })
                .catch((error: Error) => {
                    return res.status(500).json({ error: error });
                });
        }
        else {
            return res.status(400).json({ msg: "User not found" });
        }
    };

    public updateAddMyAddress = async(req: Request, res: Response, next: NextFunction):Promise<Response> => {
        const userId = req.body.user.id;
        if(userId && req.body.user.userTypeId === 3){
            return this.spPageService.getSPaddress(userId)
            .then(spAddress => {
                if(spAddress){
                    return this.spPageService.updateAddMyAddress(req.body,spAddress.AddressId)
                    .then(newSPAddress => {
                        if(newSPAddress){
                            return res.status(200).json({ msg: "Address Updated"});
                        }
                        else{
                            return res.status(402).json({msg: " Error!! cannot updated your address"});
                        }
                    })
                    .catch((error:Error) => {
                        console.log(error);
                        return res.status(500).json({error:error});
                    });
                }
                else{
                    return this.spPageService.createNewAddress(userId,req.body)
                    .then(spAddress => {
                        if(spAddress){
                            return res.status(200).json({spAddress, msg: "Address added successfully"});
                        }
                        else{
                            return res.status(404).json({msg: "Error!! Cannot create or add address"});
                        }
                    })
                    .catch((error:Error) => {
                        console.log(error);
                        return res.status(500).json({error:error});
                    })
                }
            })
            .catch((error:Error) => {
                console.log(error);
                return res.status(500).json({error:error});
            })
        }
        else{
            return res.status(404).json({msg: "User not found"});
        }
    }

    public changeSPPassword = async (req: Request, res: Response): Promise<Response> => {
        return this.spPageService.changePassById(req.body.user.id)
            .then(async (user) => {
                if (!user) {
                    return res.status(400).json({ msg: "User not found" });
                };
                const passMatch = await bcrypt.compare(req.body.oldPassword, user.password!);
                if (!passMatch) {
                    return res.status(404).json({ msg: "Incorrect Password! Please Enter correct password" });
                }
                else {
                    const newPassword = req.body.newPassword;
                    const cpassword = req.body.cpassword;
                    if (!(newPassword === cpassword)) {
                        return res.status(400).json({ msg: "Please Enter same password" });
                    }
                    else {
                        user.password = await bcrypt.hash(req.body.newPassword, 10);
                        return this.spPageService.changeSPPassword(user.password, req.body.user.id)
                            .then((user) => {
                                return res.status(200).json({ msg: "Password change successfully" });
                            })
                            .catch((error: Error) => {
                                return res.status(500).json(error);
                            });
                    }
                }
            })
            .catch((error: Error) => {
                return res.status(500).json(error);
            })
    }

}