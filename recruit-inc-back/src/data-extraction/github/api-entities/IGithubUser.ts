import { IDataEntry } from "../../../matching-algo/data-model/input-model/IDataEntry"
import { IGitProjectInput } from "../../../matching-algo/data-model/input-model//IGitProjectInput"

export interface IGithubUser{
    login: string
    location?: string,
    languages?:{
        name: string
    },
    dataEntry?: IDataEntry,
    email?: string,
    company?: string,
    isHireable?: boolean,
    url: string,
    websiteUrl?: string,
    createdAt: string 
}
