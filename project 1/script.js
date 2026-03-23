const form = document.getElementById("userForm");
const container = document.getElementById("cardContainer");
const search = document.getElementById("search");

let users = JSON.parse(localStorage.getItem("users")) || [];

// LOAD USERS ON START
displayUsers(users);

// FORM SUBMIT
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const github = document.getElementById("github").value.trim();

    // CONDITIONAL VALIDATION
    if (!name || !email || !github) {
        alert("All fields are required!");
        return;
    }

    try {
        // FETCH GITHUB DATA (ASYNC)
        const res = await fetch(`https://api.github.com/users/${github}`);
        const data = await res.json();

        if (data.message === "Not Found") {
            alert("GitHub user not found!");
            return;
        }

        const user = {
            name,
            email,
            github,
            avatar: data.avatar_url,
            followers: data.followers,
            repos: data.public_repos
        };

        users.push(user);

        // STORE DATA
        localStorage.setItem("users", JSON.stringify(users));

        displayUsers(users);
        form.reset();

    } catch (error) {
        console.log(error);
        alert("Error fetching data!");
    }
});

// Delete the card function.

function deleteUser(index) {
  // remove user
  users.splice(index, 1);

  // update localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // re-render UI
  displayUsers(users);
}

// DISPLAY USERS (LOOP USE)
function displayUsers(userList) {
  container.innerHTML = "";

  userList.forEach((user, index) => {
    const card = `
      <div class="card">
        <img src="${user.avatar}" />
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <p>@${user.github}</p>
        <p>👥 Followers: ${user.followers}</p>
        <p>📦 Repos: ${user.repos}</p>
        <button onclick="deleteUser(${index})">Delete</button>
      </div>
    `;
    container.innerHTML += card;
  });
}

// SEARCH FUNCTION
search.addEventListener("input", () => {
    const value = search.value.toLowerCase();

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(value) ||
        user.github.toLowerCase().includes(value)
    );

    displayUsers(filtered);
});