export interface IServers {
  id: number;
  pex_prefix: string;
  server_name: string;
  server_desc: string;
  server_ip: string;
  server_port: number;
  rcon_port: number;
  server_gif: string;
  active: boolean;
  game_version: string;
  mods: string;
  media: string;
  position: number;
}
