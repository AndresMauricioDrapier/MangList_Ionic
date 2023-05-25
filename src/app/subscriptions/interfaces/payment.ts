export interface Payment {
  id?: number,
  userId: string;
  mailUser:string,
  type: string,
  method: string,
  amount:number,
  date: string,
}

export interface PaymentResponse {
  id: number;
  idUser: string;
  date: string;
  amount: number;
  name: string,
  mail: string,
  methodPayment: string,
}
