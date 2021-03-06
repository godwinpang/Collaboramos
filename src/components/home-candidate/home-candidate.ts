import { Component, ViewChild, ViewChildren, QueryList, Renderer} from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from '../../app/app.component';
import 'rxjs/Rx';

import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

import { Items, Firestore } from '../../providers';
import { Candidate } from '../../models';
/**
 * Generated class for the HomeCandidateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'home-candidate',
  templateUrl: 'home-candidate.html'
})
export class HomeCandidateComponent {

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  skillsExpanded = true;
  descExpanded = true;
  frameworksExpanded = true;

  private element;


  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '     ';

  tags = [];
  frameworks = [];
  private profile: Candidate;

  constructor(private toastCtrl: ToastController, private appCom:MyApp, public navCtrl: NavController, public navParams: NavParams, public items: Items, private http: Http, public renderer: Renderer, public firestore: Firestore, private inAppBrowser: InAppBrowser) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/4), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };


    this.profile = navParams.get("candidateProfile") 
    this.cards = [];
    try {
      this.addNewCards(3);
    } catch(e) {
        console.log(e);
    }

  }

  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });

  }

  getSize() {
    return '100px 100px'
  }

  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16*16 - abs, 16*16));
    let hexCode = this.decimalToHex(min, 2);
/*
    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }
*/
    this.element = element;
    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;

  }

  // Connected through HTML
  voteUp(like: boolean) {
    let removedCard = this.cards.pop();
    if(this.cards.length <= 2) {
      try {
        this.addNewCards(5);
      } catch(e) {
        console.log(e)
      }
    }
    if (like) {
        this.firestore.updateMatches(this.profile.id, this.profile.image, removedCard.id, removedCard.image);
        
        let toast = this.toastCtrl.create({
            message: "You liked " + removedCard.name,
            duration: 1500,
            position: 'bottom'
        });
        toast.present();
    } else {
      this.recentCard = 'You disliked: ' + removedCard.name;
      let toast = this.toastCtrl.create({
        message: "You disliked " + removedCard.name,
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
    }

  }

  // Add new cards to our array
  addNewCards(count: number) {
    //console.log(this.navParams.get('account'));
    //console.log("From appCom " + this.appCom.getCandidateProfile())
    //console.log(this.appCom.getCandidateProfile());
    //console.log(this.profile.id);
    //console.log(this.navParams.get('account'));
    console.log("hello");
    console.log(this.appCom.getCandidateProfile().id);
    if(this.navParams.get('account').candidate_ref === null) { console.log("hello"); } else {
      this.firestore.getCards(this.appCom.getCandidateProfile().id, count).then(map => {
          console.log(map);
          map.forEach((value: any, key: any) => {
              this.cards.push(value)
              this.tags.push(value.skills)
              this.frameworks.push(value.frameworks)
              console.log("printing frameworks");
              console.log(value.frameworks);

          })
      });
    }
    console.log("frameworks" + this.frameworks)
  }

  clickWebsite(c: any) {
    this.inAppBrowser.create(c.website, "_system");
  }

  getImage(i: number) {
    return "url(" + this.cards[i].image + ")";
  }

  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;

  }

}
