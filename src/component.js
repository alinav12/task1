import {users, usersTable, createUser} from "./store";


const infinteObserver = new IntersectionObserver(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        loadNewUsers();
      }
    },
    { threshold: 1 }
  );

export function loadNewUsers(){
    for(let i = 0; i < 20; i++){
        createUser();
    }

    const lastUser = document.querySelector(".user-record:last-child");
    if (lastUser) {
        infinteObserver.observe(lastUser);
    }
};


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


function contains(query) {
    return users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()) || user.birthDate.toLowerCase().includes(query.toLowerCase())
    );
}
  

const server = {
    search(query) {

      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              list: query ? contains(query) : [],
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
  
    server.search(value).then(function (response) {
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

