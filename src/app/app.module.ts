import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersComponent } from './players/players.component';
import { PlayerComponent } from './players/player/player.component';
import { HeaderComponent } from './header/header.component';
import { SessionComponent } from './session/session.component';
import { HistoryComponent } from './history/history.component';
import { StoryComponent } from './story/story.component';
import { CounterComponent } from './counter/counter.component';
import { HomeComponent } from './home/home.component';
import { SessionModalComponent } from './session/session-modal/session-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlayerComponent,
    HeaderComponent,
    SessionComponent,
    HistoryComponent,
    StoryComponent,
    CounterComponent,
    HomeComponent,
    SessionModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MdbModalModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
