// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    update, 
    remove, 
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { 
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged, 
    signInWithEmailAndPassword,
    fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyB6uMdCrIV9FVF9skAKoPPXVqSz1yCa1qw",
    authDomain: "autopecas-express-web.firebaseapp.com",
    databaseURL: "https://autopecas-express-web-default-rtdb.firebaseio.com",
    projectId: "autopecas-express-web",
    storageBucket: "autopecas-express-web.firebasestorage.app",
    messagingSenderId: "654276180126",
    appId: "1:654276180126:web:07139f77ba65285922638f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Exportar tudo
export {
    db,
    ref,
    set,
    push,
    update,
    remove,
    onValue,
    get,
    auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    fetchSignInMethodsForEmail
};
