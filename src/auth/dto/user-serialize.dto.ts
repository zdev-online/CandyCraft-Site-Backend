import { Users } from "src/users/users.entity";

export class UsersSerialize {
    public id: number;
    public confirmed: boolean;
    public email: string;
    public role: string;
    public userId: number;
    public username: string;
    public uuid: string;

    constructor(partial: Partial<Users>) {
        this.id = partial.id; 
        this.confirmed = partial.confirmed; 
        this.email = partial.email; 
        this.role = partial.role; 
        this.userId = partial.id; 
        this.username = partial.username; 
        this.uuid = partial.uuid;
    }
}