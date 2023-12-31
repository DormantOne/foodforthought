document.addEventListener('DOMContentLoaded', function() {
    var submitAnswerButton = document.getElementById('submitAnswer');
    var submitQRButton = document.getElementById('submitQR');
    var trueAnswer = document.getElementById('trueAnswer');
    var falseAnswer = document.getElementById('falseAnswer');
    var answerStatus = document.getElementById('answerStatus');
    var couponStatus = document.getElementById('couponStatus'); // Element to display coupon status

    // Initially disable the QR code submit button
    submitQRButton.disabled = true;

    // Fetch and display the coupon count
    checkCouponStatus();

    submitAnswerButton.addEventListener('click', submitAnswer);
    submitQRButton.addEventListener('click', sendEmail);

    var docId = '';

    function submitAnswer() {
        var selectedAnswer = trueAnswer.checked ? 'True' : falseAnswer.checked ? 'False' : null;
        var correctAnswer = 'True'; // Assuming 'True' is the correct answer

        if (!selectedAnswer) {
            answerStatus.innerText = 'Please select an answer.';
            return;
        }

        if (selectedAnswer === correctAnswer) {
            answerStatus.innerText = 'Correct! You can now send your QR coupon.';
            generateQR(selectedAnswer);
            submitQRButton.disabled = false;
            submitQRButton.classList.add('blink'); // Add blinking effect
        } else {
            answerStatus.innerText = 'Wrong answer. Please try again.';
            submitQRButton.disabled = true;
            submitQRButton.classList.remove('blink'); // Remove blinking effect if present
        }
    }

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

        var username = document.getElementById('username').value;
        var email = username + '@gmail.com';
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
            submitQRButton.disabled = true;
            submitQRButton.classList.remove('blink'); // Remove blinking effect after sending
            checkCouponStatus(); // Re-check the coupon count after sending an email
        })
        .catch((error) => {
            document.getElementById('emailStatus').innerText = 'Error sending email. Please try again.';
            console.error('Error sending email:', error);
        });
    }

    // Function to check and display the coupon status
    function checkCouponStatus() {
        firebase.firestore().collection('supplies').doc('total')
        .get()
        .then(doc => {
            if (doc.exists) {
                var couponData = doc.data();
                couponStatus.innerText = 'Remaining Unredeamed Coupons: ' + couponData.count;
            } else {
                couponStatus.innerText = 'No coupon data available.';
            }
        })
        .catch(error => {
            couponStatus.innerText = 'Error fetching coupon data.';
            console.error("Error getting document:", error);
        });
    }
});
