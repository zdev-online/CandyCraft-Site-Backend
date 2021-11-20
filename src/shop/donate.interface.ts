export interface IDonate {
  id: number;
  name: string;
  servers_id: string;
  desc_private: string;
  desc_flags: string;
  commands: string;
  can_enter_full_server: boolean;
  can_save_inventory: boolean;
  pex_name: string;
  position: number;
  image: string;
}
