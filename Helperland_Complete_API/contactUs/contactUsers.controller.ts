import { ContactUS } from "../models/contactus";
import { Request, Response } from 'express';
// import nodemailer from "nodemailer";
import { ContactUsersService } from "./contactUsers.service";
// import { validator } from "sequelize/dist/lib/utils/validator-extras";

export class ContactUsersController {
    public constructor(private readonly contactUsersService: ContactUsersService) {
        this.contactUsersService = contactUsersService;
    };

    public getAllContactUsers = async(req: Request, res: Response): Promise<Response> => {
        return this.contactUsersService
            .getAllContactUsers()
            .then((contactUser: ContactUS[]) => {
                if(contactUser){
                    return res.status(200).json({contactUser});
                }
                return res.status(404).json({error: 'No Contact User'});
            })
            .catch((error: Error) => {
                return res.status(500).json({
                    error: error
                });
            });
    };

    public getContactUsersById = async (req: Request, res: Response): Promise<Response> => {
        return this.contactUsersService
            .getContactUsersById(+req.params.id)
            .then((contactUser) => {
                if(contactUser){
                    return res.status(200).json({contactUser});
                }
                return res.status(404).json({ error: 'Not Found'});
            })
            .catch((error: Error) => {
                return res.status(500).json({
                    error: error
                });
            });
    };

    public addContactUsers = async (req: Request, res: Response): Promise<Response> => {
        req.body.uploadFileName = req.file?.originalname;
        req.body.path = req.file?.path;
        req.body.name = req.body.firstname + ' ' + req.body.lastname;
        return this.contactUsersService
            .addContactUsers(req.body)
            .then((contactUser: ContactUS) => {
                return res.status(200).json({ contactUser});
            })
            .catch((error: Error) => {
                return res.status(500).json({
                    error: error
                });
            });
    };

    public deleteContactUser = async(req: Request, res: Response): Promise<Response> => {
        return this.contactUsersService
            .deleteContactUser(+req.params.id)
            .then((contactUser) => {
                if(contactUser > 0){
                    return res.status(200).json({ contactUser });
                }
                return res.status(404).json({ error: 'NotFound' });
            })
            .catch((error: Error) => {
                return res.status(500).json({
                  error: error
                });
            });
    };
};


 // const transporter = nodemailer.createTransport({
                //     service: "gmail",
                //     auth: {
                //         user: "chachamehta33@gmail.com",
                //         pass: "Chacha@2114",
                //     },
                // });

                // const mailOptions = {
                //     from:"chachamehta33@gmail.com",
                //     to: "rushir306@gmail.com",
                //     subject: req.body.subjectType.trim(),
                //     html: req.body.message.trim(),
                // };

                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         res.status(404).json({
                //             error: error
                //         });
                //     }
                //     else {
                //         if (info.response.includes("OK")) {
                //             console.log("email sent");
                //            return res.status(200).json({
                //                 msg: "Email sent successfully !"
                //             });
                //         }
                //     }
                // });