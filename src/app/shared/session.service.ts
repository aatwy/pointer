import { Injectable } from "@angular/core";
import { v4 as uuid } from 'uuid';


@Injectable({providedIn: 'root'})
export class SessionService {
  private sessionId: string;

  createSession(){
    this.sessionId = uuid();
    localStorage.setItem('sessionId', this.sessionId)
  }
}