document.addEventListener('DOMContentLoaded', function() {
    var submitAnswerButton = document.getElementById('submitAnswer');
    var submitQRButton = document.getElementById('submitQR');
    var trueAnswer = document.getElementById('trueAnswer');
    var falseAnswer = document.getElementById('falseAnswer');

    // Initially, the QR code submit button is disabled
    submitQRButton.disabled = true;

    submitAnswerButton.addEventListener('click', submitAnswer);
    submitQRButton.addEventListener('click', sendEmail);

    var docId = '';

function submitAnswer() {
    var selectedAnswer = trueAnswer.checked ? 'True' : falseAnswer.checked ? 'False' : null;
    var correctAnswer = 'True'; // Assuming 'True' is the correct answer

    if (!selectedAnswer) {
        alert('Please select an answer.');
        return;
    }

    if (selectedAnswer === correctAnswer) {
        document.getElementById('emailStatus').innerText = 'Correct! You can now send your QR coupon.';
        generateQR(selectedAnswer);
        submitQRButton.disabled = false; // Ensure this line is executed
    } else {
        document.getElementById('emailStatus').innerText = 'Wrong answer. Please try again.';
        submitQRButton.disabled = true; // Disable the button if the answer is wrong
    }
}


    function generateQR(answer) {
        var username = document.getElementById('username').value;
        var question = 'Is the human brain composed of over 60% fat?'; 
        var encodedQuestion = encodeURIComponent(question);
        var encodedAnswer = encodeURIComponent(answer);

        var formPageUrl = `https://yourwebsite.com/formPage.html?username=${encodeURIComponent(username)}&question=${encodedQuestion}&answer=${encodedAnswer}`;

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

        var username = document.getElementById('username').value;
        var email = username + '@upmc.edu';
        var subject = 'Your QR Code for Food for Thought';
        var body = `Access your QR code data here: https://yourwebsite.com/qrDisplay.html?docId=${docId}`;

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
            document.getElementById('emailStatus').innerText = 'Email sent successfully. Button will be reactivated in 3 minutes.';
            console.log('Email sent successfully:', data);

            submitQRButton.disabled = true;
            setTimeout(() => {
                submitQRButton.disabled = false;
                document.getElementById('emailStatus').innerText = '';
            }, 180000); // 180000 milliseconds = 3 minutes
        })
        .catch((error) => {
            document.getElementById('emailStatus').innerText = 'Error sending email. Please try again.';
            console.error('Error sending email:', error);
        });
    }
});
