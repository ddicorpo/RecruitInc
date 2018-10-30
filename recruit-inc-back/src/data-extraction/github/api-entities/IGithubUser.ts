import { IDataEntry } from "../../../matching-algo/data-model/input-model/IDataEntry"
import { IGithubProjectInput } from "../../../matching-algo/data-model/input-model/IGithubProjectInput"

export interface IGithubUser{
    login: string
    location?: string,
    languages?:{
        name: string
    },
    dataEntry?: {
        projectInputs: IGithubProjectInput[]
    },
    email?: string,
    company?: string,
    isHireable?: boolean,
    url: string,
    websiteUrl?: string,
    createdAt: string 
}
