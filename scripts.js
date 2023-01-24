/*
! IMPORTANT - CORS -  cross origin resource sharing -
* a domain name is an origin Ex: github.com is an origin
* due to CORS, by default and security issues you can´t access data from a website to another website, it will give you an error, you can if it is the same wesite, ex.: 
* you can fetch data from github.com to help.github.com because it is the same origin and the origin means the same domain in this case 'github.com';
^ if you´re using a local file... the url in browser would be something like... c://asd/asd/index.html or file:// ... you get it, so the first step to fetch data from another website to your own is to your file(website) in a server, it can be localhost or domain, myweb.com for example,
^ the second step, there´s is nothing you can do by your hands, because the website you´re trying to get data needs to allow your website to get the data, and this can be done by a line of code in the server of the website that you´re trying to get data from, the line is Access-Control-Allow-Origin: (your website);
* Ex.: imagine that you want to allow myfriend.com to access data from your website you have to insert this line Access-Control-Allow-Origin: myfriend.com

& All of this is called CORS Policy

* Sometimes the error is because of the browser , if you´re using the browser to access the API, without the Access-Control-Allow-Origin you won´t go anywhere, solutions to this is using server, node.js, PHP, ruby etc...
*---------------------OR-------------------
* you can also use a proxy CORS, BUT don´t ever do it if it has sensitive data like passwords, adresses, emails, because a proxy CORS is nothing more than a server used to get data from the website you want, then send it to you, but they get to see your data and what you fetched for, so dont use this with passwords emails etc...
*/
//* variavel api contem o link da api
const api = 'http://api.openweathermap.org/data/2.5/weather';
//* usar CORS proxy para aceder aos dados da api
const proxy = 'https://cors-anywhere.herokuapp.com/'
//* in the variable key, use your openweather key, you can obtain it here https://openweathermap.org/
const key = '7b1013440267dc18a3e3de3646adda17';
//* seleciona o elemento form
const form = document.querySelector('form.search');
//* seleciona o element div
const weatherGrid = document.querySelector('.weather');
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const map = `https://www.bing.com/maps/embed?h=400&w=500&cp=${lat}~${long}&lvl=19&typ=d&sty=r&src=SHELL&FORM=MBEDV8`
    console.log('lat -> '+ lat + ' long -> '+ long);
    const geolocationApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`
    const apicoords = fetch(`${proxy}${geolocationApi}`);
    console.log(apicoords);
    const html = `
        <div>
            <p>Latitude: ${lat}</p>
            <p>Longitude: ${long}</p>
            <iframe width="500" height="400" frameborder="0" src="${map}" scrolling="no"></iframe>
        </div>
    `
    weatherGrid.innerHTML = html;
});
//* esta funcao vai usar a variavel 
async function fetchWeather(city){
    //* variavel res e o resultado da consulta (parametro query) feita na api, o conteudo retornado pela api sera guardado na variavel res
    const res = await fetch(`${proxy}${api}?q=${city}&appid=${key}`);
    const data = await res.json();
    return data;
}

async function handleSubmit(event){
    event.preventDefault();
    const weather_form = event.currentTarget;
    //*turn the form off
    weather_form.submit.disabled = true;
    //*submit the search
    const weather = await fetchWeather(weather_form.query.value);
    console.log(weather);
    weather_form.submit.disabled = false;
    
    //fetchWeather(weather_form.query.value);
    displayWeather(weather); //here i can use all of the data the api gives me, weather.name, weather.clouds, weather.coord etc...
}

function kToC(value){
    const conversao = Math.floor(value - 273.15);
    return conversao;
}
function displayWeather(tempo){ //this weather is the name of the city
    console.log('creating HTML');
    const html = `
        <div>
            <h2>${tempo.name}</h2>
            <p>Country: ${tempo.sys.country}</p>
            <p>Temperature: ${kToC(tempo.main.temp)}Cº</p>
            <p>Wind speed: ${tempo.wind.speed} Km/h</p>
            <p>Description: ${tempo.weather[0].description}</p>
        </div>
    `;
    
    weatherGrid.innerHTML += html;
}

form.addEventListener('submit', handleSubmit);