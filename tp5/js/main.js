var app;
window.onload = function () {
  app = new Vue({
    el: "#weatherApp", // cible l'élément HTML où nous pourrons utiliser toutes les variables ci-dessous
    data: {
      // sera utilisé comme indicateur de chargement de l'application
      loaded: false,

      // cityName, variable utilisé dans le formulaire via v-model
      formCityName: "",

      message: "WebApp Loaded.",
      messageForm: "",

      // liste des villes saisies, initialiser avec Paris
      cityList: [
        {
          name: "Paris",
        },
      ],

      // cityWeather contiendra les données météo reçues par openWeatherMap
      cityWeather: null,

      // indicateur de chargement
      cityWeatherLoading: false,
    },

    // 'mounted' est exécuté une fois l'application VUE totalement disponible
    mounted: function () {
      this.loaded = true;
      this.readData();
    },
    computed: {
      localTime() {
        if (!this.cityWeather) return "";
        const utc = Date.now() + (this.cityWeather.timezone * 1000)- 3600 * 1000;
        return new Date(utc).toLocaleTimeString();
      },
    },

    // ici, on définit les méthodes qui vont traiter les données décrites dans DATA
    methods: {
      readData: function (event) {
        console.log("JSON.stringify(this.cityList)", JSON.stringify(this.cityList));
        console.log("this.loaded:", this.loaded);
      },

      addCity: function (event) {
        event.preventDefault(); // pour ne pas recharger la page à la soumission du formulaire

        // Vérifie si la ville existe déjà
        if (this.isCityExist(this.formCityName)) {
          this.messageForm = "La ville existe déjà";
        } else {
          this.cityList.push({ name: this.formCityName });
          this.messageForm = "";
        }

        // remise à zéro du champ de saisie
        this.formCityName = "";
        console.log("formCityName:", this.formCityName);
      },

      isCityExist: function (_cityName) {
        // Retourne true si la ville existe déjà (insensible à la casse)
        return (
          this.cityList.filter(
            (item) => item.name.toUpperCase() == _cityName.toUpperCase()
          ).length > 0
        );
      },

      remove: function (_city) {
        // Supprime la ville de la liste
        this.cityList = this.cityList.filter((item) => item.name != _city.name);
      },

      meteo: function (_city) {
        this.cityWeatherLoading = true;

        // appel AJAX avec fetch
        fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" + _city.name + "&units=metric&lang=fr&appid=47198250a6df253cc73fe6f44657ee78"
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            app.cityWeatherLoading = false;

            // test du code retour
            if (json.cod == 200) {
              // on met la réponse du webservice dans la variable cityWeather
              app.cityWeather = json;
              app.message = null;
              Vue.nextTick(function () {
                if (app._map) {
                  app._map.remove();
                }
                app._map = L.map('map').setView(
                  [json.coord.lat, json.coord.lon],
                  10
                );
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }).addTo(app._map);
                L.marker([json.coord.lat, json.coord.lon]).addTo(app._map);
              });
            } else {
              app.cityWeather = null;
              app.message =
                "Météo introuvable pour " +
                _city.name +
                " (" +
                json.message +
                ")";
            }
          });
      },

    },
  });
};
