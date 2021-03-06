import { Component, ViewChild, ViewChildren, QueryList, Renderer } from '@angular/core';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';
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
    SwingCardComponent
} from 'angular2-swing';

import { Items, Firestore } from '../../providers';
import { resolveDefinition } from '@angular/core/src/view/util';
import { Project } from '../../models';
/**
 * Generated class for the HomeProjectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'home-project',
    templateUrl: 'home-project.html'
})
export class HomeProjectComponent {


    private profile: Project;
    @ViewChild('myswing1') swingStack: SwingStackComponent;
    @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

    skillsExpanded = true;
    descExpanded = true;

    private element;


    cards: Array<any>;
    topCard;
    stackConfig: StackConfig;
    recentCard: string = '     ';

    tags = [];
    frameworks = ['f1', 'f2'];

    public account: Promise<any>;
    constructor(public navCtrl: NavController,
                public navParams: NavParams, 
                public items: Items, 
                private http: Http, 
                public renderer: Renderer, 
                private firestore: Firestore,
                private inAppBrowser: InAppBrowser,
                private appCom: MyApp,
                private toastCtrl: ToastController
                ) {
        this.stackConfig = {
            throwOutConfidence: (offsetX, offsetY, element) => {
                return Math.min(Math.abs(offsetX) / (element.offsetWidth / 4), 1);
            },
            transform: (element, x, y, r) => {
                this.onItemMove(element, x, y, r);
            },
            throwOutDistance: (d) => {
                return 800;
            }
        };
        
        console.log(this.navParams.get('account'));
        this.profile = this.navParams.get('projectProfile');
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

    clickResume(c: any) {
        console.log(c.resume_URL);
        if (c.resume_URL != null && c.resume_URL != ""
            && c.resume_URL[0] == "h") {
            this.inAppBrowser.create(c.resume_URL, "_system");
        }
        
    }

    clickWebsite(c: any) {
        console.log(c.website);
        if (c.website != null && c.website != ""
            && c.website[0] == "h") {
            this.inAppBrowser.create(c.website, "_system");
        }
    }

    // Called whenever we drag an element
    onItemMove(element, x, y, r) {
        var color = '';
        var abs = Math.abs(x);
        let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
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
        console.log("profile: " + this.profile)
        let removedCard = this.cards.pop();

        if (this.cards.length <= 2) {
            try {
                this.addNewCards(5);
            } catch(e) {
                console.log(e);
            }
            console.log("Voted on cards and added");
        }

        if (like) {
            console.log("profile " + this.profile.id);
            console.log("other " + removedCard.id);
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
        //console.log("Added new cards");
        //console.log(this.navParams.get('account'));
        //console.log(this.profile)()
        //console.log("From appCom " + this.appCom.getProjectProfile())
        if(this.navParams.get('account') == undefined || this.navParams.get('account') == null){
            return;
        }
        console.log(this.navParams.get('account'));
        if(this.navParams.get('account').project_ref === null) {return; } else {
            this.firestore.getCards(this.appCom.getProjectProfile().id, count).then(map => {
                console.log(map);
                map.forEach((value: any, key: any) => {
                    this.cards.push(value)
                    this.tags.push(value.skills)
                    console.log(value)
      
                })
            }).catch(_ => {
                console.log("disaster");
            });
          }
    }

    getImage(i: number) {
        return "url(" + this.cards[i].image + ")";
    }

    getSize() {
        return '84px 108px'
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
