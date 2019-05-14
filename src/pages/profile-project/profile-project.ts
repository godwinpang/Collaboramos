import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker'

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
export class ProfileProjectPage {

  tags = ['tag1', 'tag2']
  newTag = ""
  isEdit: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              private imagePicker: ImagePicker) {
    this.isEdit = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileProjectPage');
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
    console.log(this.tags.length)
  }

  addTag(){
    this.presentPrompt()
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

  presentPrompt(){
    let myString: string = ""
    let alert = this.alertCtrl.create({
      title: 'Add Tag',
      inputs: [
        {
          name: 'tag',
          placeholder: 'short tag description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log(this.newTag = data.tag)
            this.tags.push(this.newTag)
            console.log(data.tag)
            console.log(myString)
          }
        }
      ]
    });
    alert.present();
  }


}
