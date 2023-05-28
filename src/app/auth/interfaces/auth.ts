export interface Auth {
    _id?: number;
    name?: string;
    email: string;
    password?: string;
    avatar?: string;
    token?:string;
    role?:string;
    favorites?:number[];
    lastComicRead?:string;
}

export interface AuthLogin {
    email: string;
    password: string;
    token?:string;
    avatar?:string;
    userId?:string;
}

