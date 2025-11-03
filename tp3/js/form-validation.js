window.onload = function () {
    console.log("DOM ready!");

    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();

        const nom = document.querySelector("#nom").value.trim();
        const prenom = document.querySelector("#prenom").value.trim();
        let adresse = document.querySelector("#adresse").value.trim();
        const email = document.querySelector("#email").value.trim();
        const birthday = document.querySelector("#date").value;

        let firstname, lastname;
        let valid = true;

        if (nom.length < 5) {
            alert("Le nom doit contenir au moins 5 caractères !");
            valid = false;
        }
        if (prenom.length < 5) {
            alert("Le prénom doit contenir au moins 5 caractères !");
            valid = false;
        }
        if (adresse.length < 5) {
            alert("L’adresse doit contenir au moins 5 caractères !");
            valid = false;
        }
        if (!validateEmail(email)) {
            alert("L'adresse e-mail n'est pas valide !");
            valid = false;
        }

        const birthdayDate = new Date(birthday);
        const birthdayTimestamp = birthdayDate.getTime();
        const nowTimestamp = Date.now();

        if (birthdayTimestamp > nowTimestamp) {
            alert("La date de naissance ne peut pas être dans le futur !");
            valid = false;
        }

        const modalTitle = document.querySelector(".modal-title");
        const modalBody = document.querySelector(".modal-body");

        if (valid) {
            firstname = prenom;
            lastname = nom;
            modalTitle.textContent = `Bienvenue, ${prenom}!`;
            modalBody.innerHTML = `
                <p>Vous êtes né(e) le ${birthday} et vous habitez :</p>
                <div id="map" style="height:300px; border-radius:10px;"></div> 
                <p><a href="http://maps.google.com/maps?q=${adresse}" target="_blank">${adresse}</a></p>
            `;

            const map = L.map("map").setView([48.8566, 2.3522], 13);

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
    });
};
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
