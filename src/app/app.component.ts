import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, MenuController, AlertController, Events, ToastController } from 'ionic-angular';

import { FirstRunPage } from '../pages';
import { Settings, Auth } from '../providers';

import { Firestore } from '../providers/firestore/firestore';
import { Project, Candidate } from '../models';
import { DocumentReference } from 'angularfire2/firestore';
//import { CreateProjectPage } from '../pages/create-project/create-project';

// SET SIDEBAR STATE TO WAIT FOR ACCOUNT
  // account only exists after login

// Oberservable and Listener to get the is_visible boolean from Firestore
  // listen for changes from Firestore; get tutorial from Thomas

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  //title pages and where to send the navCtrl to; some are placeholders
  pages: any[] = [
    {title: 'Create Project', component: 'CreateProjectPage'},
    {title: 'Create Candidate', component: 'CreateCandidatePage'},
    {title: 'Account Settings', component: 'SettingsPage'},
    {title: 'Logout', component: 'WelcomePage'},

    {title: 'ProfileProject', component: 'ProfileProjectPage'},
    {title: 'ProfileCandidate', component: 'ProfileCandidatePage'},
    {title: 'Chats', component: 'ChatsPage'},
    {title: 'Messages', component: 'MessagesPage'},
    {title: 'Matches', component: 'MatchesPage'},
    {title: 'ViewCandidateProfile', component: 'ViewCandidateProfilePage'},
    {title: 'ViewProjectProfile', component: 'ViewProjectProfilePage'},
    { title: 'HomeProject', component: 'HomeProjectPage' },
    { title: 'HomeCandidate', component: 'HomeCandidatePage' },
  ]

  private PROJECT = 'project';
  private CANDIDATE = 'candidate';
  private PROJECT_COLOR: string = 'project_button';
  private CANDIDATE_COLOR: string = 'candy_button';
  private SWITCH: string = 'switch';

  private NON_COLOR: string = 'baby_powder';
  private NON_CREATE: string = 'nop';

  //boolean value for ion-toggle to set
  protected isToggled: boolean;

  //variables related to project profile
  private projectVis: boolean;
  private projectColor: string = this.PROJECT_COLOR;

  //variables related to candidate profile
  private candidateVis: boolean;
  private candidateColor: string = this.CANDIDATE_COLOR;

  private isEdit: boolean = false;

  //variable to tell what was last profile
  private currentProfile: string;

  private project: Project;
  private candidate: Candidate;
  private account: Account;
  private projectRef: DocumentReference;
  private candidateRef: DocumentReference;

  constructor(private platform: Platform,
              settings: Settings,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private firestore: Firestore,
              private events: Events,
              private auth: Auth,
              private toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.menuCtrl.swipeEnable(false);
    });
  }

  // this should handle input from ion-toggles
  public notify(isProject: boolean) {
    //need to interface with Firebase for this to remember last toggled setting
    // this.isToggled = !check;

    // if(this.currentProfile === this.PROJECT) {

    //   if(this.projToggled) {
    //     this.project = this.switchProjectVisibleModel(this.project, false);

    //     this.firestore.updateProjectProfile(this.project);
    //   } else if(!this.projToggled) {

    //     this.project = this.switchProjectVisibleModel(this.project, true);

    //     this.firestore.updateProjectProfile(this.project);
    //   }
    //   //this.projectSettings();
    // } else if(this.currentProfile === this.CANDIDATE) {
    //   this.isToggled = false;
    // }

    if(isProject) {
      this.firestore.setProjectVisibility(this.project.id, this.project.is_visible);
    } else if(!isProject) {
      this.firestore.setCandidateVisibility(this.candidate.id, this.candidate.is_visible);
    }
  }

  createCandidate() {
      this.nav.push("CreateCandidatePage", { account: this.account });
      this.closeMenu();
  }

  createProject() {
      this.nav.push("CreateProjectPage", { account: this.account });
      this.closeMenu();
  }

  closeMenu() {
    //closes the left side menu
    this.menuCtrl.close();
    this.isEdit = false;
  }

  changePage(item) {
    //change page and close menu for certain menu actions
    this.nav.push(item.component);
    this.closeMenu();
  }

  logout() {
    this.resetState();
    this.auth.logout().then(_=>{
      this.nav.setRoot("WelcomePage");
      this.closeMenu();
    })
  }
  
  promptDelete(isProject: boolean) {
    //bring up a prompt to delete profile
    let alert = this.alertCtrl.create({
      title: 'Delete Profile',
      message: 'Do you want to delete this profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            // this.profileDelete(profileType);
            if(isProject) {
              this.deleteProject();
            } else if(!isProject) {
              this.deleteCandidate();
            }
          }
        }
      ]
    });
    alert.present();
  }

  public deleteProject() {
    if (!this.candidate) {
      console.log("not deleting");
      let toast = this.toastCtrl.create({
        message: 'Cannot delete profile when you only have one remaining',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
      return
    }

    console.log("going to delete");
    this.firestore.deleteProjectProfile(this.account.id, this.project.id);
    if (this.candidate != null) {
      this.setCurrentProfile("project");
    } else {
      this.setCurrentProfile("");
    }
    this.project = null;
    this.projectRef = null;
  }

  public deleteCandidate() {
    if (!this.project) {
      console.log("not deleting");
      let toast = this.toastCtrl.create({
        message: 'Cannot delete profile when you only have one remaining',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
      return 
    }
    console.log("going to delete");
    this.firestore.deleteCandidateProfile(this.account.id, this.candidate.id);
    if (this.project != null) {
      this.setCurrentProfile("project");
    } else {
      this.setCurrentProfile("");
    }
    this.candidate = null;
    this.candidateRef = null;
  }

  reset() {
    if(!this.project && !this.candidate) {
      this.isEdit = false;

      // NAVPARAMS?
      this.nav.setRoot('CreateProfilePage');
      this.closeMenu();
    }
  }

  resetState() {
    this.account = null;
    this.candidate = null;
    this.project = null;
    this.candidateRef = null;
    this.projectRef = null;
    this.currentProfile = "";
  }

  setEdit(edit: boolean) {
    this.isEdit = edit;
  }

  setAccount(acc: Account) {
    this.account = acc;
  }

  public getAccount() {
      return this.account;
  }

  setCandidateProfile(candidate: Candidate) {
    this.candidate = candidate;
  }

    public getCandidateProfile() {
        return this.candidate;
    }

  setProjectProfile(proj: Project) {
    this.project= proj;
    }

    public getProjectProfile() {
        return this.project;
    }

  setCandidateProfileRef(ref: DocumentReference) {
    this.projectRef = ref;
  }

  setProjectProfileRef(ref: DocumentReference) {
    this.candidateRef = ref;
  }

  public setCurrentProfile(profile: string) {
    this.currentProfile = profile;

    if(profile === 'project') {
      this.projectColor = "project_banner";
      this.candidateColor = "nop";
      this.projectPublishEvents();
    } else if(profile === 'candidate') {
      this.projectColor = "nop";
      this.candidateColor = "candy_banner";
      this.candidatePublishEvents();
    }
  }

  public setCurrentProfileWOPublish(profile: string) {
    this.currentProfile = profile;

    if(profile === 'project') {
      this.projectColor = "project_banner";
      this.candidateColor = "nop";
    } else if(profile === 'candidate') {
      this.projectColor = "nop";
      this.candidateColor = "candy_banner";
    }
  }

  candidatePublishEvents() {
    let data = {currentProfile: 'candidate', candidateProfile: this.candidate};
    this.events.publish('currentProfile', 'candidate');
    this.events.publish('profileUpdate', data);
  }

  projectPublishEvents() {
    let data = {currentProfile: 'project', projectProfile: this.project};
    this.events.publish('currentProfile', 'project');
    this.events.publish('profileUpdate', data);
  }

}

// can wrap things in ion item; put button and text

//ionic toggle for profile visibility and ionic modal for settings page
//use firebase isVisible flag for toggle and profile visibility settings
//  learn firebase
