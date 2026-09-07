import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


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
const provider = new GoogleAuthProvider();


// =====================================
// SIMPAN LOGIN
// =====================================

setPersistence(auth, browserLocalPersistence);


// =====================================
// LOGIN GOOGLE
// =====================================

const googleLogin = document.getElementById("googleLogin");

if (googleLogin) {

    googleLogin.addEventListener("click", async () => {

        try {

            await setPersistence(
                auth,
                browserLocalPersistence
            );

            await signInWithPopup(
                auth,
                provider
            );

            // LOGIN BERHASIL → HOME
            window.location.href = "https://yzddsgn.github.io/id/home/";

        } catch (error) {

            console.error(error);

            alert(
                "Login gagal:\n" +
                error.code
            );

        }

    });

}


// =====================================
// STATUS USER
// =====================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "LOGIN:",
            user.email
        );

        const userName =
            document.getElementById("userName");

        if (userName) {
            userName.textContent =
                user.displayName || "User";
        }


        const userEmail =
            document.getElementById("userEmail");

        if (userEmail) {
            userEmail.textContent =
                user.email;
        }


        const userPhoto =
            document.getElementById("userPhoto");

        if (userPhoto && user.photoURL) {
            userPhoto.src =
                user.photoURL;
        }


        // Kalau user membuka login.html
        // padahal sudah login → HOME
        if (
            window.location.pathname.endsWith(
                "https://yzddsgn.github.io/id/login/"
            )
        ) {

            window.location.href =
                "https://yzddsgn.github.io/id/home/";
        }

    } else {

        console.log(
            "BELUM LOGIN"
        );

    }

});


// =====================================
// LOGOUT
// =====================================

const logoutButton =
    document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href =
                "https://yzddsgn.github.io/id/login/";

        } catch (error) {

            console.error(error);

        }

    });

}