import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Firestore } from '../../providers/firestore/firestore'
import { Project, Account } from '../../models';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-project',
  templateUrl: 'profile-project.html',
})
export class ProfileProjectPage implements OnInit {
  public project_profile: Promise<any>;
  public account: Promise<any>

  tags = ['tag1', 'tag2'];
  frameworks = ['f1', 'f2'];
  isEdit: boolean;

  constructor(//public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              private imagePicker: ImagePicker,
              private inAppBrowser: InAppBrowser,
              private firestore: Firestore,
              private menuCtrl: MenuController,
              public appCom: MyApp) {
    this.isEdit = false;
  }

  ngOnInit() {
    this.account = this.firestore.getAccount('kgchjTGLVQGAdjzkvtCy');
   
    this.project_profile = this.account.then(data=> {
      return this.firestore.getProjectProfileFromID(data.project_id.id);
    });

  }

  ionViewDidLoad() {
    console.log(this.frameworks);
  }

  setIsEdit(isEdit: boolean, discard: boolean) {
    this.isEdit = isEdit;
  }

  deleteTag(t: string){
    var newTags=[]
    for(var i=0;i<this.tags.length;i++){
      if(this.tags[i] != t){
        newTags.push(this.tags[i])
      }
    }
    this.tags = newTags
  }

  deleteFramework(f: string){
    var newTags=[]
    for(var i=0;i<this.frameworks.length;i++){
      if(this.frameworks[i] != f){
        newTags.push(this.frameworks[i])
      }
    }
    this.frameworks = newTags
  }

  pickImage() {
    let options = {
      maximumImagesCount: 1,
      outputType: 0,
      width: 800,
      height: 800
    }

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
      }
    })
  }

  presentWebsite() {
    this.inAppBrowser.create("http://www.google.com");
  }

  presentPrompt(type: string){
    let alert = this.alertCtrl.create({
      title: 'Add Tag',
      inputs: [
        {
          //TODO dynamic change skill vs framework
          name: 'tag',
          placeholder: 'short tag description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: data => {
            if (type === "skills") {
              this.tags.push(data.tag);
            } else if (type === "frameworks") {
              this.frameworks.push(data.tag);
            }
          }
        }
      ]
    });
    alert.present();
  }

  openMenu() {
    //have a variable that checks if edit was tapped; if was then would want to undo and reset colors
    if(!this.menuCtrl.isOpen() && this.appCom.isEdit()) {
      this.appCom.toggleProfileSettings();
    }
    this.menuCtrl.open();
  }
}
