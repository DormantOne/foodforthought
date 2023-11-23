// Parse URL parameters and populate form fields
function populateFormFields() {
    var urlParams = new URLSearchParams(window.location.search);
    document.getElementById('username').value = urlParams.get('username') || '';
    document.getElementById('question').value = urlParams.get('question') || '';
    document.getElementById('answer').value = urlParams.get('answer') || '';
}

// Add event listener for form submission
document.getElementById('responseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted!'); // Replace with your submission logic
    // Logic to handle form submission to Firestore
    // Include database verification and user feedback
});

// Call function to populate fields when the page loads
populateFormFields();
