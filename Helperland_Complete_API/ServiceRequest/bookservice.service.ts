import { ServiceRequest } from "../models/servicerequest";
import { User } from "../models/user";
import { UserAddress } from "../models/useraddress";
import { FavoriteAndBlocked } from "../models/favoriteandblocked";
import { ServiceBookRepository } from "./bookservice.repository";
import jwt from "jsonwebtoken";

export class ServiceBook{
    public constructor(private readonly serviceBookRepository: ServiceBookRepository){
        this.serviceBookRepository = serviceBookRepository;
    }

    public async createService(servicerequest: { [key: number|string] : ServiceRequest }): Promise<ServiceRequest> {
        return this.serviceBookRepository.createService(servicerequest);
    }

    public async createScheduleRequestWithAddress(servicerequest: {[key: number | string]: ServiceRequest}): Promise<ServiceRequest> {
        return this.serviceBookRepository.createScheduleRequestWithAddress(servicerequest);
    }

    public async getServiceProvider(zipCode:string): Promise<User[]> {
        return this.serviceBookRepository.getServiceProvider(zipCode);
      }

    public async addNewAddress(userAddress: {[key: number | string]: UserAddress}): Promise<UserAddress> {
        return this.serviceBookRepository.addNewAddress(userAddress);
    }

    public async getAllServiceProvider(): Promise<User[]>{
        return this.serviceBookRepository.getAllServiceProvider();
    }

    public createToken( user : object, postalcode: string ): string {
        const token = jwt.sign({...user, postalcode}, process.env.JWT_KEY! );
        return token;
    }

    public async getUserWithEmail(userEmail: string): Promise<User | null> {
        return this.serviceBookRepository.getUserWithEmail(userEmail);
    }

    public async getUserWithAddress(userId:number): Promise<UserAddress[]> {
        return this.serviceBookRepository.getUserWithAddress(userId);
      }

    public async getFavoriteAndBlockedSP(userId:number): Promise<FavoriteAndBlocked[]>{
        return this.serviceBookRepository.getFavoriteAndBlockedSP(userId);
    }

    public async getUserWithId(userId: number[]): Promise<User[]> {
        return this.serviceBookRepository.getUserWithId(userId);
    }

    public getTargetUser(user:FavoriteAndBlocked[]):number[]{
        let favoriteSP = [];
        for(let us in user){
          if(user[us].IsFavorite===true && user[us].IsBlocked===false){
            favoriteSP.push(user[us].TargetUserId);
          }
        }
        return favoriteSP;
    }

    public mailData(userEmail:string): typeof mailOptions{
        const mailOptions = {
            from:process.env.USER,
            to: userEmail,
            subject: "New Service Register",
            html: `<h4>New Sevice Register in your area. Kindly Check It.</h4>`
        };
        return mailOptions;
    }
}