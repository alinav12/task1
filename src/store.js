import { faker } from '@faker-js/faker';


export let users = [];

export let usersTable = document.getElementById('users-table');


export function createUser(){
    let userName = faker.internet.userName();
    let userEmail = faker.internet.email();
    let userBirthDate = new Intl.DateTimeFormat('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}).format(faker.date.birthdate());
    users.push({
        username: userName,
        email: userEmail,
        birthDate: userBirthDate,
    });

    let tr = document.createElement('tr');
    tr.className = "user-record";
    tr.innerHTML = `
        <td>${userName}</td>
        <td>${userEmail}</td>
        <td>${userBirthDate}</td>
    `;
    usersTable.append(tr);
}