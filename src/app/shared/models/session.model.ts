import { Player } from "../../players/player/player.model";

export class Session {

  constructor(
    public id: string,
    public _id?: string,
    public players?: Player[],
    public currentStory?: string,
    public showVotes?: boolean,
    public lockVotes?: boolean,
    public history?:
      [{
        story: string,
        players: Player[]
      }] ){

    }
}