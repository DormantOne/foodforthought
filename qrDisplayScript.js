// Assuming Firebase is already initialized in firebaseConfig.js

function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayQRCode(docId) {
    var docRef = firebase.firestore().collection('qrcodes').doc(docId);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById('qrCodeImage').src = doc.data().url;
        } else {
            console.log("No such document!");
            // Handle the error (e.g., display a not-found message)
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

var docId = getQueryParam('docId');
if (docId) {
    displayQRCode(docId);
} else {
    console.log("Document ID not provided");
    // Handle the error (e.g., display an error message)
}
