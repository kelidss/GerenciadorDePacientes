async function fetchPatients() {
    try {
        const response = await fetch('http://127.0.0.1:5000/patients');
        if (!response.ok) throw new Error('Erro ao buscar pacientes');
        const patients = await response.json();
        const patientsTableBody = document.querySelector('#patientsTable tbody');
        patientsTableBody.innerHTML = '';
        patients.forEach(patient => {
            const row = document.createElement('tr');
            const patientJson = {
                id: patient.id,
                name: patient.name,
                birth_date: new Date(patient.birth_date).toISOString().split('T')[0],
                age: patient.age,
                phone: patient.phone,
                email: patient.email,
                medical_history: patient.medical_history,
                address: patient.address
            };
            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.phone}</td>
                <td>${patient.email}</td>
                <td>${patient.medical_history}</td>
                <td>
                <button class="btn-action btn-visit" onClick="openVisitsModal(${patient.id})">Visitas</button>
                <button class="btn-action btn-edit" onClick='openEditPatientModal(${JSON.stringify(patient)})'>Editar</button>
                <button class="btn-action btn-delete" onClick="deletePatient(${patient.id})">Excluir</button>
                </td>
            `;
            patientsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function fetchVisits(patientId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/patients/${patientId}/visits`);
        if (!response.ok) throw new Error('Erro ao buscar visitas');
        const visits = await response.json();
        const visitsTableBody = document.querySelector('#visitsTable tbody');
        visitsTableBody.innerHTML = '';
        visits.forEach(visit => {
            const row = document.createElement('tr');
            row.innerHTML = `
                 <td>${formatDate(visit.visit_date)}</td>
                <td>${visit.summary}</td>
                <td>
                    <button class="btn-action btn-delete " onClick="deleteVisit(${visit.id}, ${patientId})">Excluir</button>
                </td>
            `;
            visitsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}


function openEditPatientModal(patientJson) {
    var modal = document.getElementById("editPatientModal");
    var closeBtn = document.getElementById("closeEditPatientModal");

    modal.style.display = "block";

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    editPatientId = patientJson.id;

    document.getElementById("name_edit").value = patientJson.name;
    document.getElementById("birth_date_edit").value = new Date(patientJson.birth_date).toISOString().split('T')[0];
    document.getElementById("address_edit").value = patientJson.address;
    document.getElementById("phone_edit").value = patientJson.phone;
    document.getElementById("email_edit").value = patientJson.email;
    document.getElementById("medical_history_edit").value = patientJson.medical_history;
}

function openVisitsModal(patientId) {
    var modal = document.getElementById("VisitsModal");
    var closeBtn = document.getElementById("closeVisitsModal");

    modal.style.display = "block";

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    fetchVisits(patientId);
    document.getElementById('patient_id').value = patientId;
    // document.getElementById('visit_summary').value = patientId;
    // document.getElementById('visit_date').value = patientId;
}

async function deletePatient(patientId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/patients/${patientId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await fetchPatients();
        } else {
            throw new Error('Erro ao excluir paciente');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function deleteVisit(visitId, patientId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/visits/${visitId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await fetchVisits(patientId);
        } else {
            throw new Error('Erro ao excluir visita');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}


async function submitPatientForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const birth_date = document.getElementById('birth_date').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const medical_history = document.getElementById('medical_history').value;

    const data = {
        name: name,
        birth_date: birth_date,
        address: address,
        phone: phone,
        email: email,
        medical_history: medical_history
    };

    try {
        let response = await fetch('http://127.0.0.1:5000/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            await fetchPatients();
            document.getElementById('addPatientForm').reset();
        } else {
            throw new Error('Erro ao salvar paciente');
        }
    } catch (error) {
        console.error('Error saving patient:', error);
    }
}

async function submitEditPatientForm(event) {
    event.preventDefault();
    const name = document.getElementById('name_edit').value;
    const birth_date = document.getElementById('birth_date_edit').value;
    const address = document.getElementById('address_edit').value;
    const phone = document.getElementById('phone_edit').value;
    const email = document.getElementById('email_edit').value;
    const medical_history = document.getElementById('medical_history_edit').value;

    const data = {
        name: name,
        birth_date: birth_date,
        address: address,
        phone: phone,
        email: email,
        medical_history: medical_history
    };

    try {
        const response = await fetch(`http://127.0.0.1:5000/patients/${editPatientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            await fetchPatients();
            document.getElementById('editPatientForm').reset();
            document.getElementById("editPatientModal").style.display = "none";
        } else {
            throw new Error('Erro ao salvar paciente');
        }
    } catch (error) {
        console.error('Error saving patient:', error);
    }
}

async function submitAddVisitForm(event) {
    event.preventDefault();
    const visit_date = document.getElementById('visit_date').value;
    const summary = document.getElementById('visit_summary').value;
    const patient_id = document.getElementById('patient_id').value;

    const data = {
        visit_date: visit_date,
        summary: summary,
        patient_id: patient_id
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/visits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            await fetchVisits(patient_id);
            document.getElementById('addVisitForm').reset();
        } else {''
            throw new Error('Erro ao adicionar visita');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11, então adicionamos 1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

// Executa ao iniciar a pagina
document.addEventListener('DOMContentLoaded', () => {
    fetchPatients(); // Insere os dados do paciente no Grid

    // functions para envios dos dados
    document.getElementById('addPatientForm').addEventListener('submit', submitPatientForm);
    document.getElementById('editPatientForm').addEventListener('submit', submitEditPatientForm);
    document.getElementById('addVisitForm').addEventListener('submit', submitAddVisitForm);
});