import { NextFunction, Request, Response } from "express";
import { ServiceBook } from "./bookservice.service";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
require('dotenv').config();
import { UserAddress } from "../models/useraddress";
import db from "../models";

export class ServiceBookController {
    public constructor(private readonly serviceBook: ServiceBook) {
        this.serviceBook = serviceBook;
    }

    public serviceSetup = async (req: Request, res: Response): Promise<Response> => {
        let zipCode = [];
        if (!req.body.postalcode) {
            return res.status(301).json({
                msg: "Please Enter Zipcode"
            });
        }
        else {
            return this.serviceBook.getAllServiceProvider()
                .then((serviceProviders) => {
                    let isPresent = false;
                    if (serviceProviders.length > 0) {
                        for (let sp in serviceProviders) {
                            // console.log(req.body.postalcode);
                            if (serviceProviders[sp].zipCode == req.body.postalcode) {
                                isPresent = true;
                            }
                        }
                        console.log(isPresent);
                        if (isPresent === true) {
                            jwt.verify(req.headers.authorization!, process.env.JWT_KEY!, (err, user: any) => {
                                if (err) {
                                    return res.status(403).json({ msg: "Invalid Token" });
                                }
                                else {
                                    const userEmail = user.email;
                                    const postalcode = req.body.postalcode;
                                    const token = this.serviceBook.createToken(req.body.user, postalcode);
                                    return res.status(200).cookie("token", token, { httpOnly: true });
                                }
                            });
                            return res.status(200).json({ msg: "Service Provider Found" });
                        }
                        else {
                            return res.status(301).json({ msg: "We are not providing service in this area. We will notify you if any helper would start working near your area." });
                        }
                    }
                    else {
                        return res.status(301).json({ msg: "No Service Provider Present." });
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    return res.status(500).json({ error: error });
                });
        }
    };

    public tokenDecode = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, process.env.JWT_KEY!, (err, user: any) => {
                if (err) {
                    return res.status(403).json({ msg: "Invalid Token" });
                }
                else {
                    console.log(user);
                    req.body.ZipCode = user.postalcode;
                    req.body.email = user.email;
                    return this.serviceBook.getUserWithEmail(user.email)
                        .then(user => {
                            // console.log(user?.userTypeId);
                            const abc = user?.userTypeId;
                            console.log(abc);
                            if (abc == 4) {
                                next();
                            }
                            else {
                                return res.status(301).json({ message: 'Please Use Your User Account!!' });
                            }
                        })
                        .catch((error: Error) => {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        });
                }
            });
        }
        else {
            return res.status(301).json('Token is not available');
        };
    };

    public createScheduleRequest = async (req: Request, res: Response) => {
        let serviceProviderList: string[] = [];
        const token = req.headers.authorization;
        req.body.ServiceHourlyRate = 18;
        req.body.ExtraHours = req.body.ExtraService.length * 0.5;
        req.body.SubTotal = req.body.ServiceHourlyRate * req.body.ServiceHours;
        req.body.TotalCost = req.body.ExtraService.length * 9 + req.body.SubTotal;
        req.body.ServiceRequestAddress.email = req.body.email;
        return this.serviceBook.getUserWithEmail(req.body.user.email)
            .then(user => {
                if (user) {
                    if (user.userTypeId === 4) {
                        req.body.UserId = user.id;
                        req.body.ModifiedBy = user.id;
                    }
                    else {
                        return res.status(301).json({ msg: "Please Use Your User Account!!" });
                    }
                }
                else {
                    return res.status(301).json("User not found");
                }
                return this.serviceBook.createScheduleRequestWithAddress(req.body)
                    .then(async request => {
                        if (request) {
                            return this.serviceBook.getServiceProvider(request.ZipCode)
                                .then(async (user) => {
                                    if (user.length > 0) {
                                        for (let sp in user) {
                                            serviceProviderList.push(user[sp].email!);
                                        }
                                        for (let sp in serviceProviderList) {
                                            const transporter = nodemailer.createTransport({
                                                service: process.env.SERVICE,
                                                auth: {
                                                    user: process.env.USER,
                                                    pass: process.env.PASS,
                                                },
                                            });

                                            const mailOptions = this.serviceBook.mailData(serviceProviderList[sp]);
                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    res.status(404).json({
                                                        error: error,
                                                        message: "Email cannot be sent.."
                                                    });
                                                }
                                            });
                                        }
                                        return res.status(200).json({ message: "Booking has been successfully submitted!!" });
                                    }
                                    else {
                                        return res.status(404).json({ message: "User Not Found" });
                                    }
                                })
                                .catch((error: Error) => {
                                    console.log(error);
                                    return res.status(500).json({
                                        error: error,
                                    });
                                });
                            }
                            else{
                                return res.status(500).json({ message: "Something went wrong"});
                            }
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        return res.status(500).json({
                            error: error,
                        });
                    });
            })
            .catch((error: Error) => {
                console.log(error);
                return res.status(500).json({
                    error: error,
                });
            });
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
                    return this.serviceBook.getUserWithEmail(user.email)
                        .then(user => {
                            if (user) {
                                req.body.UserId = user.id;
                                return this.serviceBook.addNewAddress(req.body)
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

    public getExistingAddress = async (req: Request, res: Response): Promise<Response | undefined> => {
        let existingAddress: UserAddress[] = [];
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, process.env.JWT_KEY!, (error, user: any) => {
                if (error) {
                    return res.status(403).json({ msg: "Invalid Token" });
                }
                else {
                    return this.serviceBook.getUserWithEmail(user.email)
                        .then(userWithEmail => {
                            if (userWithEmail) {
                                return this.serviceBook.getUserWithAddress(userWithEmail.id)
                                    .then((users) => {
                                        if (users.length > 0) {
                                            for (let us in users) {
                                                if (users[us].PostalCode === user.postalcode) {
                                                    existingAddress.push(users[us]);
                                                }
                                            }
                                            if (existingAddress.length > 0) {
                                                return res.status(200).json(existingAddress);
                                            }
                                            else {
                                                return res.status(404).json({ msg: "Address Not Found" });
                                            }
                                        }
                                        else {
                                            return res.status(301).json({ msg: "Address Not Available!! Please add new address" });
                                        }
                                    })
                                    .catch((error: Error) => {
                                        console.log(error);
                                        return res.status(500).json({
                                            error: error,
                                        });
                                    });
                            }
                            else {
                                return res.status(301).json("User not found");
                            }
                        })
                        .catch((error: Error) => {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        });
                }
            });
        }
        else {
            return res.status(301).json({ message: "Token not available" });
        }
    };

    public getFavoriteAndBlockedSP = async (req: Request, res: Response): Promise<Response | undefined> => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, process.env.JWT_KEY!, (error, user: any) => {
                if (error) {
                    return res.status(403).json({ message: "Invalid token" });
                } else {
                    return this.serviceBook.getUserWithEmail(user.email)
                        .then(user => {
                            if (user === null) {
                                return res.status(404).json({ message: "user not found" });
                            } else {
                                return this.serviceBook.getFavoriteAndBlockedSP(user.id)
                                    .then(async user => {
                                        let serviceProvider = [];
                                        if (user === null) {
                                            return res.status(404).json({ message: "user not found" });
                                        } else {
                                            let favoriteSP = await this.serviceBook.getTargetUser(user);
                                            if (favoriteSP.length > 0) {
                                                return this.serviceBook.getUserWithId(favoriteSP)
                                                    .then(helper => {
                                                        return res.status(200).json(helper);
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                        return res.status(500).json({
                                                            error: error,
                                                        });
                                                    })
                                            } else {
                                                return res.status(404).json({ message: "favorite helper not found" });
                                            }
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        return res.status(500).json({
                                            error: error,
                                        });
                                    });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        })
                }
            });
        } else {
            return res.status(301).json({ message: "token not found" });
        }
    };
}