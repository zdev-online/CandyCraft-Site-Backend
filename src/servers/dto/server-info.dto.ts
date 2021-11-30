import { Player } from "gamedig";

export class ServerInfoDto {
    active: boolean;
    max_players: number;
    players: Player[];
    ping: number;
    connect: string;
}