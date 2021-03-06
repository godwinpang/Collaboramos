import { FormControl, FormBuilder } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content, NavParams} from 'ionic-angular';
import { Firestore } from '../../../providers/firestore/firestore';
import { map } from 'rxjs/operators'
import { Message } from '../../../models/message'
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  toUser = {
    _id: '534b8e5aaa5e7afc1b23e69b',
    pic: 'assets/img/ian-avatar.png',
    username: 'Venkman',
  };

  user = {
    _id: '534b8fb2aa5e7afc1b23e69c',
    pic: 'assets/img/marty-avatar.png',
    username: 'Marty',
  };

  doneLoading = false;

  /*messages = [
    {
      _id: 1,
      date: new Date(),
      userId: this.user._id,
      username: this.user.username,
      pic: this.user.pic,
      text: 'OH CRAP!!'
    },
    {
      _id: 2,
      date: new Date(),
      userId: this.toUser._id,
      username: this.toUser.username,
      pic: this.toUser.pic,
      text: 'what??'
    },
    {
      _id: 3,
      date: new Date(),
      userId: this.toUser._id,
      username: this.toUser.username,
      pic: this.toUser.pic,
      text: 'Pretty long message with lots of content'
    },
    {
      _id: 4,
      date: new Date(),
      userId: this.user._id,
      username: this.user.username,
      pic: this.user.pic,
      text: 'Pretty long message with even way more of lots and lots of content'
    },
    {
      _id: 5,
      date: new Date(),
      userId: this.user._id,
      username: this.user.username,
      pic: this.user.pic,
      text: 'what??'
    },
    {
      _id: 6,
      date: new Date(),
      userId: this.toUser._id,
      username: this.toUser.username,
      pic: this.toUser.pic,
      text: 'yes!'
    }
  ];*/
  public messages;
  public channel;
  
  //.valueChanges().subscribe(data => {console.log(data)});

  @ViewChild(Content) content: Content;

  public messageForm: any;
  chatBox: any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,
    private firestore: Firestore,  public navParams: NavParams) {
      console.log(this.navParams);
      //get channel id??
      this.user._id= this.navParams.get('id');
      if(this.navParams.get('params').data.currentProfile == 'project'){
        this.user.username = this.navParams.get('params').data.projectProfile.name;
        this.user.pic = this.navParams.get('params').data.projectProfile.image;
      }else{
        this.user.username = this.navParams.get('params').data.candidateProfile.name;
        this.user.pic = this.navParams.get('params').data.candidateProfile.image;
      }
      this.channel = this.navParams.get('channel_id');
      this.toUser.username = this.navParams.get('otherNames').get(
        this.navParams.get('channel')
      );
      this.toUser.pic = this.navParams.get('otherImages').get(
        this.navParams.get('channel')
      );
      this.messages = this.firestore.getMessagesForChannel(this.channel).valueChanges();
    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';
  }

  ngOnInit() {
    
    //console.log("Hello");
  }

  send(message) {
    if (message && message !== '') {
      // this.messageService.sendMessage(chatId, message);

      const messageData =
        {
          channel_id: this.channel,
          sender_id: this.user._id,
          sender_name: this.user.username,
          message: message,
          message_date: null
          /*date: new Date(),
          userId: this.user._id,
          username: this.toUser.username,
          pic: this.toUser.pic,
          text: message*/
        };

      this.firestore.createMessage(messageData);
      this.scrollToBottom();

      /*setTimeout(() => {
        const replyData =
          {
            toId: this.toUser._id,
            _id: 6,
            date: new Date(),
            userId: this.toUser._id,
            username: this.toUser.username,
            pic: this.toUser.pic,
            text: 'Just a quick reply'
          };
        this.messages.push(replyData);
        this.scrollToBottom();
      }, 1000);*/
    }
    this.chatBox = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

}
