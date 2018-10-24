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
        commits?:{
        oid: string
        changedFiles: number
        singleFileCommit?:{
        filename: string,
        additions: number,
        deletions: number
        }[]
        }[],
        downloadedSourceFilePaths?: string[]
    }[],  
    email?: string,
    company?: string,
    isHireable?: boolean,
    url: string,
    websiteUrl?: string,
    createdAt: string 
}
