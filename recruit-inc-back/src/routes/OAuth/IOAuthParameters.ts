export interface IOAuthParameters{
    platform: string;
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
    state: string;
}