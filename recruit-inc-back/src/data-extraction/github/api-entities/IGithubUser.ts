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
        sha: string 
        name: string
        path: string 
        }[]
    }[],  
    email?: string,
    company?: string,
    isHireable?: boolean,
    url: string,
    websiteUrl?: string,
    createdAt: string 
}
