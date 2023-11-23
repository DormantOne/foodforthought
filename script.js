document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('trueButton').addEventListener('click', () => generateQR('True'));
    document.getElementById('falseButton').addEventListener('click', () => generateQR('False'));
    document.getElementById('submitQR').addEventListener('click', sendEmail);

    var docId = '';

    function generateQR(answer) {
        var username = document.getElementById('username').value;
        var question = 'Is the human brain composed of over 60% fat?'; // Your actual question
        var encodedQuestion = encodeURIComponent(question);
        var encodedAnswer = encodeURIComponent(answer);

        // Construct the URL for the QR code
        var formPageUrl = `https://dormantone.github.io/foodforthought/formPage.html?username=${encodeURIComponent(username)}&question=${encodedQuestion}&answer=${encodedAnswer}`;

        var qr = new QRious({
            element: document.getElementById('qrCodeCanvas'),
            size: 200,
            value: formPageUrl // Use the form page URL as the QR code value
        });

        document.getElementById('qrCodeCanvasContainer').style.display = 'block';

        // Store the QR code data URL in Firestore
        var qrCodeDataURL = document.getElementById('qrCodeCanvas').toDataURL("image/png");
        firebase.firestore().collection('qrcodes').add({
            qrCodeDataUrl: qrCodeDataURL,
            username: username,
            question: question,
            answer: answer,
            timestamp: new Date()
        }).then(docRef => {
            docId = docRef.id; // Save the document ID for use in the email
        });
    }

    function sendEmail() {
        if (!docId) {
            alert('Please generate a QR code first.');
            return;
        }

        var username = document.getElementById('username').value;
        var email = username + '@upmc.edu';
        var subject = encodeURIComponent('Your QR Code for Food for Thought');
        var body = encodeURIComponent('Access your QR code data here: ') + 
                   encodeURIComponent(`https://dormantone.github.io/foodforthought/qrDisplay.html?docId=${docId}`);

        var mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        window.open(mailtoLink, '_blank');
    }
});
