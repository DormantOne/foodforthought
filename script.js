document.getElementById('trueButton').addEventListener('click', generateQR);
document.getElementById('falseButton').addEventListener('click', generateQR);
document.getElementById('emailButton').addEventListener('click', sendEmail);

function generateQR() {
    var qr = new QRious({
        element: document.getElementById('qrCode'),
        size: 200,
        value: 'Your unique response code'
    });
}

function sendEmail() {
    var username = document.getElementById('username').value;
    var email = username + '@upmc.edu';
    var qrCodeURL = document.getElementById('qrCode').toDataURL("image/png");

    var subject = encodeURIComponent('Your QR Code for Food for Thought');
    var body = encodeURIComponent('Here is your QR code: ') + qrCodeURL;

    var mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    window.open(mailtoLink, '_blank');
}
