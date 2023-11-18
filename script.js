document.getElementById('trueButton').addEventListener('click', generateQR);
document.getElementById('falseButton').addEventListener('click', generateQR);
document.getElementById('emailButton').addEventListener('click', sendEmail);

function generateQR() {
    var qr = new QRious({
        element: document.getElementById('qrCodeCanvas'), // Updated to target the new canvas element
        size: 200,
        value: 'Your unique response code'
    });
}

function sendEmail() {
    var username = document.getElementById('username').value;
    var email = username + '@upmc.edu';
    var qrCodeCanvas = document.getElementById('qrCodeCanvas'); // Updated to target the new canvas element
    var qrCodeURL = qrCodeCanvas.toDataURL("image/png"); // Correctly get the data URL from the canvas

    var subject = encodeURIComponent('Your QR Code for Food for Thought');
    var body = encodeURIComponent('Here is your QR code: ') + qrCodeURL;

    var mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    window.open(mailtoLink, '_blank');
}
