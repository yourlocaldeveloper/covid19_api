const form = document.getElementById('new-patient-form');

form.addEventListener('submit', submitPatient);

// Fetch all cats as soon as app is loaded
getAllPatients();
// ********************************************
