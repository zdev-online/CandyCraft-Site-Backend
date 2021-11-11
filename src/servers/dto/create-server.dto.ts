export class CreateServerDto {
    pex_prefix: string;
    server_name: string;
    server_desc: string;
    server_ip: string;
    server_port: number;
    rcon_port: number;
    server_gif_path: string;
    game_version: string;
    mods: string;
    media: string;
    position: number;
}