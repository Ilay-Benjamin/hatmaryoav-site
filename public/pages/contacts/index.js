document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');
    const createCollectionButton = document.getElementById('create-collection-button');
    const addDepartmentButton = document.getElementById('add-department-button');

    authButton.addEventListener('click', authenticate);
    createCollectionButton.addEventListener('click', createContactsCollection);
    addDepartmentButton.addEventListener('click', addDepartment);
});

function authenticate() {
    const codeInput = document.getElementById('auth-code').value;

    db.collection('Contacts').doc('Config').collection('permissions').doc('permissions').get()
    .then(doc => {
        if (doc.exists && doc.data().code === codeInput) {
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('manage-section').style.display = 'block';
            loadDepartments();
        } else {
            alert('Invalid code');
        }
    })
    .catch(error => {
        console.error('Error checking permissions document:', error);
    });
}

function createContactsCollection() {
    // Create the "permissions" document directly under the "Config" collection
    db.collection('Contacts').doc('Config').collection('permissions').doc('permissions').set({
        code: '123456' // Access code
    })
    .then(() => {
        console.log('Permissions document successfully created.');
    })
    .catch(error => {
        console.error('Error creating permissions document:', error);
    });

    // Create the "Departments" sub-collection with example department documents
    const departments = [
        {
            id: 'department1',
            nickname: 'מוקדים',
            contacts: [
                { id: 'contact1', name: 'חמל אגם חטיבתי', nickname: 'א', phoneNumber: '08-6354734' },
                { id: 'contact2', name: 'חמל תקשוב', nickname: 'ב', phoneNumber: '08-6354757' }
            ]
        },
        {
            id: 'department2',
            nickname: 'משאן',
            contacts: [
                { id: 'contact1', name: 'קמש"חית', nickname: 'א', phoneNumber: '054-9224686' },
                { id: 'contact2', name: 'ע\' קמש"ח', nickname: 'ב', phoneNumber: '050-2246389' }
            ]
        }
    ];

    departments.forEach(department => {
        db.collection('Contacts').doc('Departments').collection('departmentList').doc(department.id).set(department)
        .then(() => {
            console.log(`Department ${department.id} successfully created.`);
        })
        .catch(error => {
            console.error(`Error creating department ${department.id}:`, error);
        });
    });
}

function loadDepartments() {
    const departmentsDiv = document.getElementById('departments');
    departmentsDiv.innerHTML = ''; // Clear previous content
    db.collection('Contacts').doc('Departments').collection('departmentList').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const departmentData = doc.data();
                const departmentDiv = document.createElement('div');
                departmentDiv.className = 'department';
                departmentDiv.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3>${departmentData.nickname}</h3>
                            <div class="button-group">
                                <button class="btn btn-sm btn-warning me-2" onclick="editDepartment('${doc.id}')">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteDepartment('${doc.id}')">Delete</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                ${departmentData.contacts.map((contact, index) => `
                                    <li class="list-group-item">
                                        <strong>${String.fromCharCode(1488 + index)}. <br>${contact.name}</strong> 
                                        (${contact.nickname}) <br>${contact.phoneNumber}
                                        <div>
                                            <button class="btn btn-sm btn-warning float-end" onclick="editContact('${doc.id}', '${contact.id}')">Edit</button>               
                                            <br>    
                                            <button class="btn btn-sm btn-danger float-end me-2" onclick="deleteContact('${doc.id}', '${contact.id}')">Delete</button>
                                        </div>
                                    </li>   
                                `).join('')}
                            </ul>
                            <button class="btn btn-sm btn-primary mt-3" onclick="addContact('${doc.id}')">Add Contact</button>
                        </div>
                    </div>
                `;
                departmentsDiv.appendChild(departmentDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching documents:', error);
        });
}

function addContact(departmentId) {
    const name = prompt('Enter name:');
    const nickname = prompt('Enter nickname:');
    const phoneNumber = prompt('Enter phone number:');
    if (name && nickname && phoneNumber) {
        db.collection('Contacts').doc('Departments').collection('departmentList').doc(departmentId).update({
            contacts: firebase.firestore.FieldValue.arrayUnion({ id: generateUniqueId(), name, nickname, phoneNumber })
        }).then(() => {
            loadDepartments();
        }).catch(error => {
            console.error('Error adding contact:', error);
        });
    }
}

function addDepartment() {
    const nickname = prompt('Enter department nickname:');
    if (nickname) {
        const newDepartment = {
            id: generateUniqueId(),
            nickname,
            contacts: []
        };

        db.collection('Contacts').doc('Departments').collection('departmentList').doc(newDepartment.id).set(newDepartment)
        .then(() => {
            loadDepartments();
        })
        .catch(error => {
            console.error('Error adding department:', error);
        });
    }
}

function editDepartment(departmentId) {
    const departmentRef = db.collection('Contacts').doc('Departments').collection('departmentList').doc(departmentId);

    departmentRef.get()
        .then(doc => {
            if (doc.exists) {
                const departmentData = doc.data();
                const newNickname = prompt('Enter new department nickname:', departmentData.nickname);

                if (newNickname) {
                    departmentRef.update({ nickname: newNickname })
                        .then(() => {
                            loadDepartments();
                        })
                        .catch(error => {
                            console.error('Error updating department:', error);
                        });
                }
            }
        })
        .catch(error => {
            console.error('Error fetching department:', error);
        });
}

function deleteDepartment(departmentId) {
    db.collection('Contacts').doc('Departments').collection('departmentList').doc(departmentId).delete()
        .then(() => {
            loadDepartments();
        })
        .catch(error => {
            console.error('Error deleting department:', error);
        });
}

function editContact(departmentId, contactId) {
    const departmentRef = db.collection('Contacts').doc('Departments').collection('departmentList').doc(departmentId);
    
    departmentRef.get()
        .then(doc => {
            if (doc.exists) {
                const contacts = doc.data().contacts;
                const contact = contacts.find(contact => contact.id === contactId);
                
                if (contact) {
                    const newName = prompt('Enter new name:', contact.name);
                    const newNickname = prompt('Enter new nickname:', contact.nickname);
                    const newPhoneNumber = prompt('Enter new phone number:', contact.phoneNumber);
                    
                    if (newName && newNickname && newPhoneNumber) {
                        const updatedContacts = contacts.map(contact => 
                            contact.id === contactId 
                            ? { ...contact, name: newName, nickname: newNickname, phoneNumber: newPhoneNumber }
                            : contact
                        );

                        departmentRef.update({ contacts: updatedContacts })
                            .then(() => {
                                loadDepartments();
                            })
                            .catch(error => {
                                console.error('Error updating contact:', error);
                            });
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching document:', error);
        });
}

function deleteContact(departmentId, contactId) {
    const departmentRef = db.collection('Contacts').doc('Departments').collection('departmentList').doc(departmentId);
    
    departmentRef.get()
        .then(doc => {
            if (doc.exists) {
                const contacts = doc.data().contacts.filter(contact => contact.id !== contactId);

                departmentRef.update({ contacts })
                    .then(() => {
                        loadDepartments();
                    })
                    .catch(error => {
                        console.error('Error deleting contact:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error fetching document:', error);
        });
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
