import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';

import { User, Auth, Firestore } from '../../providers';
import { MainPage } from '../';
import { MyApp } from '../../app/app.component';

import { Keyboard } from '@ionic-native/keyboard/ngx';
import { access } from 'fs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  private credentials: { email: string, password: string } = {
    email: '',
    password: ''
  };

  private showFooter = true;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    private auth: Auth,
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private appCom: MyApp,
    public keyboard: Keyboard
  ) { }

  showListener() {
    console.log('keyboard visible');
    this.showFooter = false;
  }
  hideListener() {
    console.log('keyboard hides');
    this.showFooter = true;
  }

  ionViewDidEnter() {
    console.log('ion view entered');
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  ionViewWillLeave() {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }

  cancel() {
    this.navCtrl.pop()
  }

  // Attempt to login in through our User service
  doLogin() {
    let params = {};

    let loading = this.loadingCtrl.create({
      content: 'Logging in...'
    });
    loading.present();

    this.auth.login(this.credentials).then((user) => {
      return this.firestore.getAccount(user.user.uid);
    }).then( acc => {
      params['account'] = acc;
      params['candidateProfileRef'] = acc.candidate_ref;
      params['projectProfileRef'] = acc.project_ref;

      this.appCom.setAccount(acc);
      this.appCom.setProjectProfileRef(acc.project_ref);
      this.appCom.setCandidateProfileRef(acc.candidate_ref);

      if (acc.project_ref == null) {
        return null;
      } else {
        return this.firestore.getProjectProfileFromID(acc.project_ref.id);
      }
    }).then( projectProfile => {
      params['projectProfile'] = projectProfile;
      this.appCom.setProjectProfile(projectProfile);

      let acc = params['account'];
      if (acc.candidate_ref == null) {
        return null;
      } else {
        return this.firestore.getCandidateProfileFromID(acc.candidate_ref.id);
      }
    }).then ( candidateProfile => {
      params['candidateProfile'] = candidateProfile;
      this.appCom.setCandidateProfile(candidateProfile);
    }).then(_ => {
      let acc = params['account'];
      if (acc.candidate_ref != null) {
        return this.firestore.resetQueriedList(acc.candidate_ref);
      }
    }).then(_ => {
      let acc = params['account'];
      if (acc.project_ref != null) {
        return this.firestore.resetQueriedList(acc.project_ref);
      }
    }).then( _ => {
      params['currentProfile'] = this.getSelectedProfile(params);
      this.appCom.setCurrentProfile(this.getSelectedProfile(params));
      loading.dismiss();

      if (params['candidateProfile'] == null && params['projectProfile'] == null) {
        this.navCtrl.setRoot("CreateProfilePage", params);
        this.showLoginSuccess();
      } else {
        this.navCtrl.setRoot(MainPage, params);
        this.showLoginSuccess();     
      }
    }).catch((err) => {
      this.showLoginFailure(err.message);
      loading.dismiss();
    });
  }

  getSelectedProfile(params) {
    console.log(params);
    if (params['projectProfile'] != null) {
      return 'project';
    } else if (params['candidateProfile'] != null) {
      return 'candidate';
    } else {
      return '';
    }
  }

  showLoginSuccess() {
    let toast = this.toastCtrl.create({
      message: 'You have successfully logged in!',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  showLoginFailure(error_msg) {
    // Unable to sign up
      let toast = this.toastCtrl.create({
        message: error_msg,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
  }
}