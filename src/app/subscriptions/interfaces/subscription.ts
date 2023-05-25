export interface Subscription {
    id: number;
    type: string;
    content: {
      acces: string,
      activeUsers: number,
    },
    price: number,
    icon: string,
}
