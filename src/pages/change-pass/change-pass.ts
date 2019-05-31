import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChangePassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-pass',
  templateUrl: 'change-pass.html',
})
export class ChangePassPage {
  credentials: { newPass: string, confirmNewPass: string, currPass: string } = {
    newPass: '',
    confirmNewPass: '',
    currPass: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePassPage');
  }

  validate() {
    console.log(this.credentials.newPass + ", " + this.credentials.confirmNewPass + ", " + this.credentials.currPass);
  }
}
