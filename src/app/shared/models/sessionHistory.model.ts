import { Player } from "src/app/players/player/player.model";

export interface sessionHistory {
  story: string,
  players: Player[],
  average?: number
}