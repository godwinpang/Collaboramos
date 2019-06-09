import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams} from 'ionic-angular';
import { Firestore } from '../../providers/firestore/firestore';

@IonicPage()
@Component({
  templateUrl: 'chats.html',
})

export class ChatsPage {

  /*chats = [{
    imageUrl: 'assets/img/marty-avatar.png',
    title: 'McFly',
    lastMessage: 'Hey, what happened yesterday?',
    timestamp: new Date()
  },
  {
    imageUrl: 'assets/img/ian-avatar.png',
    title: 'Venkman',
    lastMessage: 'Sup, dude',
    timestamp: new Date()
  }
  ,
  {
    imageUrl: 'assets/img/sarah-avatar.png.jpeg',
    title: 'Sarah Mcconnor',
    lastMessage: 'You still ow me that pizza.',
    timestamp: new Date()
  }];*/

  public chats;
  public profileId;
  public matchesKeys;
  public matches;
  public names = new Map();
  public images = new Map();
  public idToChat = new Map();
  public members;
  public otherId;

  constructor(public navCtrl: NavController, private firestore: Firestore, public navParams: NavParams) {
    console.log(this.navParams);
    if(this.navParams.get('currentProfile') == "project"){
      this.profileId = this.navParams.get('projectProfile').id;
    }else{
      this.profileId = this.navParams.get('candidateProfile').id;
    }
    //this.chats = this.firestore.getChannelsFromProfile(this.profileId).valueChanges();
    //get channels
    try {
    this.firestore.getChannelsFromProfile(this.profileId).valueChanges().subscribe( chats => {
      this.chats = chats;
      //give mapping from otherId to chats/channel
      var i = 0;
      for (i = 0; i < chats.length; i++){
        this.members = chats[i].members;
        this.otherId = (this.members[1] == this.profileId) ? this.members[0] : this.members[1];
        this.idToChat.set(this.otherId,chats[i]);
        //console.log(this.names.get(chats[i]));
      }
      //get matches to get names
      
      this.firestore.getMatchesFromProfile(this.profileId).valueChanges().subscribe( matches => {
        this.matchesKeys = Object.keys(matches.matched);
        this.matches = matches.matched;
        //get names and map to channel
        if(this.navParams.get('currentProfile') == "project"){
          this.matchesKeys.forEach(element => {
            this.firestore.getCandidateProfileFromID(element).then(candidate =>
              {{this.names.set(this.idToChat.get(element), candidate.name);
                this.images.set(this.idToChat.get(element), candidate.image)
              }});
          });  
        }else{
          this.matchesKeys.forEach(element => {
            this.firestore.getProjectProfileFromID(element).then(project =>
              {{this.names.set(this.idToChat.get(element), project.name);
                this.images.set(this.idToChat.get(element), project.image)
              }});
          });
        }
        //console.log(this.matchesKeys);
        //console.log(this.matches);
        //console.log(this.names);
        //console.log(this.idToChat);
      });
    }); } catch {}


  }

  viewMessages(chat) {
    console.log(this.navParams);
    this.navCtrl.push('MessagesPage', { 
      id: this.profileId, 
      channel_id: chat.id, 
      channel: chat,
      params: this.navParams, 
      otherIds: this.matchesKeys,
      otherImages: this.images,
      otherNames: this.names,
      idToChat: this.idToChat
    });
  }

  getImage(chat){
    return this.images.get(chat);
  }
}
