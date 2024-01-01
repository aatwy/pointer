import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import { environment } from '../environments/environment'
import { AppComponent } from './app.component';
import { PlayersComponent } from './players/players.component';
import { PlayerComponent } from './players/player/player.component';
import { HeaderComponent } from './header/header.component';
import { SessionComponent } from './session/session.component';
import { StoryComponent } from './story/story.component';
import { CounterComponent } from './counter/counter.component';
import { HomeComponent } from './home/home.component';
import { SessionModalComponent } from './shared/session-modal/session-modal.component';
import { FooterComponent } from './footer/footer.component';


const config: SocketIoConfig = { url: environment.socketURL, options: {}};

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlayerComponent,
    HeaderComponent,
    SessionComponent,
    StoryComponent,
    CounterComponent,
    HomeComponent,
    SessionModalComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgbDatepickerModule,
    ClipboardModule,
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
