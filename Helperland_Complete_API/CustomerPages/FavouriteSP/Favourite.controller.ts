import { NextFunction, Request, Response } from "express";
import { FavouriteSPService } from "./FavouriteSP.service";
import nodemailer from "nodemailer";

require("dotenv").config();

export class FavouriteSPController{
    public constructor(private readonly favouriteSPService: FavouriteSPService){
        this.favouriteSPService = favouriteSPService;
    }

    public getSPworkedwithUser = async(req: Request, res: Response): Promise<Response> => {
        if(req.body.user.id && req.body.user.userTypeId === 4){
            return this.favouriteSPService.getAllServiceRequest(req.body.user.id)
            .then((serviceRequest) => {
                const spId: number[] = [];
                for(let sr in serviceRequest){
                    if(serviceRequest[sr].Status === 3 && serviceRequest[sr].ServiceProviderId != null){
                        spId.push(serviceRequest[sr].ServiceProviderId);
                    }
                }
                if(spId.length > 0) {
                    return this.favouriteSPService.getSPworkedwithUser(spId)
                    .then((serviceProviders) => {
                        if(serviceProviders && serviceProviders.length > 0){
                            return res.status(200).json(serviceProviders);
                        }
                        else{
                            return res.status(404).json({msg: "No Service Provider Worked With Customer"});
                        }
                    })
                    .catch((error: Error) => {
                        console.log(error);
                        return res.status(500).json({ error: error});
                    });
                }
                else{
                    return res.status(404).json({msg: "No Service Provider Worked With Customer"});
                }
            })
            .catch((error: Error) => {
                console.log(error);
                return res.status(500).json({ error: error});
            });
        }
        else{
            return res.status(401).json({msg: "User not found"});
        }
    };

    public createFavouriteSP = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId = parseInt(req.body.user.id);
        const spId = parseInt(req.params.spId);

        if(req.body.user.id && req.body.user.userTypeId === 4){
            req.body.UserId = userId;
            req.body.TargetUserId = spId;
            return this.favouriteSPService.getAllServiceRequest(req.body.user.id)
            .then((serviceRequest) => {
                const spIds: number[] = [];
                for(let sr in serviceRequest){
                    if(serviceRequest[sr].Status === 3 && serviceRequest[sr].ServiceProviderId != null){
                        spIds.push(serviceRequest[sr].ServiceProviderId);
                    }
                }
                if(spIds.length > 0){
                    const isAvailable = spIds.includes(parseInt(req.params.spId));
                    if(isAvailable && req.body.IsFavorite){
                        return this.favouriteSPService.getFavouriteSP(userId, spId)
                        .then((favourite) => {
                            if(favourite){
                                if(favourite.IsFavorite){
                                    return res.status(402).json({msg: "Service Provider already in your favourite list"});
                                }
                                else{
                                    return this.favouriteSPService.updateFavouriteSP(req.body)
                                    .then((favourite) => {
                                        if(favourite){
                                            return res.status(201).json({msg: "Service Provider Favourite Status updated successfully"});
                                        }
                                        else{
                                            return res.status(403).json({msg: "Error!!! Service Provider cannot add your favourite list"});
                                        }
                                    })
                                    .catch((error:Error) => {
                                        console.log(error);
                                        return res.status(500).json({error:error});
                                    });
                                }
                            }
                            else{
                                req.body.IsBlocked = false;
                                return this.favouriteSPService.createFavouriteSP(req.body)
                                .then((favouritesp) => {
                                    if(favouritesp){
                                        return res.status(200).json({msg: "Service Provider added your favourite list successfully"})
                                    }
                                    else{
                                        return res.status(402).json({msg: "Error!! while added service provider in your favourite list"});
                                    }
                                })
                                .catch((error:Error) => {
                                    console.log(error);
                                    return res.status(500).json({error:error});
                                });
                            }
                        })
                        .catch((error:Error) => {
                            console.log(error);
                            return res.status(500).json({error:error});
                        });
                    }
                    else if(req.body.IsFavorite === false){
                        next();
                    }
                    else{
                        return res.status(404).json({ message: "Please enter valid input" });
                    }
                }
                else{
                    return res.status(404).json({msg: "No Service Provider Worked With Customer"})
                }
            })
            .catch((error:Error) => {
                console.log(error);
                return res.status(500).json({error:error});
            });
        }
        else{
            return res.status(404).json({msg: "User not found"});
        }
    };

    public Unfavourite = async(req: Request, res: Response): Promise<Response> => {
        return this.favouriteSPService.getFavouriteSP(req.body.user.id, req.body.TargetUserId)
        .then((favouriteSP) => {
            if(favouriteSP && favouriteSP.IsFavorite){
                return this.favouriteSPService.updateFavouriteSP(req.body)
                .then((isFavourite) => {
                    if(isFavourite){
                        return res.status(201).json({msg: "Service Provider UnFavourite Status updated successfully"});
                    }
                    else{
                        return res.status(401).json({msg: "Error!!! Service Provider cannot add your unfavourite list"});
                    }
                })
                .catch((error:Error) => {
                    console.log(error);
                    return res.status(500).json({error:error});
                });
            }
            else if(favouriteSP?.IsFavorite === false){
                return res.status(402).json({msg: "Service Provider already in your Unfavourite list"});
            }
            else{
                return res.status(404).json({msg: "No Service Provider to remove from favourite list"});
            }
        })
        .catch((error:Error) => {
            console.log(error);
            return res.status(500).json({error:error});
        });
    };

    public blockSP = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId = parseInt(req.body.user.id);
        const spId = parseInt(req.params.spId);

        if(req.body.user.id && req.body.user.userTypeId === 4){
            req.body.UserId = userId;
            req.body.TargetUserId = spId;
            return this.favouriteSPService.getAllServiceRequest(req.body.user.id)
            .then((serviceRequest) => {
                const spIds: number[] = [];
                for(let sr in serviceRequest){
                    if(serviceRequest[sr].Status === 3 && serviceRequest[sr].ServiceProviderId != null){
                        spIds.push(serviceRequest[sr].ServiceProviderId);
                    }
                }
                if(spIds.length > 0){
                    const isAvailable = spIds.includes(parseInt(req.params.spId));
                    if(isAvailable && req.body.IsBlocked){
                        return this.favouriteSPService.getFavouriteSP(userId, spId)
                        .then((favourite) => {
                            if(favourite){
                                if(favourite.IsBlocked){
                                    return res.status(402).json({msg: "Service Provider already in your block list"});
                                }
                                else{
                                    return this.favouriteSPService.updateFavouriteSP(req.body)
                                    .then((favourite) => {
                                        if(favourite){
                                            return res.status(201).json({msg: "Service Provider Block Status updated successfully"});
                                        }
                                        else{
                                            return res.status(403).json({msg: "Error!!! Service Provider cannot add your block list"});
                                        }
                                    })
                                    .catch((error:Error) => {
                                        console.log(error);
                                        return res.status(500).json({error:error});
                                    });
                                }
                            }
                            else{
                                req.body.IsFavorite = false;
                                return this.favouriteSPService.createFavouriteSP(req.body)
                                .then((blocksp) => {
                                    if(blocksp){
                                        return res.status(200).json({msg: "Service Provider added your block list successfully"})
                                    }
                                    else{
                                        return res.status(403).json({msg: "Error!! while added service provider in your block list"});
                                    }
                                })
                                .catch((error:Error) => {
                                    console.log(error);
                                    return res.status(500).json({error:error});
                                });
                            }
                        })
                        .catch((error:Error) => {
                            console.log(error);
                            return res.status(500).json({error:error});
                        });
                    }
                    else if(req.body.IsBlocked === false){
                        next();
                    }
                    else{
                        return res.status(404).json({ message: "Please enter valid input" });
                    }
                }
                else{
                    return res.status(404).json({msg: "No Service Provider Worked With Customer"})
                }
            })
            .catch((error:Error) => {
                console.log(error);
                return res.status(500).json({error:error});
            });
        }
        else{
            return res.status(404).json({msg: "User not found"});
        }
    };

    public Unblock = async(req: Request, res: Response): Promise<Response> => {
        return this.favouriteSPService.getFavouriteSP(req.body.user.id, req.body.TargetUserId)
        .then((blockedSP) => {
            if(blockedSP && blockedSP.IsBlocked){
                return this.favouriteSPService.updateFavouriteSP(req.body)
                .then((isBlocked) => {
                    if(isBlocked){
                        return res.status(201).json({msg: "Service Provider UnBlock Status updated successfully"});
                    }
                    else{
                        return res.status(403).json({msg: "Error!!! Service Provider cannot add your unblock list"});
                    }
                })
                .catch((error:Error) => {
                    console.log(error);
                    return res.status(500).json({error:error});
                });
            }
            else if(blockedSP?.IsBlocked === false){
                return res.status(402).json({msg: "Service Provider already in your UnBlock list"});
            }
            else{
                return res.status(404).json({msg: "No Service Provider to remove from block list"});
            }
        })
        .catch((error:Error) => {
            console.log(error);
            return res.status(500).json({error:error});
        });
    };

}