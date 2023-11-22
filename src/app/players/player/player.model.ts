
export class Player {


  constructor(
    public name: string,
    public vote?: number,
    public online?: boolean,
    public spectator?: boolean,
    public isAdmin?: boolean,
    public _id?: string) {

  }

}