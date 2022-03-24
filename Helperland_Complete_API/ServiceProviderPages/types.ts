export type updateSPDetail = {
    firstName:string,
    lastName:string,
    mobile:number,
    dateOfBirth:Date,
    nationalityId:number,
    gender:string,
    userAddress: {
      StreetName:string,
      HouseNumber:string,
      PostalCode:string,
      City:string
    }
  }