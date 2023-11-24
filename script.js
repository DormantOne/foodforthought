document.addEventListener('DOMContentLoaded', function() {
    var trueButton = document.getElementById('trueButton');
    var falseButton = document.getElementById('falseButton');
    var submitButton = document.getElementById('submitQR');

    trueButton.addEventListener('click', () => generateQR('True'));
    falseButton.addEventListener('click', () => generateQR('False'));
    submitButton.addEventListener('click', sendEmail);

    var docId = '';

    function generateQR(answer) {
        var username = document.getElementById('username').value;
        var question = 'Is the human brain composed of over 60% fat?'; 
        var encodedQuestion = encodeURIComponent(question);
        var encodedAnswer = encodeURIComponent(answer);

        var formPageUrl = `https://dormantone.github.io/foodforthought/formPage.html?username=${encodeURIComponent(username)}&question=${encodedQuestion}&answer=${encodedAnswer}`;

        var qr = new QRious({
            element: document.getElementById('qrCodeCanvas'),
            size: 200,
            value: formPageUrl
        });

        document.getElementById('qrCodeCanvasContainer').style.display = 'none';

        var qrCodeDataURL = document.getElementById('qrCodeCanvas').toDataURL("image/png");
        firebase.firestore().collection('qrcodes').add({
            qrCodeDataUrl: qrCodeDataURL,
            username: username,
            question: question,
            answer: answer,
            timestamp: new Date()
        }).then(docRef => {
            docId = docRef.id; 
        });
    }

    function sendEmail() {
        if (!docId) {
            alert('Please generate a QR code first.');
            return;
        }

        trueButton.disabled = true;
        falseButton.disabled = true;
        submitButton.disabled = true;

        var username = document.getElementById('username').value;
        var email = username + '@upmc.edu';
        var subject = 'Your QR Code for Food for Thought';
        var body = `Access your QR code data here: https://dormantone.github.io/foodforthought/qrDisplay.html?docId=${docId}`;

        var payload = {
            email: email,
            subject: subject,
            body: body
        };

        fetch('https://us-central1-foodforthought-e29a4.cloudfunctions.net/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('emailStatus').innerText = 'Email sent successfully.';
            console.log('Email sent successfully:', data);
        })
        .catch((error) => {
            document.getElementById('emailStatus').innerText = 'Error sending email. Please try again.';
            console.error('Error sending email:', error);
        })
        .finally(() => {
            trueButton.disabled = false;
            falseButton.disabled = false;
            submitButton.disabled = false;
        });
    }
});
