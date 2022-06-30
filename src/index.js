import "./style.css"
import { faker } from '@faker-js/faker';


let users = [];

let usersTable = document.getElementById('users-table');


function createUser(){
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


const infinteObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadNewUsers();
    }
  },
  { threshold: 1 }
);

function loadNewUsers(){
    for(let i = 0; i < 20; i++){
        createUser();
    }

    const lastUser = document.querySelector(".user-record:last-child");
    if (lastUser) {
        infinteObserver.observe(lastUser);
    }
};


loadNewUsers();


const scrollToTopButton = document.getElementById("scroll-to-top");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > window.innerHeight / 2 || document.documentElement.scrollTop > window.innerHeight / 2) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
}

scrollToTopButton.addEventListener('click', topFunction);

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}




function contains(query, searchOption) {
    if(searchOption === 'email')
        return users.filter((user) =>
            user.email.toLowerCase().includes(query.toLowerCase())
        );
    else if(searchOption === 'birthdate')
        return users.filter((user) =>
            user.birthDate.toLowerCase().includes(query.toLowerCase())
        );
    else
        return users.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        );
}
  

const server = {
    search([query, searchOption]) {

      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              list: query ? contains(query, searchOption) : [],
            }),
          150
        );
      });
    },
};

  
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById("search-results");



function handleSearchInput(e){

    const { value } = e.target;


    const emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const dateRegExp = /\d{1,2}[/.-]\d{1,2}[/.-]\d{4}/;

    let arg = [];

    if(emailRegExp.test(value)){
        arg = [value, 'email'];
    }else if(dateRegExp.test(value)){
        arg = [value, 'birthdate'];
    }else{
        arg = [value, 'username'];
    }
  
    server.search(arg).then(function (response) {
        const { list } = response;

        if(value){
            searchResults.style.display = 'table';
            usersTable.style.display = 'none';
        }else{
            searchResults.style.display = 'none';
            usersTable.style.display = 'table';
        }

        if(list.length == 0){
            searchResults.innerHTML = "Sorry, we do not have any users with such data!";
            return;
        }

        const html = list.reduce((markup, user) => {
            return `
                ${markup}
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.birthDate}</td>
                </tr>
                `;
        }, ``);
    
        searchResults.innerHTML = `
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Birthdate</th>
            </tr>
        ` + html;
    });
}



function debounce(callee, timeoutMs) {
    return function perform(...args) {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();
      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }
      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  }


const debouncedHandle = debounce(handleSearchInput, 250);

searchInput.addEventListener("input", debouncedHandle);


document.getElementById('search').addEventListener('submit', (e) => {e.preventDefault();});
  






