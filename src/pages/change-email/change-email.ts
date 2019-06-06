import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the ChangeEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-email',
  templateUrl: 'change-email.html',
})
export class ChangeEmailPage {
  public changeEmailForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: Auth,
              public toastCtrl: ToastController,
              formBuilder: FormBuilder) {
    this.changeEmailForm = formBuilder.group({
      newEmail: ['', Validators.required],
      currPass: ['', Validators.required]
    });
  }

  validateAndChange() {
    //check that everything okay (should go somewhere else?)
    const newEmail = this.changeEmailForm.value.newEmail;
    const currPass = this.changeEmailForm.value.currPass;
    console.log(newEmail);

    this.auth.updateEmail(newEmail).then(() => {
        console.log("email updated successfully");
        let toast = this.toastCtrl.create({
          message: `New email has been updated successfully!`,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.navCtrl.pop();
      }).catch(() => {
        let toast = this.toastCtrl.create({
          message: `Please try updating your email again!`,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
  }
}
