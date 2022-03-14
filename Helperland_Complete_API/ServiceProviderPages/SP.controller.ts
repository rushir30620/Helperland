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
                            console.log(sp.zipCode);
                            if (sp.zipCode == null) {
                                return res.status(404).json({ message: "Zipcode not found!! Please add zipCode in your profile"});
                            } 
                            else {
                                console.log("hello");
                                return this.spPageService.getServiceRequestByZipcode(sp.zipCode!, req.body.user.id)
                                    .then(async (serviceRequests) => {
                                        console.log(serviceRequests);
                                        if (serviceRequests) {
                                            console.log("hellog");
                                            const sRequests = await this.spPageService.filterServiceRequestsCompatibleWithHelper(
                                                    req.body.PetsAtHome,
                                                    serviceRequests
                                                );
                                            if (sRequests) {
                                                console.log(sRequests);
                                                const requestDetail = await this.spPageService.displayRequestDetail(sRequests);
                                                return res.status(200).json(requestDetail);
                                            } 
                                            else {
                                                return res.status(404).json({ message: "service requests not found" });
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
        console.log(req.params.serviceRequestId);
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
                                                console.log(data);
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
        console.log(req.params.serviceRequestId);
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
                    const serviceArray:ServiceRequest[] = [];
                    const currentDate = new Date(moment(new Date()).format("YYYY-MM-DD"));
                    if (services) {
                        for (let service in services) {
                            let serviceDate = new Date(services[service].ServiceStartDate);
                            console.log(serviceDate);
                            if (currentDate < serviceDate) {
                                continue;
                            }
                            serviceArray.push(services[service]);
                        }
                        return res.status(200).json({serviceArray});
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
        const serviceRequest = req.params.serviceRequestId;
        if (serviceRequest) {
            return this.spPageService.getServiceRequestById(req.params.serviceRequestId)
                .then(async (customer) => {
                    if (!customer) {
                        return res.status(404).json({ msg: "Service Request Not Found" });
                    }
                    else {
                        const customerObj = {
                            ServiceRequestId: customer.ServiceRequestId,
                            ServiceId: customer.ServiceId,
                            ServiceStartDate: customer.ServiceStartDate,
                            ServiceStartTime: customer.ServiceStartTime,
                            ZipCode: customer.ZipCode,
                            ServiceHourlyRate: customer.ServiceHourlyRate,
                            ServiceHours: customer.ServiceHours,
                            ExtraHours: customer.ExtraHours,
                            SubTotal: customer.SubTotal,
                            Discount: customer.Discount,
                            TotalCost: customer.TotalCost,
                            Comments: req.body.Comments,
                            PaymentTransactionRefNo: customer.PaymentTransactionRefNo,
                            PaymentDue: customer.PaymentDue,
                            SPAcceptedDate: customer.SPAcceptedDate,
                            HasPets: customer.HasPets,
                            Status: 4,
                            ModifiedBy: customer.ModifiedBy,
                            RefundedAmount: customer.RefundedAmount,
                            Distance: customer.Distance,
                            HasIssue: customer.HasIssue,
                            PaymentDone: customer.PaymentDone,
                            RecordVersion: customer.RecordVersion,
                            UserId: customer.UserId,
                            ServiceProviderId: customer.ServiceProviderId
                        }
                        const result = await db.ServiceRequest.update(customerObj, { where: { ServiceRequestId: serviceRequest } });

                        if (result) {
                            return res.status(200).json({ customerObj });
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

    public updateMyDetails = async (req: Request, res: Response): Promise<Response> => {
        return this.spPageService.updateMyDetails(req.body, req.body.user.id)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ msg: "User not found" });
                }
                else {
                    return this.spPageService.getSPaddress(req.body.user.id)
                        .then(async userAddress => {
                            const userAddressObj = {
                                AddressId: userAddress?.AddressId,
                                UserId: userAddress?.UserId,
                                Addressline1: req.body.StreetName,
                                Addressline2: req.body.HouseNumber,
                                City: req.body.City,
                                State: userAddress?.State,
                                PostalCode: req.body.PostalCode,
                                IsDefault: userAddress?.IsDefault,
                                IsDeleted: userAddress?.IsDeleted,
                                Email: userAddress?.Email,
                                Mobile: userAddress?.Mobile
                            }
                            const result = await db.UserAddress.update(userAddressObj, { where: { UserId: req.body.user.id } })
                            if (result) {
                                return res.status(200).json({ userAddressObj, msg: "Your detail updated successfully" });
                            }
                            else {
                                return res.status(404).json({ msg: "User detail not found" });
                            }
                        })
                        .catch((error: Error) => {
                            return res.status(500).json({ error: error });
                        });
                }
            })
            .catch((error: Error) => {
                return res.status(500).json({ error: error });
            });
    };

    public changePassword = async (req: Request, res: Response): Promise<Response> => {
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
                        return this.spPageService.changePassword(user.password, req.body.user.id)
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