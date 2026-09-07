import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuUOT-gh8qva1Oc2FwBJ1Tq_2KhuYG_Do",
    authDomain: "yzddsgn.firebaseapp.com",
    projectId: "yzddsgn",
    storageBucket: "yzddsgn.firebasestorage.app",
    messagingSenderId: "102821029173",
    appId: "1:102821029173:web:068c1ddccb575143b3987c",
    measurementId: "G-D0G12P53RJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userPhoto = document.getElementById("userPhoto");

onAuthStateChanged(auth, (user) => {

    if (user) {

        // Sudah login
        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");

        // Tampilkan foto Google
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.classList.remove("hidden");
        }

    } else {

        // Belum login
        loginBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");
        userPhoto.classList.add("hidden");

    }

});


// LOGOUT
logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        // Tetap di Home setelah logout
        window.location.href = "../../index.html";

    } catch (error) {

        console.error(error);
        alert("Logout gagal.");

    }

});