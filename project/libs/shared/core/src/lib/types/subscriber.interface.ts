export interface Subscriber {
    id?: string;
    email: string;
    firstname: string;
    lastname: string;
    lastSentAt?: Date;
}