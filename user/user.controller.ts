import { User } from "../models/user";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { db } from "../models/index";
import  bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
require('dotenv').config();

const userTypeID: number = 1;

export class UserController{
    public constructor(private readonly userService: UserService) {
        this.userService = userService;
    }

    public createUsers = async(req: Request, res: Response): Promise<Response> => {
        req.body.userTypeId = userTypeID;
        req.body.isRegisteredUser = false;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(!(password === cpassword)){
            return res.json({ message: "Please enter same password.."});
        }
        else{
            const exist = await db.Users.findOne({where: {email:req.body.email}});
            if(exist){
                return res.status(403).json({ message: "Email already in use.."});
            }
            req.body.password = await bcrypt.hash(password, 10);
            return this.userService
            .createUsers(req.body)
            .then((user: User) => {
                const token = jwt.sign({user},process.env.JWT_KEY!,{expiresIn:'2h'});
                const transporter = nodemailer.createTransport({
                        service: process.env.SERVICE,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASS,
                        },
                    });
    
                    const mailOptions = {
                        from:process.env.USER,
                        to: req.body.email,
                        subject: "Account Verification",
                        html: `<h4>Kindly click on the below given link to activate your account</h2>
                                <p>${process.env.URL}/verify/user/${token}`
                    };
    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.status(404).json({
                                error: error,
                                message: "Email cannot be sent.."
                            });
                        }
                        else {
                            if (info.response.includes("OK")) {
                                console.log("email sent");
                               return res.status(200).json({
                                    msg: "Email sent successfully !"
                                });
                            }
                        }
                    });
                return res.status(200).json({user});
            })
            .catch((error: Error) => {
                return res.status(500).json({
                    error:error
                });
            });
        };
        
    };

    public verifyEmail = async(req: Request, res: Response): Promise<Response|undefined> => {
        const { token } = req.params;
        if(token){
            jwt.verify(token, process.env.JWT_KEY!,async (error:any,decodedToken:any) => {
                if(error){
                    return res.status(400).json({
                        error: 'Incorrect Link'
                    })
                }
                const {user} = decodedToken;
                if(user){
                    user.isRegisteredUser = true;
                    console.log(user);
                    const userUpdate = await db.Users.update(user, {where: {email: user.email}});
                    if(userUpdate) {
                        return res.status(200).json({user})
                    }
                    else{
                        console.log(error);
                        return res.status(500).json(error);
                    };
                }
            })
        }
        else{
            return res.status(404).json({
                error:"Something went wrong!!"
            });
        };
    };

    public loginUser = async(req: Request, res: Response): Promise<Response> => {
        return this.userService.loginUser(req.body.email)
        .then(async (user: User | null) => {
            if(user === null){
                console.log(user)
                return res.status(403).json({ message: "Invalid Email or Password"});
            }
            else {
                // const originalPass = user.password;
                // const isUserRegister = this.userService.isUserRegister(user);
                const isUserRegister = user.isRegisteredUser;
                if(isUserRegister){
                    const passwordMatch = await bcrypt.compare(req.body.password, user.password!);
                    if(passwordMatch){
                        const userEmail = user.email;
                        const token = jwt.sign({userEmail},process.env.JWT_KEY!,{expiresIn:'2h'});
                        // const token = this.userService.createToken(user.email!);
                        return res.status(200)
                        .cookie("token", token, { httpOnly: true, expires:new Date(Date.now()+600000) })
                        .json({ message: "User login successful "});
                    }
                    return res.status(401).json({ message: "Invalid Email or Password"});
                }
                return res.status(401).json({ message: "Please Active Your Account"});
            }
        })
        .catch((error: Error) => {
            console.log(error);
            return res.status(500).json({
                error: error,
            })
        })
    };

    public deleteToken = (req: Request, res: Response) => {
        try {
          res.clearCookie('token');
          return res.status(200).json({message:'User Logout successfully'})
        } 
        catch (error) {
          return res.status(401).json({message:'cannot logout'});
        }
    };
};