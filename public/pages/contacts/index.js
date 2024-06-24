document.addEventListener('DOMContentLoaded', () => {
    loadDepartments();
});

function loadDepartments() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content

    db.collection('Contacts').doc('Departments').collection('departmentList').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const departmentData = doc.data();
                const departmentDiv = document.createElement('div');
                departmentDiv.innerHTML = `
                    <ul>
                        <h4>${departmentData.nickname}:</h4>
                        ${departmentData.contacts.map((contact, index) => `
                            <li>${String.fromCharCode(1488 + index)}. ${contact.name} - ${contact.phoneNumber}</li>
                        `).join('')}
                    </ul>
                    <br><br>
                `;
                contentDiv.appendChild(departmentDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching documents:', error);
        });
}
