//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ** ** ** Promisifying the geoLocation API ** ** ** //

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// Based on the getPosition function we will use the "whereAMI" function to display country info
const whereAmi = function () {
  getPosition()
    .then((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
    })
    .then((response) => {
      if (response.status === 403)
        throw new Error(
          `${response.status} You are sending too much requests, please try again in a while`
        );
      if (response.status === 200) return response.json();
    })
    .then((data) => {
      // Guarde clause
      if (data.standard?.city == "Undefined")
        throw new Error(`NO country found with these coordinates`);

      if (data.city) {
        console.log(`You are in ${data.state}, ${data.country}`);
        console.log(data);
        return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
      }
    })
    .then((response) => response.json())
    .then((data) => renderData(data[0]))
    .catch((err) => console.error(`${err}`))
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener("click", whereAmi);
