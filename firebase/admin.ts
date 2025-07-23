import {getApps} from 'firebase-admin/app';
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
    const app = getApp();

    if (!app.length) {
         initializeApp({
             credential: cert({
                 projectId: process.env.FIREBASE_PROJECT_ID,
                 clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                 privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
             })
         })
    }

    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin();