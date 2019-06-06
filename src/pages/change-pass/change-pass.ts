import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { Auth } from '../../providers/auth/auth'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  public changePassForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: Auth,
              public toastCtrl: ToastController,
              formBuilder: FormBuilder) {
    this.changePassForm = formBuilder.group({
      newPass: ['', Validators.required],
      confirmPass: ['', Validators.required],
      currPass: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChangePassPage');
  }

  validateAndChange() {
    const newPass = this.changePassForm.value.newPass;
    const confirmPass = this.changePassForm.value.confirmPass;

    if(newPass == confirmPass) {
      this.auth.updatePass(newPass).then(() => {
        console.log("password updated successfully");
        let toast = this.toastCtrl.create({
          message: `New password has been updated successfully!`,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.navCtrl.pop();
      }).catch(() => {
        let toast = this.toastCtrl.create({
          message: `Please try updating your password again!`,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
    } else {
      let toast = this.toastCtrl.create({
        message: `New passwords don't match!`,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }
}
