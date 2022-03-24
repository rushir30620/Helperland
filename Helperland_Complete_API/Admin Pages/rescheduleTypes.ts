export type editServiceDetail = {
    ServiceStartDate:Date,
    ServiceStartTime:number,
    serviceAddress: {
        StreetName:string,
        HouseNumber:string,
        PostalCode:string,
        City:string
    },
    Comments:string,
    Note:string
}