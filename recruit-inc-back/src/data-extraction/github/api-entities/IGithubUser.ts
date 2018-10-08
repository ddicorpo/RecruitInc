export interface IGithubUser{
    login: string
    location?: string,
    Languages:{
        name: string
    },
    repositories:{
        name: string
    },  
    email?: string,
    company?: string,
    isHireable?: boolean,
    url: string,
    websiteUrl?: string,
    createAt: string 
}
