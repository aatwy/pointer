
export class Player {
  public id: string;
  public name: string;
  public vote: string;
  public voted: boolean

  constructor(id: string, name: string, vote: string, voted: boolean) {
    this.id = id;
    this.name = name;
    this.vote = vote;
    this.voted = voted;
  }

}