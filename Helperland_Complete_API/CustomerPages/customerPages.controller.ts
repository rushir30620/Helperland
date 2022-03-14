import { ServiceRequest } from "../models/servicerequest";
import { NextFunction, Request, Response } from "express";
import { CustomerPageService } from "./customerPages.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import db from "../models";
import { Rating } from "../models/rating";

export class CustomerPageController {
    public constructor(private readonly customerPageService: CustomerPageService) {
        this.customerPageService = customerPageService;
    }

    //////////////////////////////// 5.1 Dashboard APIs ///////////////////////////////////////

    public getServiceRequest = async (req: Request, res: Response): Promise<Response> => {
        return this.customerPageService.getServiceRequest(req.body.user.id)
            .then((customer: ServiceRequest[] | null) => {
                if (!customer) {
                    return res.status(404).json({ error: "No Service Request Found" });
                }
                else {
                    return res.status(200).json({ customer });
                }
            })
            .catch((error: Error) => {
                return res.status(500).json({ error: error });
            });
    };

    public getServiceAddress = async (req: Request, res: Response): Promise<Response> => {
        return this.customerPageService.getServiceAddress(+req.params.addressId)
            .then((customer) => {
                if (!customer) {
                    return res.status(401).json({ msg: "No service address found!" });
                }
                else {
                    return this.customerPageService.getServiceRequestById(customer.ServiceRequestId)
                        .then(serviceRequest => {
                            if (+req.params.addressId === serviceRequest?.ServiceRequestId) {
                                return res.status(200).json({ serviceRequest, customer});
                            }
                            else {
                                return res.status(404).json({ msg: "No service request found" })
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

    public rescheduleTimeandDate = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        const serviceId = req.params.serviceId;
        const isGreater = this.customerPageService.compareDateWithCurrentDate(req.body.ServiceStartDate);
        if (isGreater) {
          if (req.body.user.userTypeId === 4) {
            return this.customerPageService
              .getServiceRequestById(parseInt(serviceId))
              .then((serviceRequest) => {
                if (serviceRequest) {
                  req.body.totalHour =
                    serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                  req.body.helperId = serviceRequest.ServiceProviderId;
                  if (serviceRequest.UserId === req.body.user.id) {
                    if (serviceRequest.ServiceProviderId) {
                      req.body.spId = serviceRequest.ServiceProviderId;
                      return this.customerPageService
                        .getAllServiceRequestOfHelper(serviceRequest.ServiceProviderId)
                        .then(async (serviceRequest) => {
                          if (serviceRequest) {
                           
                            const { srDate, matched, startTime, endTime } =
                              await this.customerPageService.helperHasFutureSameDateAndTime(
                                req.body.ServiceStartDate,
                                serviceRequest,
                                req.body.totalHour,
                                req.body.ServiceStartTime
                              );
                            if (matched) {
                              return res.status(200).json({
                                  message:
                                    "Another service request has been assigned to the service provider on " + srDate +" from " + startTime +
                                    " to " + endTime +". Either choose another date or pick up a different time slot.",
                                });
                            } else {
                              next();
                            }
                          } else {
                            next();
                          }
                        })
                        .catch((error: Error) => {
                          console.log(error);
                          return res.status(500).json({
                            error: error,
                          });
                        });
                    } else {
                      next();
                    }
                  } else {
                    return res.status(404).json({ message: "No data found" });
                  }
                } else {
                  return res.status(404).json({ message: "Service request not found" });
                }
              })
              .catch((error: Error) => {
                console.log(error);
                return res.status(500).json({
                  error: error,
                });
              });
          } else {
            return res.status(401).json({ message: "Unauthorised User" });
          }
        } else {
          return res.status(400).json({ message: "Enter future date for reschedule service request" });
        }
    };

    public rescheduleIfTimeSlotNotConflicts = async (req: Request, res: Response): Promise<Response | void> => {
        const d: string = req.body.ServiceStartDate;
        const date = d.split("-").reverse().join("-");
        const { spId } = req.body.helperId;
        if (req.params.serviceId) {
          return this.customerPageService
            .rescheduleTimeandDate(new Date(date),req.body.time,parseInt(req.params.serviceId))
            .then((serviceRequest) => {
              if (serviceRequest.length > 0) {
                if (spId) {
                  return this.customerPageService
                    .getHelperById(spId)
                    .then((helper) => {
                      if (helper?.email) {
                        const transporter = nodemailer.createTransport({
                            service: process.env.SERVICE,
                            auth: {
                                user: process.env.USER,
                                pass: process.env.PASS,
                            },
                        });
                        const mailOptions = this.customerPageService.mailData(
                          d,
                          req.body.ServiceStartTime,
                          helper.email,
                          req.params.serviceId
                        );
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                res.status(404).json({
                                    error: error,
                                    message: "Email cannot be sent.."
                                });
                            }
                        });
                        return res.status(200).json({
                            message: "sevice request reschedule successfully",
                          });
                      } else {
                        return res.status(404).json({ message: "helper not found" });
                      }
                    })
                    .catch((error: Error) => {
                      console.log(error);
                      return res.status(500).json({
                        error: error,
                      });
                    });
                }
                return res.status(200).json({ message: "sevice request reschedule successfully" });
              } else {
                return res.status(422).json({ message: "error in rescheduling service request" });
              }
            })
            .catch((error: Error) => {
              console.log(error);
              return res.status(500).json({
                error: error,
              });
            });
        } else {
          return res.status(404).json({ message: "service request id not found" });
        }
    };
    

    public cancelService = async (req: Request, res: Response): Promise<Response> => {
        const serviceRequest = +req.params.id;
        if (serviceRequest) {
            return this.customerPageService.getServiceRequestById(+req.params.id)
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

    //////////////////////////////// 5.2 Service History APIs ///////////////////////////////////////

    public getServiceHistory = async (req: Request, res: Response): Promise<Response> => {
        return this.customerPageService.getServiceHistory(req.body.user.id)
            .then((customer: ServiceRequest[] | null) => {
                if (!customer) {
                    return res.status(404).json({ error: "No Service Request Found" });
                }
                else {
                    return res.status(200).json({ customer });
                }
            })
            .catch((error: Error) => {
                return res.status(500).json({ error: error });
            });
    };

    public rateSP = async (req: Request, res: Response): Promise<Response> => {
        if (!req.body.user.id) {
            return res.status(301).json({ msg: "Please Login" });
        }
        else {
            req.body.Ratings = (req.body.OnTimeArrival + req.body.Friendly + req.body.QualityOfService) / 3;
            return this.customerPageService.getUserWithId(req.body.user.id)
                .then((user) => {
                    if (user) {
                        if (user.userTypeId === 4) {
                            req.body.RatingFrom = user.id;
                        }
                        else {
                            return res.status(301).json({ msg: "Please use your user account" });
                        }
                    }
                    else {
                        return res.status(301).json({ msg: "User not found" });
                    }
                    return this.customerPageService.getServiceRequestById(+req.params.serviceRequestId)
                        .then((serviceRequest) => {
                            if (serviceRequest) {
                                req.body.ServiceRequestId = +req.params.serviceRequestId;
                                req.body.RatingTo = serviceRequest.ServiceProviderId;
                            }
                            else {
                                return res.status(301).json({ msg: "No Service Request" });
                            }
                            return this.customerPageService.rateSP(req.body)
                                .then((rating: Rating) => {
                                    if (rating) {
                                        return res.status(200).json({ rating });
                                    }
                                    return res.status(301).json({ msg: "No Rating" });
                                })
                                .catch((error: Error) => {
                                    return res.status(501).json({ error: error });
                                });
                        })
                        .catch((error: Error) => {
                            return res.status(502).json({ error: error });
                        });
                })
                .catch((error: Error) => {
                    return res.status(503).json({ error: error });
                });
        }

    };

    //////////////////////////////// 5.4 My Settings APIs ///////////////////////////////////////

    public getUserDetailById = async (req: Request, res: Response): Promise<Response> => {
        const userId = +req.body.userId;
        if (userId && req.body.userTypeId === 4) {
          return this.customerPageService
            .getUserDetailById(userId)
            .then((userDetail) => {
              if(userDetail){
                return res.status(200).json(userDetail);
              }else{
                return res.status(404).json({message:'User not found'});
              }
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).json({ error: error });
            });
        }
        else{
          return res.status(400).json({message:'user not found'});
        }
      };

    public updateMyDetails = async (req: Request, res: Response): Promise<Response> => {
        return this.customerPageService.updateMyDetails(req.body, req.body.user.id)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ msg: "User not found" });
                }
                else {
                    return res.status(200).json({ user, msg: "Your detail updated successfully" });
                }
            })
            .catch((error: Error) => {
                return res.status(500).json({ error: error });
            });
    };

    public getUserAddressesById = async(req:Request, res: Response):Promise<Response> => {
          return this.customerPageService.getUserAddressesById(req.body.user.id)
          .then(userAddresses => {
            if(userAddresses){
              return res.status(200).json({userAddresses});
            }else{
              return res.status(404).json({message:'Address not found'});
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: error });
          })
      };

    public updateMyAddresses = async (req: Request, res: Response): Promise<Response> => {
        req.body.Addressline1 = req.body.StreetName;
        req.body.Addressline2 = req.body.HouseNumber;
        return this.customerPageService.updateMyAddresses(req.body, +req.params.id)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ msg: "User not found" });
                }
                else {
                  
                    return res.status(200).json({ user, msg: "Your detail updated successfully" });
                }
            })
            .catch((error: Error) => {
                return res.status(500).json({ error: error });
            });
    };

    public deleteUserAddress = async(req: Request, res: Response):Promise<Response> => {
        if(+req.params.addressId){
          return this.customerPageService.deleteUserAddress(req.params.addressId, req.body.user.id)
          .then(deletedAddress => {
            if(deletedAddress){
              if(deletedAddress[0] === 1){
                return res.status(200).json({message:'address deleted successfully'});
              }else{
                return res.status(404).json({message:'error in deleting address'});
              }
            }else{
              return res.status(404).json({message:'error in deleting address'});
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: error });
          });
        }else{
          return res.status(400).json({message:'proper input not found in request'});
        }
      };

    public addNewAddress = async (req: Request, res: Response) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, process.env.JWT_KEY!, (err, user: any) => {
                if (err) {
                    return res.status(403).json({ msg: "Invalid Token" });
                }
                else {
                    req.body.email = user.email;
                    req.body.PostalCode = user.postalcode;
                    return this.customerPageService.getUserWithEmail(user.email)
                        .then(user => {
                            if (user) {
                                req.body.UserId = user.id;
                                return this.customerPageService.addNewAddress(req.body)
                                    .then(address => {
                                        return res.status(403).json({ message: "Address Added Successfully!!" });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        return res.status(500).json({
                                            error: error,
                                        });
                                    })
                            }
                            else {
                                return res.status(403).json({ message: "user not found" });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        });
                };
            });
        };
    };

    public changePassword = async (req: Request, res: Response): Promise<Response> => {
        return this.customerPageService.changePassById(req.body.user.id)
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
                        return this.customerPageService.changePassword(user.password, req.body.user.id)
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