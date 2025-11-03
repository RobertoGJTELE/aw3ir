window.onload = function () {
    console.log("DOM ready!");

    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();

        const nom = document.querySelector("#nom").value.trim();
        const prenom = document.querySelector("#prenom").value.trim();
        const adresse = document.querySelector("#adresse").value.trim();
        const email = document.querySelector("#email").value.trim();
        const birthday = document.querySelector("#date").value;
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
            modalTitle.textContent = `Bienvenue, ${prenom}!`;
            modalBody.innerHTML = `
                <p>Vous êtes né(e) le ${birthday} et vous habitez :</p>
                <img 
                    src="https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(adresse)}&zoom=12&size=400x200&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg"
                    class="img-fluid" alt="Carte Google Maps" 
                    style="border-radius:10px;"/>
                <p>${adresse}</p>
            `;
        } else {
            modalTitle.textContent = `Erreur dans le formulaire!`;
            modalBody.innerHTML = `
                <p>Tous les champs sont obligatoires.</p>
            `;
        }

        const myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();
    });
};

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
