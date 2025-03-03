
const firebaseConfig = {
  apiKey: "AIzaSyAf5hxg2YNKxuIM7Kw3viYnyRMVHZaMh4g",
  authDomain: "step-up-brand.firebaseapp.com",
  projectId: "step-up-brand",
  storageBucket: "step-up-brand.firebasestorage.app",
  messagingSenderId: "915455304768",
  appId: "1:915455304768:web:da213c10c670fd0384aba5",
  measurementId: "G-X23NY4DSWG"
};

firebase.initializeApp(firebaseConfig);

// Lấy reference đến Firestore
const db = firebase.firestore();
export { db };