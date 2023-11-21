document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('trueButton').addEventListener('click', () => generateQR('True'));
    document.getElementById('falseButton').addEventListener('click', () => generateQR('False'));
    document.getElementById('submitQR').addEventListener('click', sendEmail);

    var qrValue = '';
    var docId = '';

    function generateQR(answer) {
        var username = document.getElementById('username').value;
        qrValue = `Username: ${username}, Answer: ${answer}`;

        var qr = new QRious({
            element: document.getElementById('qrCodeCanvas'),
            size: 200,
            value: qrValue
        });

        document.getElementById('qrCodeCanvasContainer').style.display = 'block';

        var qrCodeCanvas = document.getElementById('qrCodeCanvas');
        var qrCodeURL = qrCodeCanvas.toDataURL("image/png");

        firebase.firestore().collection('qrcodes').add({
            username: username,
            answer: answer,
            url: qrCodeURL,
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
