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
            submitQRButton.disabled = false;
        } else {
            document.getElementById('emailStatus').innerText = 'Wrong answer. Please try again.';
        }
    }

    function generateQR(answer) {
        var username = document.getElementById('username').value;
        // [Rest of the generateQR function]
    }

    // [Rest of the sendEmail function]
});
