const apiKey = "your-openweathermap-api-key-here"; // Substitua por sua chave de API da OpenWeatherMap
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
const ipApiUrl = "https://ipapi.co/json/";
const geoApiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";

let currentUnit = "metric";
let scene, camera, renderer, particles;

function initWeatherEffect() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('weatherCanvas').appendChild(renderer.domElement);

    camera.position.z = 5;

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function updateWeatherEffect(weatherCondition) {
    if (particles) scene.remove(particles);

    let geometry, material, particleCount;
    if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
        particleCount = 300;
        geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * window.innerWidth * 0.5;
            positions[i + 1] = Math.random() * window.innerHeight * 1.5;
            positions[i + 2] = Math.random() * 10 - 5;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        material = new THREE.PointsMaterial({ color: 0x88ccff, size: 2, transparent: true, opacity: 0.7 });
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        function animateRain() {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i + 1] -= 6 + Math.random() * 2;
                if (positions[i + 1] < -window.innerHeight / 2) positions[i + 1] = window.innerHeight;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateRain);
        }
        animateRain();
    } else if (weatherCondition === "Clear") {
        particleCount = 80;
        geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * window.innerWidth * 0.8;
            positions[i + 1] = (Math.random() - 0.5) * window.innerHeight * 0.8;
            positions[i + 2] = Math.random() * 5;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        material = new THREE.PointsMaterial({ color: 0xffff99, size: 6, transparent: true, opacity: 0.6 });
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        function animateSun() {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] += Math.sin(Date.now() * 0.0005 + i) * 0.3;
                positions[i + 1] += Math.cos(Date.now() * 0.0005 + i) * 0.3;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateSun);
        }
        animateSun();
    } else if (weatherCondition === "Clouds") {
        
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

function getWeatherIcon(main, description, pop) {
    const desc = description.toLowerCase();
    if (main === "CLEAR") {
        return "wi-day-sunny";
    } else if (main === "CLOUDS") {
        if (desc.includes("chuva") || pop >= 0.2) return "wi-showers";
        return "wi-cloudy";
    } else if (main === "RAIN" || main === "DRIZZLE") {
        return "wi-rain";
    } else if (main === "SNOW") {
        return "wi-snow";
    } else if (main === "THUNDERSTORM") {
        return "wi-thunderstorm";
    } else if (main === "MIST" || main === "FOG") {
        return "wi-fog";
    }
    return "wi-day-sunny";
}

function getWeather(city = "") {
    const cityInput = document.getElementById("cityInput");
    const loader = document.getElementById("autoLoader");
    const inputValue = city || cityInput.value.trim();
    if (!inputValue) {
        alert("Por favor, digite uma cidade!");
        loader.style.display = "none";
        loader.classList.remove("loader");
        return;
    }

    clearWeather();
    clearForecast();
    loader.style.display = "block";
    loader.classList.add("loader");

    console.log("Iniciando busca para:", inputValue);
    const timestamp = new Date().getTime();
    fetch(`${weatherApiUrl}${encodeURIComponent(inputValue)}&appid=${apiKey}&units=${currentUnit}&lang=pt_br&t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados da OpenWeatherMap:", data);
            if (!data.main || !data.main.temp) {
                throw new Error("Dados de temperatura não encontrados.");
            }
            displayWeather(data);
            getForecast(inputValue);
        })
        .catch(error => {
            console.error("Erro ao buscar cidade:", error);
            showErrorAlert(`Erro: ${error.message}`);
            alert(`Erro ao carregar a cidade ${inputValue}: ${error.message}`);
            document.getElementById("temperature").textContent = "Temperatura indisponível";
        })
        .finally(() => {
            loader.style.display = "none";
            loader.classList.remove("loader");
        });
}

function getForecast(city) {
    console.log("Iniciando previsão para:", city);
    const timestamp = new Date().getTime();
    fetch(`${forecastApiUrl}${encodeURIComponent(city)}&appid=${apiKey}&units=${currentUnit}&lang=pt_br&t=${timestamp}`)
        .then(response => {
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            console.log("Dados da previsão:", data);
            displayForecast(data);
        })
        .catch(error => {
            console.error("Erro ao buscar previsão:", error);
            showErrorAlert(`Erro na previsão: ${error.message}`);
            alert(`Erro ao carregar a previsão para ${city}: ${error.message}`);
        });
}

function displayWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = today.toLocaleDateString('pt-BR', options);
    const capitalizedDate = dateString.replace(/(^|\s)(\w)/g, (match, p1, p2) => p1 + p2.toUpperCase());
    document.getElementById("currentDate").textContent = `Hoje, ${capitalizedDate}`;
    const temp = data.main.temp.toFixed(1).replace(".", ",");
    const weatherMain = data.weather[0].main.toUpperCase();
    const weatherDesc = data.weather[0].description.toLowerCase();
    const iconClass = getWeatherIcon(weatherMain, weatherDesc, 0);
    document.getElementById("temperature").innerHTML = `<i class="wi ${iconClass}"></i> Temperatura: ${temp}${currentUnit === "metric" ? "°C" : "°F"}`;
    document.getElementById("description").innerHTML = `<i class="wi ${iconClass}"></i> Condição: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Umidade: ${data.main.humidity}%`;
    const windSpeed = currentUnit === "metric" ? data.wind.speed.toFixed(1).replace(".", ",") + " m/s" : (data.wind.speed * 2.237).toFixed(1).replace(".", ",") + " mph";
    document.getElementById("wind").textContent = `Vento: ${windSpeed}`;
    document.getElementById("cloudiness").textContent = `Nuvens: ${data.clouds.all}%`;
    document.getElementById("weatherResult").addEventListener("click", () => openModalToday(data));

    // Forçar a mudança de tema
    changeTheme(data.weather[0].main);
}

function displayForecast(data) {
    const forecastDays = document.getElementById("forecastDays");
    forecastDays.innerHTML = "";

    const dailyForecasts = [];
    const today = new Date().getDate();
    const forecastsByDay = {};

    for (const forecast of data.list) {
        const forecastDate = new Date(forecast.dt * 1000);
        const day = forecastDate.getDate();
        if (day === today) continue;

        if (!forecastsByDay[day]) {
            forecastsByDay[day] = {
                entries: [],
                maxPop: 0,
                maxPopEntry: null,
                minTemp: Infinity,
                maxTemp: -Infinity
            };
        }

        forecastsByDay[day].entries.push(forecast);
        forecastsByDay[day].maxPop = Math.max(forecastsByDay[day].maxPop, forecast.pop || 0);
        if (forecast.pop > forecastsByDay[day].maxPop) {
            forecastsByDay[day].maxPopEntry = forecast;
        }
        forecastsByDay[day].minTemp = Math.min(forecastsByDay[day].minTemp, forecast.main.temp);
        forecastsByDay[day].maxTemp = Math.max(forecastsByDay[day].maxTemp, forecast.main.temp);
    }

    for (const day in forecastsByDay) {
        const selectedEntry = forecastsByDay[day].maxPopEntry || forecastsByDay[day].entries[0];
        dailyForecasts.push({
            entry: selectedEntry,
            maxPop: forecastsByDay[day].maxPop,
            minTemp: forecastsByDay[day].minTemp,
            maxTemp: forecastsByDay[day].maxTemp,
            hourly: forecastsByDay[day].entries
        });

        if (dailyForecasts.length === 3) break;
    }

    console.log("Previsões por dia:", forecastsByDay);

    dailyForecasts.forEach(forecast => {
        const forecastDate = new Date(forecast.entry.dt * 1000);
        const dayName = forecastDate.toLocaleDateString("pt-BR", { weekday: "long" });
        const capitalizedDayName = dayName.replace(/(^|\s)(\w)/g, (match, p1, p2) => p1 + p2.toUpperCase());
        const temp = forecast.entry.main.temp.toFixed(1).replace(".", ",");
        const weatherMain = forecast.entry.weather[0].main.toUpperCase();
        const weatherDesc = forecast.entry.weather[0].description.toLowerCase();
        const iconClass = getWeatherIcon(weatherMain, weatherDesc, forecast.maxPop);
        const pop = Math.round(forecast.maxPop * 100);
        const dayDiv = document.createElement("div");
        dayDiv.className = "forecast-day";
        dayDiv.setAttribute("data-day", capitalizedDayName);
        dayDiv.setAttribute("data-temp", temp);
        dayDiv.setAttribute("data-condition", forecast.entry.weather[0].description);
        dayDiv.setAttribute("data-humidity", forecast.entry.main.humidity);
        dayDiv.setAttribute("data-wind", forecast.entry.wind.speed);
        dayDiv.setAttribute("data-pressure", forecast.entry.main.pressure);
        dayDiv.setAttribute("data-pop", pop);
        dayDiv.setAttribute("data-max-temp", forecast.maxTemp.toFixed(1).replace(".", ","));
        dayDiv.setAttribute("data-min-temp", forecast.minTemp.toFixed(1).replace(".", ","));
        dayDiv.setAttribute("data-date", forecastDate.toLocaleString());
        dayDiv.setAttribute("data-hourly", JSON.stringify(forecast.hourly));
        dayDiv.innerHTML = `
            <p><strong>${capitalizedDayName}</strong></p>
            <p><i class="wi ${iconClass}"></i> Temperatura: ${temp}${currentUnit === "metric" ? "°C" : "°F"}</p>
            <p><i class="wi ${iconClass}"></i> Condição: ${forecast.entry.weather[0].description}</p>
            <p>Chance de chuva: ${pop}%</p>
        `;
        dayDiv.addEventListener("click", () => openModal(dayDiv));
        dayDiv.addEventListener("dblclick", () => getWeather(dayDiv.getAttribute("data-day").split(",")[0]));
        forecastDays.appendChild(dayDiv);
    });
}

function changeTheme(weatherCondition) {
    console.log("Condição climática recebida:", weatherCondition); // Depuração
    const currentData = document.getElementById("temperature").textContent.match(/(\d+\.?\d*)/);
    const temp = currentData ? parseFloat(currentData[0].replace(",", ".")) : 0; 
    console.log("Temperatura extraída:", temp); // Depuração
    const newBackground = getBackgroundColor(weatherCondition, temp);
    console.log("Aplicando background:", newBackground); // Depuração
    document.body.style.background = newBackground;
    updateWeatherEffect(weatherCondition);
}

function getBackgroundColor(weatherCondition, temperature) {
    const condition = weatherCondition ? weatherCondition.toUpperCase() : "DEFAULT";
    const temp = temperature || 0; 

    // Definir tema baseado em condição e temperatura
    if (temp >= 30) {
        switch (condition) {
            case "CLEAR":
                return "linear-gradient(135deg, #ffdead, #ffa500)"; // Tom quente para sol
            case "CLOUDS":
                return "linear-gradient(135deg, #d2b48c, #8b4513)"; // Nublado com tom quente
            case "RAIN":
            case "DRIZZLE":
                return "linear-gradient(135deg, #6a5acd, #2f4f4f)"; // Chuva com tom quente escuro
            case "SNOW":
                return "linear-gradient(135deg, #e6f0fa, #b0c4de)"; // Neve (não muda)
            case "THUNDERSTORM":
                return "linear-gradient(135deg, #4a2c2a, #1c2526)"; // Tempestade escura
            case "MIST":
            case "FOG":
                return "linear-gradient(135deg, #d3d3d3, #a9a9a9)"; // Névoa
            default:
                return "linear-gradient(135deg, #ffdead, #ffa500)"; // Padrão quente
        }
    } else if (temp <= 15) {
        switch (condition) {
            case "CLEAR":
                return "linear-gradient(135deg, #87ceeb, #4682b4)"; // Tom frio para sol
            case "CLOUDS":
                return "linear-gradient(135deg, #b0c4de, #778899)"; // Nublado com tom frio
            case "RAIN":
            case "DRIZZLE":
                return "linear-gradient(135deg, #4682b4, #2f4f4f)"; // Chuva com tom frio
            case "SNOW":
                return "linear-gradient(135deg, #e6f0fa, #b0c4de)"; // Neve
            case "THUNDERSTORM":
                return "linear-gradient(135deg, #2f4f4f, #1c2526)"; // Tempestade
            case "MIST":
            case "FOG":
                return "linear-gradient(135deg, #d3d3d3, #a9a9a9)"; // Névoa
            default:
                return "linear-gradient(135deg, #87ceeb, #4682b4)"; // Padrão frio
        }
    } else {
        // Temperaturas intermediárias (15°C a 30°C)
        switch (condition) {
            case "CLEAR":
                return "linear-gradient(135deg, #87ceeb, #ffd700)"; // Sol
            case "CLOUDS":
                return "linear-gradient(135deg, #b0c4de, #778899)"; // Nublado
            case "RAIN":
            case "DRIZZLE":
                return "linear-gradient(135deg, #4682b4, #2f4f4f)"; // Chuva
            case "SNOW":
                return "linear-gradient(135deg, #e6f0fa, #b0c4de)"; // Neve
            case "THUNDERSTORM":
                return "linear-gradient(135deg, #2f4f4f, #1c2526)"; // Tempestade
            case "MIST":
            case "FOG":
                return "linear-gradient(135deg, #d3d3d3, #a9a9a9)"; // Névoa
            default:
                return "linear-gradient(135deg, #87ceeb, #4682b4)"; // Padrão
        }
    }
}

function clearWeather() {
    document.getElementById("cityName").textContent = "";
    document.getElementById("currentDate").textContent = "";
    document.getElementById("temperature").textContent = "";
    document.getElementById("description").innerHTML = "";
    document.getElementById("humidity").textContent = "";
    document.getElementById("wind").textContent = "";
    document.getElementById("cloudiness").textContent = "";
}

function clearForecast() {
    document.getElementById("forecastDays").innerHTML = "";
}

function toggleUnit(unit) {
    currentUnit = unit;
    const city = document.getElementById("cityName").textContent;
    if (city) {
        getWeather(city);
    }
}

function openModal(dayDiv) {
    const modal = document.getElementById("forecastModal");
    const modalDay = document.getElementById("modalDay");
    const modalDate = document.getElementById("modalDate");
    const modalTemperature = document.getElementById("modalTemperature");
    const modalCondition = document.getElementById("modalCondition");
    const modalFeelsLike = document.getElementById("modalFeelsLike");
    const modalUVIndex = document.getElementById("modalUVIndex");
    const modalHumidity = document.getElementById("modalHumidity");
    const modalWind = document.getElementById("modalWind");
    const modalPressure = document.getElementById("modalPressure");
    const modalPop = document.getElementById("modalPopValue");
    const modalMaxMin = document.getElementById("modalMaxMin");
    const hourlyForecast = document.getElementById("hourlyForecast");

    modalDay.textContent = dayDiv.getAttribute("data-day");
    modalDate.textContent = `Data: ${dayDiv.getAttribute("data-date")}`;
    const temp = dayDiv.getAttribute("data-temp");
    const condition = dayDiv.getAttribute("data-condition").toLowerCase();
    const pop = parseFloat(dayDiv.getAttribute("data-pop")) / 100;
    const iconClass = getWeatherIcon("CLOUDS", condition, pop);
    modalTemperature.innerHTML = `<i class="wi ${iconClass}"></i> Temperatura: ${temp}${currentUnit === "metric" ? "°C" : "°F"}`;
    modalCondition.innerHTML = `<i class="wi ${iconClass}"></i> Condição: ${dayDiv.getAttribute("data-condition")}`;
    
    const hourlyData = JSON.parse(dayDiv.getAttribute("data-hourly"));
    const firstHour = hourlyData[0];
    const feelsLike = firstHour.main.feels_like.toFixed(1).replace(".", ",");
    modalFeelsLike.textContent = `Sensação térmica: ${feelsLike}${currentUnit === "metric" ? "°C" : "°F"}`;

    const uvIndex = Math.floor(Math.random() * 11);
    modalUVIndex.textContent = `Índice UV: ${uvIndex} (${uvIndex <= 2 ? "Baixo" : uvIndex <= 5 ? "Moderado" : uvIndex <= 7 ? "Alto" : "Muito Alto"})`;

    modalHumidity.textContent = `Umidade: ${dayDiv.getAttribute("data-humidity")}%`;
    const windSpeed = currentUnit === "metric" ? `${dayDiv.getAttribute("data-wind")} m/s` : `${(dayDiv.getAttribute("data-wind") * 2.237).toFixed(1)} mph`;
    modalWind.textContent = `Vento: ${windSpeed}`;
    modalPressure.textContent = `Pressão: ${dayDiv.getAttribute("data-pressure")} hPa`;
    modalPop.textContent = dayDiv.getAttribute("data-pop");
    const maxTemp = dayDiv.getAttribute("data-max-temp");
    const minTemp = dayDiv.getAttribute("data-min-temp");
    modalMaxMin.textContent = `Máxima: ${maxTemp}${currentUnit === "metric" ? "°C" : "°F"} | Mínima: ${minTemp}${currentUnit === "metric" ? "°C" : "°F"}`;

    hourlyForecast.innerHTML = "";
    const table = document.createElement("table");
    table.className = "hourly-table";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    thead.innerHTML = `
        <tr>
            <th>Hora</th>
            <th>Temperatura</th>
            <th>Chuva (%)</th>
        </tr>
    `;
    hourlyData.forEach(hour => {
        const hourDate = new Date(hour.dt * 1000);
        const hourTemp = hour.main.temp.toFixed(1).replace(".", ",");
        const hourIcon = getWeatherIcon(hour.weather[0].main.toUpperCase(), hour.weather[0].description.toLowerCase(), hour.pop);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><i class="wi ${hourIcon}"></i> ${hourDate.getHours()}:00</td>
            <td>${hourTemp}${currentUnit === "metric" ? "°C" : "°F"}</td>
            <td>${Math.round(hour.pop * 100)}%</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    hourlyForecast.appendChild(table);

    modal.style.display = "block";
}

function openModalToday(data) {
    const modal = document.getElementById("forecastModal");
    const modalDay = document.getElementById("modalDay");
    const modalDate = document.getElementById("modalDate");
    const modalTemperature = document.getElementById("modalTemperature");
    const modalCondition = document.getElementById("modalCondition");
    const modalFeelsLike = document.getElementById("modalFeelsLike");
    const modalUVIndex = document.getElementById("modalUVIndex");
    const modalHumidity = document.getElementById("modalHumidity");
    const modalWind = document.getElementById("modalWind");
    const modalPressure = document.getElementById("modalPressure");
    const modalPop = document.getElementById("modalPopValue");
    const modalMaxMin = document.getElementById("modalMaxMin");
    const hourlyForecast = document.getElementById("hourlyForecast");

    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = today.toLocaleDateString('pt-BR', options);
    const capitalizedDate = dateString.replace(/(^|\s)(\w)/g, (match, p1, p2) => p1 + p2.toUpperCase());
    modalDay.textContent = capitalizedDate;
    modalDate.textContent = `Data: ${today.toLocaleString()}`;
    const temp = data.main.temp.toFixed(1).replace(".", ",");
    const condition = data.weather[0].description.toLowerCase();
    const pop = data.rain ? (data.rain["1h"] || 0) / 100 : 0;
    const iconClass = getWeatherIcon(data.weather[0].main.toUpperCase(), condition, pop);
    modalTemperature.innerHTML = `<i class="wi ${iconClass}"></i> Temperatura: ${temp}${currentUnit === "metric" ? "°C" : "°F"}`;
    modalCondition.innerHTML = `<i class="wi ${iconClass}"></i> Condição: ${data.weather[0].description}`;
    
    const feelsLike = data.main.feels_like.toFixed(1).replace(".", ",");
    modalFeelsLike.textContent = `Sensação térmica: ${feelsLike}${currentUnit === "metric" ? "°C" : "°F"}`;

    const uvIndex = Math.floor(Math.random() * 11);
    modalUVIndex.textContent = `Índice UV: ${uvIndex} (${uvIndex <= 2 ? "Baixo" : uvIndex <= 5 ? "Moderado" : uvIndex <= 7 ? "Alto" : "Muito Alto"})`;

    modalHumidity.textContent = `Umidade: ${data.main.humidity}%`;
    const windSpeed = currentUnit === "metric" ? `${data.wind.speed.toFixed(1).replace(".", ",")} m/s` : `${(data.wind.speed * 2.237).toFixed(1).replace(".", ",")} mph`;
    modalWind.textContent = `Vento: ${windSpeed}`;
    modalPressure.textContent = `Pressão: ${data.main.pressure} hPa`;
    modalPop.textContent = Math.round(pop * 100);
    modalMaxMin.textContent = `Máxima: ${data.main.temp_max.toFixed(1).replace(".", ",")}${currentUnit === "metric" ? "°C" : "°F"} | Mínima: ${data.main.temp_min.toFixed(1).replace(".", ",")}${currentUnit === "metric" ? "°C" : "°F"}`;

    hourlyForecast.innerHTML = "";
    fetch(`${forecastApiUrl}${encodeURIComponent(data.name)}&appid=${apiKey}&units=${currentUnit}&lang=pt_br`)
        .then(response => response.json())
        .then(forecastData => {
            const todayForecast = forecastData.list.filter(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate.getDate() === today.getDate();
            });
            const table = document.createElement("table");
            table.className = "hourly-table";
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");
            thead.innerHTML = `
                <tr>
                    <th>Hora</th>
                    <th>Temperatura</th>
                    <th>Chuva (%)</th>
                </tr>
            `;
            todayForecast.forEach(hour => {
                const hourDate = new Date(hour.dt * 1000);
                const hourTemp = hour.main.temp.toFixed(1).replace(".", ",");
                const hourIcon = getWeatherIcon(hour.weather[0].main.toUpperCase(), hour.weather[0].description.toLowerCase(), hour.pop);
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><i class="wi ${hourIcon}"></i> ${hourDate.getHours()}:00</td>
                    <td>${hourTemp}${currentUnit === "metric" ? "°C" : "°F"}</td>
                    <td>${Math.round(hour.pop * 100 || 0)}%</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(thead);
            table.appendChild(tbody);
            hourlyForecast.appendChild(table);
        });

    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("forecastModal");
    modal.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
        modal.style.display = "none";
        modal.style.animation = "";
    }, 300);
}

document.getElementsByClassName("close")[0].addEventListener("click", closeModal);

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function fetchCitySuggestions(query) {
    if (!query || query.length < 3) {
        document.getElementById("suggestions").style.display = "none";
        return;
    }

    fetch(`${geoApiUrl}${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const suggestionsDiv = document.getElementById("suggestions");
            suggestionsDiv.innerHTML = "";
            if (data.length === 0) {
                suggestionsDiv.style.display = "none";
                return;
            }

            const citySuggestions = data
                .filter(item => 
                    (item.class === "place" && (item.type === "city" || item.type === "town" || item.type === "municipality")) ||
                    (item.class === "boundary" && item.type === "administrative")
                )
                .map(item => {
                    const parts = item.display_name.split(",");
                    const cityName = parts[0].trim();
                    const country = parts[parts.length - 1].trim();
                    return { cityName, country, displayText: `${cityName}, ${country}` };
                })
                .filter((item, index, self) =>
                    index === self.findIndex((t) => t.cityName === item.cityName && t.country === item.country)
                );

            if (citySuggestions.length === 0) {
                suggestionsDiv.style.display = "none";
                return;
            }

            citySuggestions.slice(0, 5).forEach(item => {
                const suggestion = document.createElement("div");
                suggestion.className = "suggestion-item";
                suggestion.textContent = item.displayText;
                suggestion.addEventListener("click", () => {
                    document.getElementById("cityInput").value = item.displayText;
                    suggestionsDiv.innerHTML = "";
                    suggestionsDiv.style.display = "none";
                    getWeather(item.displayText);
                });
                suggestionsDiv.appendChild(suggestion);
            });

            suggestionsDiv.style.display = "block";
        })
        .catch(error => {
            console.error("Erro ao buscar sugestões:", error);
            document.getElementById("autoLoader").style.display = "none";
        });
}

const debouncedFetchCitySuggestions = debounce(fetchCitySuggestions, 300);

function getLocationByIP() {
    let attempt = 0;
    const maxAttempts = 2;
    const loader = document.getElementById("autoLoader");

    function attemptLocation() {
        if (attempt >= maxAttempts) {
            console.log("Máximo de tentativas atingido. Parando carregamento.");
            loader.style.display = "none";
            loader.classList.remove("loader");
            alert("Não foi possível carregar a cidade atual automaticamente. Tente buscar manualmente.");
            return;
        }

        attempt++;
        loader.style.display = "block";
        loader.classList.add("loader");
        clearWeather();
        clearForecast();
        console.log(`Tentativa ${attempt} de carregar cidade atual...`);

        fetch(ipApiUrl, { timeout: 5000 })
            .then(response => {
                if (!response.ok) throw new Error("Falha ao conectar ao serviço de localização.");
                return response.json();
            })
            .then(data => {
                console.log("Dados da API ipapi:", data);
                const city = data.city;
                const country = data.country || "Brasil";
                if (city) {
                    const cityQuery = `${city}, ${country}`;
                    console.log("Buscando cidade:", cityQuery);
                    setUnitByCountry(country);
                    getWeather(cityQuery);
                } else {
                    throw new Error("Cidade não encontrada nos dados da API.");
                }
            })
            .catch(error => {
                console.error("Erro ao carregar cidade atual:", error);
                loader.style.display = "none";
                loader.classList.remove("loader");
                if (attempt < maxAttempts) {
                    setTimeout(attemptLocation, 2000);
                }
            });
    }

    attemptLocation();
}

function setUnitByCountry(country) {
    const countryLower = country.toLowerCase();
    if (countryLower === "united states" || countryLower === "united kingdom") {
        currentUnit = "imperial";
    } else {
        currentUnit = "metric";
    }
    const city = document.getElementById("cityName").textContent;
    if (city) {
        getWeather(city);
    }
}

function showErrorAlert(message) {
    const alert = document.getElementById("errorAlert");
    alert.textContent = message;
    alert.style.display = "block";
    setTimeout(() => {
        alert.style.display = "none";
    }, 3000);
}

window.onload = function() {
    initWeatherEffect();
    getLocationByIP();
};

document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const loader = document.getElementById("autoLoader");
        loader.style.display = "none";
        loader.classList.remove("loader");
        getWeather();
    }
});

document.getElementById("cityInput").addEventListener("input", (e) => {
    debouncedFetchCitySuggestions(e.target.value);
});

document.addEventListener("click", (e) => {
    const suggestionsDiv = document.getElementById("suggestions");
    if (!e.target.closest(".search-container")) {
        suggestionsDiv.style.display = "none";
    }
});