import { User } from "../../models/user";
import { ServiceRequest } from "../../models/servicerequest";
import { FavoriteAndBlocked } from "../../models/favoriteandblocked";
import { FavouriteSPRepository } from "./FavouriteSP.repository";

export class FavouriteSPService{
    public constructor(private readonly favouriteSPRepository: FavouriteSPRepository){
        this.favouriteSPRepository = favouriteSPRepository;
    }

    public async getAllServiceRequest(userId:number): Promise<ServiceRequest[]> {
        return this.favouriteSPRepository.getAllServiceRequest(userId);
    }

    public async getSPworkedwithUser(userId:number[]): Promise<User[]>{
        return this.favouriteSPRepository.getSPworkedwithUser(userId);
    }

    public async getFavouriteSP(userId: number, spId: number): Promise<FavoriteAndBlocked | null> {
        return this.favouriteSPRepository.getFavouriteSP(userId,spId);
    }

    public async createFavouriteSP(data: {[key: number | string]: FavoriteAndBlocked}): Promise<FavoriteAndBlocked | null> {
        return this.favouriteSPRepository.createFavouriteSP(data);
    }

    public async updateFavouriteSP(data: FavoriteAndBlocked): Promise<[number, FavoriteAndBlocked[]]>{
        return this.favouriteSPRepository.updateFavouriteSP(data);
    }

    public async updateBlockedSP(data: FavoriteAndBlocked): Promise<[number, FavoriteAndBlocked[]]>{
        return this.favouriteSPRepository.updateFavouriteSP(data);
    }

}