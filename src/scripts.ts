/**
 * OpenWeather API Example
 * Copyright (C) 2023  João Rodrigues, João Torres
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const api = new URL("https://api.openweathermap.org/data/2.5/weather");

const proxy = new URL("https://cors-anywhere.herokuapp.com/");

const KEY = "your key";

const form = document.querySelector("form.search") as HTMLFormElement;
const weatherGrid = document.querySelector(".weather");

navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const { latitude, longitude } = coords;

    const map = new URL("https://www.bing.com/maps/embed");
    map.searchParams.set("h", "400");
    map.searchParams.set("w", "500");
    map.searchParams.set("cp", `${latitude}~${longitude}`);
    map.searchParams.set("lvl", "19");
    map.searchParams.set("typ", "d");
    map.searchParams.set("sty", "r");
    map.searchParams.set("src", "SHELL");
    map.searchParams.set("FORM", "MBEDV8");

    const geolocationApi = new URL("https://api.openweathermap.org/data/2.5/weather");
    geolocationApi.searchParams.set("lat", latitude.toString());
    geolocationApi.searchParams.set("lon", longitude.toString());
    geolocationApi.searchParams.set("appid", KEY);

    if (localStorage.getItem("localWeather") == null) {
        const apicoords = await fetch(new URL(geolocationApi.toString(), proxy));

        if (apicoords.ok) {
            const data = await apicoords.json();
            const city = data.name;
            const html = `
                <div>
                    <p>Latitude: ${latitude}</p>
                    <p>Longitude: ${longitude}</p>
                    <p>Cidade: ${city}</p>
                    <iframe width="500" height="400" frameborder="0" src="${map}" scrolling="no"></iframe>
                </div>
                `;

            if (weatherGrid != undefined) {
                weatherGrid.innerHTML = html;
            }

            localStorage.setItem('localWeather', JSON.stringify(data));
        }
    } else {
        const data = localStorage.getItem('localWeather');

        if (data == null) {
            return;
        }

        const weatherData = JSON.parse(data);

        const city = weatherData.name;

        const html = `
        <div>
            <p>Latitude: ${latitude}</p>
            <p>Longitude: ${longitude}</p>
            <p>Cidade: ${city}</p>
            <iframe width="500" height="400" frameborder="0" src="${map}" scrolling="no"></iframe>
        </div>
        `

        if (weatherGrid != undefined) {
            weatherGrid.innerHTML = html;
        }
    }
});

async function fetchWeather(city: string) {
    if (localStorage.getItem(`${city.toLowerCase()}`) === null) {
        const resource = new URL (api.toString(), proxy);
        resource.searchParams.set("q", city);
        resource.searchParams.set("appid", KEY);

        const res = await fetch(resource);
        const data = await res.json();
        localStorage.setItem(`${city.toLowerCase()}`, JSON.stringify(data));
        return data;
    } else {
        const weatherData = JSON.parse(localStorage.getItem(`${city.toLowerCase()}`) ?? "");
        return weatherData;
    }
}

async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const weather_form = event.currentTarget as HTMLFormElement;

    if (weather_form == null) {
        return;
    }

    //weather_form.submit.disabled = true;

    const weather = await fetchWeather(weather_form["query"].value);

    //weather_form.submit.disabled = false;

    //fetchWeather(weather_form.query.value);
    displayWeather(weather); //here i can use all of the data the api gives me, weather.name, weather.clouds, weather.coord etc...
}

function kToC(value: number) {
    const conversao = Math.floor(value - 273.15);
    return conversao;
}

function displayWeather(tempo: any) {
    if (weatherGrid == undefined) {
        return;
    }

    console.log(tempo);

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

form?.addEventListener('submit', handleSubmit);
