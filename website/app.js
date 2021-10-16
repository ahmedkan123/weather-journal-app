/* Global Variables */
const apiKey = "850003ab949237d7c642e53d6ff1aace";
const generateButton = document.querySelector("#generate");
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

// add eventlistener on button for get data from api and save on server and retrieve too.
generateButton.addEventListener("click", async () => {
  try {
    const zipCode = document.querySelector("#zip").value;
    const content = document.querySelector("#feelings").value;
    if (!zipCode) {
      alert("please you should enter zipcode");
      return;
    }
    getDataWeatherTemp(zipCode)
      .then((temp) => {
        postDataOnServer(temp, content);
      })
      .then(getDataFromServer)
      .then((representData) => {
        updateUiData(representData);
      });

    // postDataOnServer(temp, content);
    // getDataFromServer();
  } catch (error) {
    console.log("Error:", error);
  }
});

// function get data from external api and return temp
async function getDataWeatherTemp(zipCode) {
  const fulUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;
  const response = await fetch(fulUrl);
  const dataWeather = await response.json();
  const temp = dataWeather.main.temp;
  return temp;
}
// function to save to data on server by endpoint post method
async function postDataOnServer(temp, content) {
  await fetch("/saveDataWeather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: newDate,
      temp,
      content,
    }),
  });
}

// function to get data from server by endpoint get method
async function getDataFromServer() {
  const getDataResponse = await fetch("/getWeatherData");
  const representData = await getDataResponse.json();
  // console.log(representData);
  //// update ui dynamically
  // const dateDay = document.querySelector("#date");
  // const tempCountry = document.querySelector("#temp");
  // const contentFeelings = document.querySelector("#content");
  // dateDay.innerHTML = `Date is : ${representData.date}`;
  // tempCountry.innerHTML = `Temp is : ${representData.temp}`;
  // contentFeelings.innerHTML = `Content is : ${representData.content}`;
  return representData;
}

// function for update ui to data dynamically
async function updateUiData(representData) {
  const dateDay = document.querySelector("#date");
  const tempCountry = document.querySelector("#temp");
  const contentFeelings = document.querySelector("#content");
  dateDay.innerHTML = `Date is : ${representData.date}`;
  tempCountry.innerHTML = `Temp is : ${representData.temp}`;
  contentFeelings.innerHTML = `Content is : ${representData.content}`;
}
