function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('careerForm');
    const formData = new FormData(form);

    fetch('submit_form.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('confirmationMessage').style.display = 'block';
        } else {
            alert(data.message || 'Submission failed. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));

    form.reset();
}
