import { User } from "../models/user";
import { Request, Response } from "express";
import { forgotPassService } from "./forgot.pass.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { db } from "../models";
require('dotenv').config();

export class forgotPassController{
    public constructor(private readonly forgotPassService: forgotPassService){
        this.forgotPassService = forgotPassService;
    }

    public forgotPass = async(req: Request, res: Response): Promise<Response> => {
        const userEmail: string = req.body.email;
        if(userEmail){
            return this.forgotPassService.forgotPass(userEmail)
            .then(async (user) => {
                if(!user){
                    return res.status(400).json({
                        message: "User with given email doesn't exist"
                    });
                };
                const userId = user.id;
                let token = jwt.sign({userId}, process.env.FORGOT_PASS_KEY!,{expiresIn:'20m'});
                const transporter = nodemailer.createTransport({
                    service: process.env.SERVICE,
                    auth: {
                        user: process.env.USER,
                        pass: process.env.PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.USER,
                    to: user.email,
                    subject: "Account Verification",
                    html: `<h3>Kindly click on the below link to reset your password
                            <p>${process.env.URL}/reset-Password/${token}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) {
                        res.status(404).json({
                            errror: error,
                            meassage: "Email cannot be sent..."
                        });
                    }
                    else{
                        if(info.response.includes("OK")){
                            console.log("Email sent");
                            return res.status(200).json({
                                msg: "Email sent successfully !"
                            });
                        }
                    }
                })
                return res.status(200).json({ msg: "Password reset link successfully sent to your email account"});
            })
            .catch((error: Error) => {
                console.log(error);
                return res.status(500).json({
                    error: error
                });
            });
        }
        else{
            return res.status(400).json({
                msg: "Email doesn't exist"
            })
        }
    };

    public resetPass = async(req: Request, res: Response): Promise<Response | undefined> => {
        const token: string = req.body.token;
        // const { token } = req.params;
        if(token){
            jwt.verify(token, process.env.FORGOT_PASS_KEY!,async(error:any,decodedToken:any) => {
                if(error){
                    return res.status(400).json({
                        error: "Incorrect Link"
                    })
                }
                const userId: number = decodedToken.userId;
                return this.forgotPassService.forgotPassId(userId)
                .then(async(user) => {
                    if(!user){
                        return res.status(400).json({ msg: "User with this link does not exist"});
                    };
                    const passMatch = await bcrypt.compare(req.body.newPassword,user.password!);
                    if(passMatch){
                        return res.status(200).json({
                            message: "This password used recently. Please choose different password",
                        });
                    }
                    else{
                        user.password = await bcrypt.hash(req.body.newPassword, 10);
                        return this.forgotPassService.updateUser(user.password, userId)
                        .then((user) => {
                            return res.status(200).json({ msg: "Password reset successfully", user});
                        })
                        .catch((error: Error) => {
                            // console.log(error);
                            return res.status(500).json(error);
                        });
                    }
                })
                .catch((error: Error) => {
                    // console.log(error);
                    return res.status(500).json(error);
                });
            })
        }
        else{
            return res.status(400).json({ message: "Somethin went wrong"});
        };
    };
};