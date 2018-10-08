export interface IBadges {
    "user": IUser,
    "badge_type": string,
    "award_count": number,
    "rank": string,
    "badge_id": number,
    "link": string,
    "name": string
}

interface IUser{
    "reputation": number,
    "user_id": number,
    "user_type": string,
    "accept_rate": number,
    "profile_image": string,
    "display_name": string,
    "link": string
}