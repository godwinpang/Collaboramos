import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class Auth {
    private user: firebase.User;

    constructor(public afAuth: AngularFireAuth) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
    }

    signup(credentials) {
        return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    login(credentials) {
        return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    }

    logout() {
        return this.afAuth.auth.signOut();
    }

    updatePass(newPass) {
        return this.user.updatePassword(newPass);
    }

    updateEmail(newEmail) {
        return this.user.updateEmail(newEmail);
    }
}