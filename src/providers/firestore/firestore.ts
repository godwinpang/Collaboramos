import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Candidate, Project, Account, Channel } from '../../models'
import { Subscribable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardsPage } from '../../pages/cards/cards';

/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Firestore {
  account;

  constructor(public firestore: AngularFirestore) { }
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
      console.log(doc);
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

  // Create Candidate
  createCandidate(accountId: string, model: Candidate): Promise<void> {
    const id = this.firestore.createId();

    this.firestore.doc(`candidate_profiles/${id}`).set({
      id: id,
      name: model.name,
      image: model.image,
      website: model.website,
      resumeURL: model.resume_URL,
      is_visible: model.is_visible,
      skills: model.skills,
      description: model.description,
      phone_number: model.phone_number,
      email: model.email,
      address: model.address
    });

    return this.firestore.doc(`accounts/${id}`).update({
      candidate_ref: this.firestore.doc(`candidate_profiles/${id}`).ref
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

  // Update Candidate
  updateCandidateProfile(model: Candidate): Promise<void> {
    return this.firestore.doc(`candidate_profiles/${model.id}`).update({
      name: model.name,
      image: model.image,
      website: model.website,
      resumeURL: model.resume_URL,
      is_visible: model.is_visible,
      skills: model.skills,
      description: model.description,
      phone_number: model.phone_number,
      email: model.email,
      address: model.address
    });
  }

  // Delete Candidate
  deleteCandidateProfile(id: string): Promise<void> {
    return this.firestore.collection('candidate_profiles').doc(id).delete();
  }

  // Project Profile CRUD

  // Create Profile
  createProjectProfile(accountId: string, model: Project): Promise<void> {
    const id = this.firestore.createId(); // generate an ID

    // Returns promise of success/failure for creating the project document on Firestore
    this.firestore.doc(`project_profiles/${id}`).set({
      id: id,
      name: model.name,
      image: model.image,
      website: model.website,
      is_visible: model.is_visible,
      proj_name: model.name,
      skills: model.skills,
      frameworks: model.frameworks
    });

    return this.firestore.doc(`accounts/${accountId}`).update({
      project_ref: this.firestore.doc(`project_profiles/${id}`).ref
    })
  }

  // Read Profile via ID
  getProjectProfileFromID(id: string): Promise<any> {
    // Returns reference of the document to read
    return this.firestore.collection('project_profiles').doc(id).ref.get().then(doc => {
      return doc.data();
    });
  }
  // Read Profile via Reference
  getProjectProfileFromRef(ref: DocumentReference): Promise<any> {
    return ref.get().then(doc=> {
      return doc.data();
    });
  }

  // Update Profile
  updateProjectProfile(model: Project): Promise<void> {
    // Returns promise of success/failure for updating the project document on Firestore
    return this.firestore.doc(`project_profiles/${model.id}`).update({
      name: model.name,
      image: model.image,
      website: model.website,
      is_visible: model.is_visible,
      proj_name: model.name,
      skills: model.skills,
      frameworks: model.frameworks
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
      chat_member_project_ref: model.chat_member_project_ref,
      chat_member_candidate_ref: model.chat_member_candidate_ref,
      last_message_sent_ref: model.last_message_sent_ref
    });
  }

  // Read Channel
  getChannel(id: string): Promise<any> {
    return this.firestore.collection('channels').doc(id).ref.get().then(doc=> {
      return doc.data();
    });
  }

  // Update Channel
  updateChannel(id: string, model: Channel): Promise<void> {
    return this.firestore.doc(`channels/${id}`).update({
      chat_member_project_ref: model.chat_member_project_ref,
      chat_member_candidate_ref: model.chat_member_candidate_ref,
      last_message_sent_ref: model.last_message_sent_ref
    });
  }

  // Delete Channel
  deleteChannel(id: string): Promise<void> {
    return this.firestore.collection('channels').doc(id).delete();
  }

  // Get Project Cards
  getCards(id: string, amount: number): Promise<any> {
    var cards: any[];
    return this.firestore.collection('match_queries').doc(id).ref.get().then(doc => {
      var list: string[];
      list = doc.data().queried_list;
      list.sort;

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
        this.firestore.collection('candidate_profiles').ref.get().then(snapshot => {
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
          //console.log(documents);
          return [documents, list];
        });
      }
    }).then(documentsAndList => {
      //console.log(documents.length);
      //console.log(documents);
      var newDocuments = documentsAndList[0].splice(0, amount);

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
}
