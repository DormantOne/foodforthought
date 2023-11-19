function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayQRCodeData(docId) {
    var docRef = firebase.firestore().collection('qrcodes').doc(docId);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            // Retrieve the data URL from Firestore and display it as text
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

var docId = getQueryParam('docId');
if (docId) {
    displayQRCodeData(docId);
} else {
    console.log("Document ID not provided");
    document.getElementById('qrCodeData').textContent = "Document ID not provided";
}
