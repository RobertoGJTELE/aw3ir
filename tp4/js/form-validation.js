window.onload = function () {
    displayContactList();
    console.log("DOM ready!");
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();

        const nom = document.querySelector("#nom").value.trim();
        const prenom = document.querySelector("#prenom").value.trim();
        const adresse = document.querySelector("#adresse").value.trim();
        const email = document.querySelector("#email").value.trim();
        const birthday = document.querySelector("#date").value;
        let valid = true;

        if (nom.length < 5) { alert("Le nom doit contenir au moins 5 caractères !"); valid = false; }
        if (prenom.length < 5) { alert("Le prénom doit contenir au moins 5 caractères !"); valid = false; }
        if (adresse.length < 5) { alert("L’adresse doit contenir au moins 5 caractères !"); valid = false; }
        if (!validateEmail(email)) { alert("L'adresse e-mail n'est pas valide !"); valid = false; }

        if (new Date(birthday).getTime() > Date.now()) {
            alert("La date de naissance ne peut pas être dans le futur !");
            valid = false;
        }

        if (valid) {
            contactStore.add(nom, prenom, birthday, adresse, email);
        }

        showModal(valid, prenom, birthday, adresse);

        displayContactList();
    });

const resetBtn = document.getElementById("resetBtn");
    if(resetBtn) resetBtn.addEventListener("click", resetContactList);
    const gpsBtn=document.getElementById("gpsBtn");
    if(gpsBtn) gpsBtn.addEventListener("click", getLocation);
};


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function calcNbChar(id) {
  const countElement = document
    .querySelector(`#${id}`)
    .parentElement.parentElement.querySelector("[data-count]");
  // on cherche le champ de saisie avec l'identifiant donné en paramêtre,
  // puis on remonte de 2 noeuds au dessus pour trouver ensuite
  // l'élément qui a l'attribut data-count
  countElement.textContent = document.querySelector(`#${id}`).value.length + " car.";
}


function showModal(valid, prenom, birthday, adresse) {
    const modalTitle = document.querySelector(".modal-title");
    const modalBody = document.querySelector(".modal-body");

 if (valid) {
            firstname = prenom;
            lastname = nom;
            modalTitle.textContent = `Bienvenue, ${prenom}!`;
            modalBody.innerHTML = `
                <p>Vous êtes né(e) le ${birthday} et vous habitez :</p>
                <div id="modalMap" style="height:300px; border-radius:10px;"></div> 
                <p><a href="http://maps.google.com/maps?q=${adresse}" target="_blank">${adresse}</a></p>
            `;
            const map = L.map("modalMap").setView([48.8566, 2.3522], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            }).addTo(map);

            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`)

                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        map.setView([lat, lon], 14);
                        L.marker([lat, lon])
                            .addTo(map)
                            .bindPopup(`<b>${firstname} ${lastname}</b><br>${adresse}`)
                            .openPopup();
                    }
                });
        } else {
            modalTitle.textContent = `Erreur dans le formulaire!`;
            modalBody.innerHTML = `<p>Tous les champs sont obligatoires.</p>`;
        }

        const myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();
    }
function displayContactList() {
  const contactListString = localStorage.getItem("contactList"); // ici on va récupérer la liste en forme de chaine de caractère (string)
  const contactList = contactListString ? JSON.parse(contactListString) : [];
  document.querySelector("table tbody").innerHTML = "";
  for (const contact of contactList) {
    document.querySelector("table tbody").innerHTML += `<tr>
  <td>${contact.name}</td>
  <td> ${contact.firstname} </td>
  <td>${contact.date}</td>
  <td> ${contact.adress} </td>
  <td>${contact.mail}</td> 
  <!-- CODE à compléter pour mettre en forme les données (lien vers google maps, mail cliquable) -->
  <tr>
  `;
  }
    const counter = document.getElementById("contact-count");
   if (counter) counter.textContent = `(${contactList.length})`;
}

function resetContactList() {
    if(confirm("Êtes-vous sûr de vouloir supprimer tous les contacts ?")) {
        contactStore.reset();   
        displayContactList();   
    }
}