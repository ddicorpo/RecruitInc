export interface IGithubUser{
    login: string
    location?: string,
    languages?:{
        name: string
    },
    repositories?:{
        name: string
        owner?:{
        login: string
        }
        structure?:{
        oid: string //oid in github
        type: string
        name: string //path
        }[]
    }[],  
    email?: string,
    company?: string,
    isHireable?: boolean,
    url: string,
    websiteUrl?: string,
    createdAt: string 
}
