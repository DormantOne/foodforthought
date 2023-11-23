document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('trueButton').addEventListener('click', () => generateQR('True'));
    document.getElementById('falseButton').addEventListener('click', () => generateQR('False'));
    document.getElementById('submitQR').addEventListener('click', sendEmail);

    var qrValue = '';
    var docId = '';

function generateQR(answer) {
    var username = document.getElementById('username').value;
    var question = encodeURIComponent('Is the human brain composed of over 60% fat?');
    
    // Construct the URL for the QR code
    var formPageUrl = `https://dormantone.github.io/foodforthought/formPage.html?username=${encodeURIComponent(username)}&question=${question}&answer=${encodeURIComponent(answer)}`;

    var qr = new QRious({
        element: document.getElementById('qrCodeCanvas'),
        size: 200,
        value: formPageUrl // Use the form page URL as the QR code value
    });

    document.getElementById('qrCodeCanvasContainer').style.display = 'block';

    // Store the QR code data in Firestore
    firebase.firestore().collection('qrcodes').add({
        username: username,
        question: 'Is the human brain composed of over 60% fat?',
        answer: answer,
        url: formPageUrl, // Store the URL instead of the data URL
        timestamp: new Date()
    }).then(docRef => {
        docId = docRef.id;
    });
}


    function sendEmail() {
        if (!qrValue || !docId) {
            alert('Please generate a QR code first.');
            return;
        }

        var username = document.getElementById('username').value;
        var email = username + '@upmc.edu';
        var subject = encodeURIComponent('Your QR Code for Food for Thought');
        var body = encodeURIComponent('Access your QR code here: ') + 
                   encodeURIComponent(`https://dormantone.github.io/foodforthought/qrDisplay.html?docId=${docId}`);

        var mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        window.open(mailtoLink, '_blank');
    }
});
