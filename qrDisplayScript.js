function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayQRCodeData(docId) {
    var docRef = firebase.firestore().collection('qrcodes').doc(docId);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var qrData = doc.data().url;
            document.getElementById('qrCodeData').textContent = qrData.substring(0, 200); // Display first 200 characters
        } else {
            console.log("No such document!");
            document.getElementById('qrCodeData').textContent = "No such document!";
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        document.getElementById('qrCodeData').textContent = "Error: " + error;
    });
}

// For testing with a hardcoded document ID
var testDocId = 'XVg9Fgmm3Sz43DRRTuhB'; // Replace with a valid document ID from Firestore
displayQRCodeData(testDocId);

// Comment out this section when testing with a hardcoded document ID
// var docId = getQueryParam('docId');
// if (docId) {
//     displayQRCodeData(docId);
// } else {
//     console.log("Document ID not provided");
//     document.getElementById('qrCodeData').textContent = "Document ID not provided";
// }
