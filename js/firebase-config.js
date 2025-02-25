
const firebaseConfig = {
  apiKey: "AIzaSyDn6CVJY97vguLGrwTaOk2TEYlsGvpCzsM",
  authDomain: "storeshoes-online.firebaseapp.com",
  databaseURL: "https://storeshoes-online-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "storeshoes-online",
  storageBucket: "storeshoes-online.firebasestorage.app",
  messagingSenderId: "151351290325",
  appId: "1:151351290325:web:d33c235484d51fa8b3755c",
  measurementId: "G-FXHBZPFM19"
};
firebase.initializeApp(firebaseConfig);

// Lấy reference đến Firestore
const db = firebase.firestore();
export { db };