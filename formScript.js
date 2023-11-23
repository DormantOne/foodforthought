// Parse URL parameters and populate form fields
function populateFormFields() {
    console.log("Populating form fields...");
    var urlParams = new URLSearchParams(window.location.search);
    document.getElementById('username').value = urlParams.get('username') || '';
    document.getElementById('question').value = urlParams.get('question') || '';
    document.getElementById('answer').value = urlParams.get('answer') || '';
}

// Initialize supplies if not already done
function initializeSupplies() {
    console.log("Checking and initializing supplies...");
    var suppliesRef = firebase.firestore().collection('supplies').doc('total');

    suppliesRef.get().then(doc => {
        if (!doc.exists) {
            console.log("Initializing supplies...");
            suppliesRef.set({ count: 100 })
                .then(() => console.log("Supplies initialized to 100"))
                .catch(error => console.error("Error initializing supplies:", error));
        } else {
            console.log("Supplies already initialized. Current count:", doc.data().count);
        }
    }).catch(error => {
        console.error("Error checking supplies initialization:", error);
    });
}

// Add event listener for form submission
document.getElementById('responseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Form submission triggered...");

    var username = document.getElementById('username').value;
    var question = document.getElementById('question').value;
    var answer = document.getElementById('answer').value;

    var responseRef = firebase.firestore().collection('responses').doc(username + '-' + question);
    var suppliesRef = firebase.firestore().collection('supplies').doc('total');

    firebase.firestore().runTransaction(transaction => {
        console.log("Running transaction...");
        return transaction.get(suppliesRef).then(supplyDoc => {
            if (!supplyDoc.exists || supplyDoc.data().count <= 0) {
                throw 'Sorry - supplies are exhausted.';
            }

            return transaction.get(responseRef).then(doc => {
                if (doc.exists && doc.data().redeemed) {
                    throw 'You have already redeemed this response.';
                } else {
                    var newSupplyCount = supplyDoc.data().count - 1;
                    transaction.update(suppliesRef, { count: newSupplyCount });
                    transaction.set(responseRef, {
                        username: username,
                        question: question,
                        answer: answer,
                        redeemed: true
                    }, { merge: true });
                    return newSupplyCount;
                }
            });
        });
    }).then(newSupplyCount => {
        console.log('Response successfully redeemed. Supplies remaining:', newSupplyCount);
        alert('Response successfully redeemed. Supplies remaining: ' + newSupplyCount);
    }).catch(error => {
        console.error('Transaction failed:', error);
        alert(error);
    });
});

// Call function to populate fields and initialize supplies when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event triggered");
    populateFormFields();
    initializeSupplies();
});
