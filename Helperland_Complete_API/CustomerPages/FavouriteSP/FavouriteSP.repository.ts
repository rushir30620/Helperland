import { db } from "../../models/index";
import { User } from "../../models/user";
import { ServiceRequest } from "../../models/servicerequest";
import { FavoriteAndBlocked } from "../../models/favoriteandblocked";
import { Op } from "sequelize";

export class FavouriteSPRepository{

    public async getAllServiceRequest(userId:number): Promise<ServiceRequest[]> {
        return db.ServiceRequest.findAll({ where: {id: userId}});
    }

    public async getSPworkedwithUser(userId:number[]): Promise<User[]>{
        return db.Users.findAll({ where: { userTypeId: 3, id: { [Op.or]: userId }}, include: 'TargetUserId'})
    }

    public async getFavouriteSP(userId: number, spId: number): Promise<FavoriteAndBlocked | null> {
        return db.FavoriteAndBlocked.findOne({ where: {UserId:userId, TargetUserId:spId}});
    }

    public async createFavouriteSP(data: {[key: number | string]: FavoriteAndBlocked}): Promise<FavoriteAndBlocked | null> {
        return db.FavoriteAndBlocked.create(data);
    }

    public async updateFavouriteSP(data: FavoriteAndBlocked): Promise<[number, FavoriteAndBlocked[]]>{
        return db.FavoriteAndBlocked.update({ IsFavorite: data.IsFavorite }, { where: {UserId:data.UserId, TargetUserId:data.TargetUserId}});
    }

    public async updateBlockedSP(data: FavoriteAndBlocked): Promise<[number, FavoriteAndBlocked[]]>{
        return db.FavoriteAndBlocked.update({ IsFavorite: data.IsBlocked }, { where: {UserId:data.UserId, TargetUserId:data.TargetUserId}});
    }


}