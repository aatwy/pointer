import { Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { VotingService } from '../shared/services/voting.service';
import { SessionService } from '../shared/services/session.service';
import { DataService } from '../shared/services/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Player } from '../players/player/player.model';
import { Session } from '../shared/models/session.model';
import { ModalConfig } from '../shared/modal.config.interface';
import { HistoryModalComponent } from './history-modal/history-modal.component';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, OnDestroy {
  playerSetSub = new Subscription();
  storySub = new Subscription();
  showVotesSub = new Subscription();
  adminSub = new Subscription();
  lockVoteSub = new Subscription();

  dropdownList: Player[] = [];
  selectedItems: Player[] = [];
  dropdownSettings: IDropdownSettings = {};

  story: string = "";
  storyInput: string = "";
  showVotes: boolean;
  lockVotes: boolean;
  admin: boolean = false;

  @ViewChild('modal') private modalComponent: HistoryModalComponent

  modalConfig: ModalConfig = {
    modalTitle: 'History Viewer',
    closeButtonLabel: 'Close',
    shouldDismiss: () => true,
    hideDismissButton: () => false,
    hideCloseButton: () => true
  }

  constructor(
    private votingService: VotingService,
    private sessionService: SessionService,
    private dataService: DataService){
  }

  ngOnInit(): void {
    this.playerSetSub = this.sessionService.playerSet.subscribe((player) => {
      this.admin = player.isAdmin;
      this.setAdminList();
    })
    this.admin = this.sessionService.player.isAdmin;


    this.storySub = this.dataService.storyUpdated.subscribe((story) => {
      this.story = story
      if(story === ""){
        this.storyInput = "";
      }
    })
    this.story = this.sessionService.session.currentStory;

    this.showVotesSub = this.dataService.toggleShow.subscribe((showVotes) => {
      this.showVotes = showVotes;
    })
    this.showVotes = this.sessionService.session.showVotes;

    this.lockVoteSub = this.votingService.voteLockUpdated.subscribe((lock) => {
      this.lockVotes = lock;
    });
    this.lockVotes = this.votingService.lockVotes;

    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.adminSub = this.dataService.adminUpdated.subscribe((session: Session) => {
      this.setAdminList();
    })
    this.setAdminList();

  }

  ngOnDestroy(): void {
    this.playerSetSub.unsubscribe();
    this.storySub.unsubscribe();
    this.showVotesSub.unsubscribe();
    this.lockVoteSub.unsubscribe();
    this.adminSub.unsubscribe();
  }

  setAdminList(){
    this.dropdownList = this.sessionService.session.players.filter((player) => player._id !== this.sessionService.player._id);
    this.selectedItems = this.sessionService.session.players.filter((player) => player.isAdmin).filter((player) => player._id !== this.sessionService.player._id);
  }

  toggleVote(){
    this.showVotes = !this.showVotes
    this.votingService.toggleVotes(this.showVotes);
  }

  async toggleLock(){
    this.lockVotes = !this.lockVotes;
    await this.votingService.toggleLock(this.lockVotes, this.sessionService.sessionId);
  }

  onNextStory(){
    this.votingService.clearVotes()
  }

  async onStoryUpdated(){
    // Check if user is entering empty spaces to prevent useless network calls
    if (this.storyInput.replace(/\s/g, '').length) {
      await this.dataService.updateStory(this.sessionService.sessionId, this.storyInput);
    } else if (this.story.length > 0){
      await this.dataService.updateStory(this.sessionService.sessionId, "");
    }
  }

  async onShowHistory(){
    return await this.modalComponent.open();
  }

  async onItemSelect(item: any) {
    let player = this.sessionService.session.players.find((player) => player._id === item._id);
    await this.dataService.setAdmin(!player.isAdmin, item._id, this.sessionService.sessionId);
  }

  async onDeSelect(item: any) {
    let player = this.sessionService.session.players.find((player) => player._id === item._id);
    await this.dataService.setAdmin(!player.isAdmin, item._id, this.sessionService.sessionId);
  }

}
