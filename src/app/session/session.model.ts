import { Player } from "../players/player/player.model";

export class Session {

  constructor(
    public id: string,
    public _id?: string,
    public players?: Player[],
    public story?: string,
    public showVotes?: boolean) {

    }
}