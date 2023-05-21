export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  lat: number;
  lng: number;
  me?: boolean;
  token?:string;
}

export interface UserLogin {
  email: string;
  password?: string;
  lat?: number;
  lng?: number;
  token?:string;
  image?:string;
  userId?:string;
}
export interface GoogleLogin {
  email: string;
  authentication:{accessToken:string,idToken:string}
  lat?: number;
  lng?: number;
}




