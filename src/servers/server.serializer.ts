import { IServers } from './servers.interface';

export class ServerSerializer {
  id: number;
  server_name: string;
  server_desc: string;
  server_ip: string;
  server_port: number;
  server_gif_path: string;
  active: boolean;
  game_version: string;
  mods: string;
  media: string;
  position: number;
  constructor(options: IServers) {
    this.id = options.id;
    this.server_name = options.server_name;
    this.server_desc = options.server_desc;
    this.server_ip = options.server_ip;
    this.server_port = options.server_port;
    this.server_gif_path = options.server_gif_path;
    this.active = options.active;
    this.game_version = options.game_version;
    this.mods = options.mods;
    this.media = options.media;
    this.position = options.position;
  }
}
