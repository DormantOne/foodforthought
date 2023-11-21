// script.js
let generatedDocId = null; // Global variable to store the document ID

document.getElementById('trueButton').addEventListener('click', generateQR);
document.getElementById('falseButton').addEventListener('click', generateQR);
document.getElementById('sendEmailButton').addEventListener('click', function() {
    if (generatedDocId) {
        sendEmail(generatedDocId);
    } else {
        alert("Please answer the question to generate the QR code first.");
    }
});

function generateQR() {
    var qr = new QRious({
        element: document.getElementById('qrCodeCanvas'),
        size: 200,
        value: 'Your unique response code'
    });

    var qrCodeCanvas = document.getElementById('qrCodeCanvas');
    var qrCodeURL = qrCodeCanvas.toDataURL("image/png");

    window.addDoc(window.collection(window.db, 'qrcodes'), {
        url: qrCodeURL,
        timestamp: new Date()
    }).then(docRef => {
        generatedDocId = docRef.id;
    }).catch(error => {
        console.error("Error adding document to Firestore:", error);
    });
}

function sendEmail(docId) {
    var emailPrefix = document.getElementById('emailPrefix').value;
    var email = emailPrefix + '@upmc.edu';
    var subject = encodeURIComponent('Your QR Code for Food for Thought');
    var body = encodeURIComponent('Access your QR code here: ') + encodeURIComponent(`https://dormantone.github.io/foodforthought/qrDisplay.html?docId=${docId}`);

    var mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    window.open(mailtoLink, '_blank');
}
