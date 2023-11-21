document.getElementById('trueButton').addEventListener('click', generateQR);
document.getElementById('falseButton').addEventListener('click', generateQR);

function generateQR() {
    var qr = new QRious({
        element: document.getElementById('qrCodeCanvas'),
        size: 200,
        value: 'Your unique response code'
    });

    var qrCodeCanvas = document.getElementById('qrCodeCanvas');
    var qrCodeURL = qrCodeCanvas.toDataURL("image/png");

    // Add to Firestore using the db variable
    db.collection('qrcodes').add({
        url: qrCodeURL,
        timestamp: new Date() // Optional, for record-keeping
    }).then(docRef => {
        sendEmail(docRef.id); // Call sendEmail with the document ID
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
