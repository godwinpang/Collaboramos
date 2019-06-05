import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Firestore } from '../../providers/firestore/firestore'
import { Project, Account } from '../../models';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-project-profile',
  templateUrl: 'view-project-profile.html',
})
export class ViewProjectProfilePage {

  private account: Account;
  private profile: Project;
  private tempProfile: Project;

  private isEdit: boolean;

  @ViewChild('imageInput') imageInput;
  hasImage: boolean;
  image = "";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              private imagePicker: ImagePicker,
              private inAppBrowser: InAppBrowser,
              private firestore: Firestore) {
    this.isEdit = false;
    this.hasImage = false;
    this.account = navParams.get('account');
    this.profile = this.copyProjectProfile(navParams.get('projectProfile'));
    this.tempProfile = this.copyProjectProfile(navParams.get('projectProfile'));
    //this.populateProfileFromAccount(this.profile, this.account);
    //this.populateProfileFromAccount(this.tempProfile, this.account);
  }

  copyProjectProfile(profile: Project): Project {
    return {
      id: profile.id,
      name: profile.name,
      image: profile.image,
      description: profile.description,
      is_visible: profile.is_visible,
      frameworks: Object.assign([], profile.frameworks),
      skills: Object.assign([], profile.skills),
      chats: profile.chats,
      interests: profile.interests,
      matches: profile.matches,
      waitlist: Object.assign([], profile.waitlist),
      address: profile.address,
      email: profile.email,
      website: profile.website,
      phone_number: profile.phone_number
    };
  }


  getProfileImageStyle() {
    //return 'url(' + this.form.controls['profilePic'].value + ')'
    return this.profile.image;
  }


  presentWebsite() {
    this.inAppBrowser.create(this.profile.website);
  }

  presentPrompt(type: string){
    let input: any
    if (type === "skills") {
      input = {
        name: 'skill',
        placeholder: 'e.g. Webscraping, iOS Dev'
      }
    } else {
      input = {
        name: 'framework',
        placeholder: 'e.g. Ionic, React'
      }
    }

    let title_str: string
    title_str = (type === "skills") ? 'Add Skill' : 'Add Framework';
    let alert = this.alertCtrl.create({
      title: title_str,
      inputs: [
        input
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
              this.tempProfile.skills.push(data.skill);
            } else if (type === "frameworks") {
              this.tempProfile.frameworks.push(data.framework);
            }
          }
        }
      ]
    });
    alert.present();
  }
}
