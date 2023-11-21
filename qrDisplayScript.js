
// Check if Firebase has already been initialized
if (!firebase.apps.length) {
    var firebaseConfig = {
        apiKey: "AIzaSyBwaG48VZccslds53WxfY378P0iXqPtLac",
        authDomain: "foodforthought-e29a4.firebaseapp.com",
        projectId: "foodforthought-e29a4",
        storageBucket: "foodforthought-e29a4.appspot.com",
        messagingSenderId: "752853183245",
        appId: "1:752853183245:web:036a462f1635b7ece69e44",
        measurementId: "G-0SMWPDL345"
    };
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayQRCodeData(docId) {
    var docRef = firebase.firestore().collection('qrcodes').doc(docId);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var qrDataURL = doc.data().url; // Get the data URL of the QR code image
            var qrCodeImage = document.getElementById('qrCodeImage');
            qrCodeImage.src = qrDataURL; // Set the data URL as the source of the image
            qrCodeImage.style.display = 'block';
        } else {
            console.log("No such document!");
            document.getElementById('qrCodeData').textContent = "No such document!";
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        document.getElementById('qrCodeData').textContent = "Error: " + error;
    });
}

// Uncomment the following lines to use dynamic document ID from URL
var docId = getQueryParam('docId');
if (docId) {
    displayQRCodeData(docId);
} else {
    console.log("Document ID not provided");
    document.getElementById('qrCodeData').textContent = "Document ID not provided";
}
