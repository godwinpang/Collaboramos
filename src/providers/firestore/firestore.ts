import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Candidate, Project, Account, Channel, Message } from '../../models';
import { AngularFireStorage } from 'angularfire2/storage';
import { tap, finalize, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';

/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Firestore {
  account;

  constructor(public firestore: AngularFirestore,
              public filestorage: AngularFireStorage) {}
  // Account CRUD

  // Create Account
  createAccount(model: Account): Promise<void> {
    // create the account in Firestoer
    return this.firestore.doc(`accounts/${model.id}`).set({
      id: model.id,
      address: model.address,
      email: model.email,
      first_name: model.first_name,
      last_name: model.last_name,
      phone_number: model.phone_number,
      project_ref: model.project_ref,
      candidate_ref: model.candidate_ref,
    });
  }

  // Read Account
  getAccount(id: string): Promise<any> {
    return this.firestore.collection('accounts').doc(id).ref.get().then(doc => {
      return doc.data();
    });
  }

  // Update Account
  updateAccount(id: string, model: Account): Promise<void> {
    return this.firestore.collection('accounts').doc(id).update({
      first_name: model.first_name,
      last_name: model.last_name,
      email: model.email,
      phone_number: model.phone_number,
      project_ref: model.project_ref,
      candidate_ref: model.candidate_ref,
      address: model.address
    });
  }

  // Delete Account
  deleteAccount(id: string): Promise<void> {
    return this.firestore.collection('accounts').doc(id).delete();
  }

  // Candidate Profile CRUD

  // Set Candidate Visibility
  setCandidateVisibility(id: string, is_visible: boolean): Promise<void> {
    return this.firestore.collection('candidate_profiles').doc(id).update({
      is_visible: is_visible
    });
  }

  // Create Candidate
  createCandidate(accountId: string, model: Candidate): Promise<void> {
    const id = this.firestore.createId();
    const fileId = this.firestore.createId(); // generate a file ID
    const resumeId = this.firestore.createId(); // generate a file ID
    console.log(fileId, resumeId); // debugging purposes
    var resumeURL: string = "";
    var imageURL: string = "";
    var emptyMap: {[key: string]: string} = {};

    return this.filestorage.upload(fileId, model.image).then (_ => {
      return this.filestorage.upload(resumeId, model.resume_URL);
    }).then (_ => {
      return this.filestorage.ref(fileId).getDownloadURL().toPromise(); // returns imageObservable
    }).then ( url => {
      imageURL = url;
    }).then (() => {
      return this.filestorage.ref(resumeId).getDownloadURL().toPromise(); // returns resumeObservable
    }).then ( url => {
      resumeURL = url;
    }).then (resumeObservable => {
      return this.firestore.doc(`candidate_profiles/${id}`).set({
        id: id,
        name: model.name,
        image: imageURL,
        website: model.website,
        resume_URL: resumeURL,
        is_visible: model.is_visible,
        skills: model.skills,
        description: model.description,
        phone_number: model.phone_number,
        email: model.email,
        address: model.address
      });
    }).then (_ => {
      return this.firestore.doc(`accounts/${accountId}`).update({
        candidate_ref: this.firestore.doc(`candidate_profiles/${id}`).ref
      });
    }).then (_ => {
      return this.firestore.doc(`matches/${id}`).set({
        matched: emptyMap
      });
    }).then (_ => {
      return this.firestore.doc(`interests/${id}`).set({
        id: id,
        list_type: "project",
        interest_list: []
      });
    }).then (_ => {
      return this.firestore.doc(`match_queries/${id}`).set({
        id: id,
        list_type: "project",
        queried_list: []
      });
    });
  }

  // Read Candidate via ID
  getCandidateProfileFromID(id: string): Promise<any> {
    return this.firestore.collection('candidate_profiles').doc(id).ref.get().then(doc=> {
      return doc.data();
    });
  }

  // Read Candidate via Reference
  getCandidateProfileFromRef(ref: DocumentReference): Promise<any> {
    return ref.get().then(doc => {
      return doc.data();
    })
  }

  uploadFile(id, file) {
    console.log(file);
    console.log(typeof file);
    if (typeof file === "string"){
      return Promise.resolve(null);
    }
    console.log('im out here');
    return this.filestorage.upload(id, file).then(() =>{
      return this.filestorage.ref(id).getDownloadURL().toPromise();
    });
  }

  // Update Candidate
  updateCandidateProfile(model: Candidate) {
    const fileId = this.firestore.createId(); // generate a file ID
    const resumeId= this.firestore.createId(); // generate a file ID

    var resumeURL = '';
    var imageURL = '';

    return this.uploadFile(fileId, model.image).then(url => {
      if (url != null){
        imageURL = url;
      } else {
        imageURL = model.image;
      }
      return this.uploadFile(resumeId, model.resume_URL);
    }).then(url => {
      if (url != null){
        resumeURL = url;
      } else {
        resumeURL = model.resume_URL;
      }
      this.firestore.doc(`candidate_profiles/${model.id}`).update({
        name: model.name,
        image: imageURL,
        website: model.website,
        resume_URL: resumeURL,
        is_visible: model.is_visible,
        skills: model.skills,
        description: model.description,
        phone_number: model.phone_number,
        email: model.email,
        address: model.address
      });  
    });
  }

  // Delete Candidate
  deleteCandidateProfile(id: string): Promise<void> {
    return this.firestore.collection('candidate_profiles').doc(id).delete();
  }

  // Project Profile CRUD

  // Set Project Visibility
  setProjectVisibility(id: string, is_visible: boolean): Promise<void> {
    return this.firestore.collection('project_profiles').doc(id).update({
      is_visible: is_visible
    });
  }
  
  // Create Profile
  createProjectProfile(accountId: string, model: Project) {
    const id = this.firestore.createId(); // generate an ID
    const fileId = this.firestore.createId(); // generate a file ID
    var emptyMap: {[key: string]: string} = {};

    return this.filestorage.upload(fileId, model.image).then(_ => {
        return this.filestorage.ref(fileId).getDownloadURL().toPromise();
    }).then( url => {
        return this.firestore.doc(`project_profiles/${id}`).set({
            id: id,
            name: model.name,
            image: url,
            website: model.website,
            is_visible: model.is_visible,
            frameworks: model.frameworks,
            skills: model.skills,
            description: model.description,
            phone_number: model.phone_number,
            email: model.email,
            address: model.address
        });
    }).then(_ => {
        return this.firestore.doc(`accounts/${accountId}`).update({
            project_ref: this.firestore.doc(`project_profiles/${id}`).ref
        });
    }).then(_ => {
        return this.firestore.doc(`matches/${id}`).set({
            matched: emptyMap
        });
    }).then(_ => {
        return this.firestore.doc(`interests/${id}`).set({
            id: id,
            list_type: "candidate",
            interest_list: []
        })
    }).then(_ => {
        this.firestore.doc(`match_queries/${id}`).set({
            id: id,
            list_type: "candidate",
            queried_list: []
        });
    });
  }

  // Read Profile via ID
  getProjectProfileFromID(id: string): Promise<any> {
    // Returns reference of the document to read
    return this.firestore.collection('project_profiles').doc(id).ref.get().then(doc => {
      return doc.data();
    });
  }

  getProjectProfileReference(id: string): AngularFirestoreDocument <Project> {
    return this.firestore.collection('project_profiles').doc(id);
  }
  // Read Profile via Reference
  getProjectProfileFromRef(ref: DocumentReference): Promise<any> {
    return ref.get().then(doc=> {
      return doc.data();
    });
  }

  // Update Profile
  updateProjectProfile(model: Project) {
    // Returns promise of success/failure for updating the project document on Firestore
    const fileId = this.firestore.createId(); // generate a file ID
    var image_url = "";

    return this.uploadFile(fileId, model.image).then(url => {
      if (url != null){
        image_url = url;
      } else {
        image_url = model.image;
      }
      this.firestore.doc(`project_profiles/${model.id}`).update({
        name: model.name,
        image: image_url,
        website: model.website,
        is_visible: model.is_visible,
        frameworks: model.frameworks,
        skills: model.skills,
        description: model.description,
        phone_number: model.phone_number,
        email: model.email,
        address: model.address
      });
    });
  }

  // Delete Profile
  deleteProjectProfile(id: string): Promise<void> {
    // Returns promise of success/failure for deleting the project document on Firestore
    return this.firestore.doc(`project_profiles/${id}`).delete();
  }

  // Channel CRUD
  
  // Create Channel
  createChannel(model: Channel): Promise<void> {
    const id = this.firestore.createId();

    return this.firestore.doc(`channels/${id}`).set({
      id: id,
      last_message_sent: model.last_message_sent,
      last_message_sender: model.last_message_sender,
      last_message_date: model.last_message_date,
      members: model.members
    });
  }

  // Read Channel
  getChannel(id: string): Promise<any> {
    return this.firestore.collection('channels').doc(id).ref.get().then(doc=> {
      return doc.data();
    });
  }

  getChannelsFromProfile(profileId: string): AngularFirestoreCollection {
    return this.firestore.collection('channels', ref => 
    ref.where('members', 'array-contains', profileId).orderBy('last_message_date', 'desc'));
  }

  // Get Messages in Chat
  getMessagesForChannel(id: string): AngularFirestoreCollection {
    return this.firestore.collection('messages', ref => ref.where('channel_id', '==', id).orderBy('message_date', 'asc'));
  }

  // Update Channel
  updateChannel(id: string, model: Channel): Promise<void> {
    return this.firestore.doc(`channels/${id}`).update({
      last_message_sent: model.last_message_sent,
      last_message_sender: model.last_message_sender,
      last_message_date: model.last_message_date,
      members: model.members
    });
  }

  // Delete Channel
  deleteChannel(id: string): Promise<void> {
    return this.firestore.collection('channels').doc(id).delete();
  }

  // Get Matches for Matches Page
  getMatchesFromProfile(profileId: string): AngularFirestoreDocument {
    return this.firestore.collection('matches').doc(profileId);
  }

  // Update Matches
  updateMatches(id1: string, image1: string, id2: string, image2: string) {
    console.log("hello");
    this.firestore.collection('interests').doc(id1).update({
      interest_list: firebase.firestore.FieldValue.arrayUnion(id2)
    }).then(_ => {
      return this.firestore.collection('interests').doc(id2).ref.get().then(doc => {
        var interestListOfId2: Array<String>;
        interestListOfId2 = doc.data().interest_list;
        var found = false;
        interestListOfId2.forEach(id => {
          if (id == id1) {
            found = true;
          }
        });
        return found;
      });
    }).then(isMatch => {
        if (isMatch) {
          this.firestore.collection('matches').doc(id1).ref.get().then(doc => {
            return doc.data().matched;
          }).then(matched => {
            console.log(matched);
            matched[id2] = image2;
            console.log(matched);
            return this.firestore.collection('matches').doc(id1).update({
              matched: matched
            });
          }).then(_ => {
            this.firestore.collection('matches').doc(id2).ref.get().then(doc => {
              return doc.data().matched;
            }).then(matched => {
              matched[id1] = image1;
              return this.firestore.collection('matches').doc(id2).update({
                matched: matched
              });
            });
          }).then(_ => {
            var channelId = this.firestore.createId();
            return this.firestore.doc(`channels/${channelId}`).set({
              last_message_sent: "",
              last_message_sender: "",
              last_message_date: null,
              members: [id1, id2]
            });
          })
        }
    });
  }

  // Reset queried_list
  resetQueriedList(id: string): Promise<void> {
    return this.firestore.collection('match_queries').doc(id).update({
      queried_list: []
    });
  }

  // Reset matches
  resetMatches(id: string): Promise<void> {
    return this.firestore.collection('matches').doc(id).update({
      matched: {}
    });
  }

  // Reset interests
  resetInterests(id: string): Promise<void> {
    return this.firestore.collection('interests').doc(id).update({
      interest_list: []
    });
  }

  // Get Project Cards
  getCards(id: string, amount: number): Promise<any> {
    var cards: any[];
    return this.firestore.collection('match_queries').doc(id).ref.get().then(doc => {
      var list: string[];
      list = doc.data().queried_list;
      list.sort;
      //console.log(list);
      //var documents: {[key: string]: DocumentData;} = {}; 
      var documents = [];
      if (doc.data().list_type == "project") {
        return this.firestore.collection('project_profiles').ref.get().then(snapshot => {
          snapshot.forEach(doc => {
            //console.log("hello at doc1");
            //console.log(doc.data());
            //documents.push(doc.data());
            var isQueried = false;
            list.forEach(id => {
              if (id == doc.id) {
                isQueried = true;
              }
            });
            if (!isQueried){
              //console.log(doc.data());
              documents.push(doc.data());
            }            
          });
          //console.log(documents);
          return [documents, list];
        });
      } else {
        return this.firestore.collection('candidate_profiles').ref.get().then(snapshot => {
          snapshot.forEach(doc => {
            
            var isQueried = false;
            list.forEach(id => {
              if (id == doc.id) {
                isQueried = true;
              }
            });
            if (!isQueried){
              //console.log(doc.data());
              documents.push(doc.data());
            }            
          });
          //console.log("hi");
          //console.log(documents);
          return [documents, list];
        });
      }
    }).then(documentsAndList => {
      //console.log(documents.length);
      //console.log(documents);
      var newDocuments = documentsAndList[0].splice(0, amount);
      //console.log(amount);
      //console.log(documentsAndList[0]);
      newDocuments.forEach(doc => {
        documentsAndList[1].push(doc.id);
      })

      //console.log(documentsAndList[1]);
      this.firestore.collection('match_queries').doc(id).update({
         queried_list: documentsAndList[1]
      })

      //console.log(newDocuments);
      return newDocuments;
    });
  }

  // CR for Messages
  createMessage(model: Message): Promise<void> {
    var id = this.firestore.createId(); // create new id
    var dateFromFirestore = firebase.firestore.FieldValue.serverTimestamp(); // get time at server

    // update last message sent for the channel
    this.firestore.collection('channels').doc(model.channel_id).update({
      last_message_sent: model.message,
      last_message_sender: model.sender_name,
      last_message_date: dateFromFirestore
    });

    // create new message and push to firestore
    return this.firestore.doc(`messages/${id}`).set({
      channel_id: model.channel_id,
      sender_id: model.sender_id,
      sender_name: model.sender_name,
      message: model.message,
      message_date: dateFromFirestore
    });
  }

  // Get a picture from a file ID
  getDownloadURLFromID(fileId: string) {
    return this.filestorage.ref(fileId).getDownloadURL();
  }
}
