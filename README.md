# WeatherFloat - Weather Forecast App

![WeatherFloat Preview](https://i.postimg.cc/MZCms7vR/image.png)

---

## 🌍 English Documentation

### 📖 Overview

**WeatherFloat** is a web application designed to provide current weather information and a 3-day forecast for any city worldwide. Built with HTML, CSS, JavaScript, and the Three.js library for weather animations, it fetches real-time data from the OpenWeatherMap API. 

#### Key Features:
- **Current Weather**: Displays temperature, condition, humidity, wind speed, and cloudiness for a chosen city.
- **3-Day Forecast**: Shows daily weather summaries including temperature, condition, and chance of rain.
- **Interactive Modals**: For detailed insights on the current day and forecasted days.
- **Dynamic Theme**: Adjusts based on weather and temperature.
- **Weather Animations**: Rain particles for rainy conditions and glowing particles for clear weather.
- **Automatic Location Detection**: Via IP geolocation (with retry mechanism).
- **Search Functionality**: Powered by the Nominatim API, offering up to 5 city suggestions.
- **Unit Toggle**: Switch between Celsius/Fahrenheit for temperature and m/s/mph for wind speed.
- **Responsive Design**: Optimized for mobile and desktop views.

![Preview](https://i.postimg.cc/523Gd7CD/image.png)

---

### ⚙️ Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)
- Internet connection to fetch weather data
- OpenWeatherMap API key (replace in `script.js`)

---

### 📥 Installation

1. Clone or download this repository.
2. Open `index.html` in a browser.
3. Ensure your internet connection is active.
4. Replace the `apiKey` in `script.js`:
    ```javascript
    const apiKey = "your-api-key-here";
    ```

---

### 🚀 Usage

- The app auto-detects your location and displays the weather on load.
- Type a city name to search or select a suggestion from the dropdown.
- Click on the weather section to open a modal with detailed info.
- Click a forecast day for hourly details or double-click to search that day directly.
- Toggle between °C and °F using the unit switcher.

---

### 🛠️ Dependencies

- [Three.js](https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js): For weather animations.
- [Weather Icons](https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css): For weather icons.
- [Google Fonts](https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap): For Roboto font.
- [OpenWeatherMap API](https://openweathermap.org/): For weather data.
- [ipapi.co](https://ipapi.co/): For IP-based geolocation.
- [Nominatim API](https://nominatim.openstreetmap.org/): For city search suggestions.

---

### ⚠️ Notes

- Animations depend on Three.js and may not work if WebGL is disabled.
- The UV index is a placeholder and should be replaced with a real API.
- Make sure your API key is valid and has enough requests left.

---

### 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🇧🇷 Documentação em Português

![WeatherFloat Preview](https://i.postimg.cc/MZCms7vR/image.png)

---

### 📖 Visão Geral

**WeatherFloat** é um aplicativo web que fornece informações climáticas atuais e uma previsão de 3 dias para qualquer cidade do mundo. Ele usa **HTML**, **CSS**, **JavaScript** e a biblioteca **Three.js** para animações climáticas, obtendo dados em tempo real da **API OpenWeatherMap**.

#### Funcionalidades Principais:
- **Clima Atual**: Exibe temperatura, condição, umidade, velocidade do vento e nebulosidade.
- **Previsão de 3 Dias**: Resumo diário com temperatura, condição e chance de chuva.
- **Modais Interativos**: Detalhes completos do dia atual e dos dias da previsão.
- **Tema Dinâmico**: Mudança de gradientes conforme condições climáticas e temperatura.
- **Animações Climáticas**: Partículas de chuva para "Rain/Drizzle" e partículas brilhantes para "Clear".
- **Detecção Automática de Localização**: Via geolocalização por IP (com mecanismo de retentativa).
- **Busca de Cidades**: Sugestões da API Nominatim com até 5 opções enquanto digita.
- **Alternância de Unidades**: Troque entre Celsius/Fahrenheit para temperatura e m/s/mph para vento.
- **Design Responsivo**: Funciona em dispositivos móveis e desktop.

![Preview](https://i.postimg.cc/523Gd7CD/image.png)

---

### ⚙️ Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, etc.)
- Conexão com a internet
- Chave de API do OpenWeatherMap (substitua em `script.js`)

---

### 📥 Instalação

1. Clone ou baixe este repositório.
2. Abra `index.html` no navegador.
3. Certifique-se de estar conectado à internet.
4. Substitua a chave de API no `script.js`:
    ```javascript
    const apiKey = "sua-chave-de-api-aqui";
    ```

---

### 🚀 Uso

- O aplicativo detecta sua localização automaticamente e exibe o clima.
- Digite o nome de uma cidade ou selecione uma sugestão.
- Clique na seção do clima para abrir um modal com informações detalhadas.
- Clique em um dia da previsão para detalhes horários ou dê um duplo clique para buscar por esse dia.
- Use o alternador de unidades para mudar entre °C e °F.

---

### 🛠️ Dependências

- [Three.js](https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js): Para animações climáticas.
- [Weather Icons](https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css): Para ícones climáticos.
- [Google Fonts](https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap): Fonte Roboto.
- [OpenWeatherMap API](https://openweathermap.org/): Para dados climáticos.
- [ipapi.co](https://ipapi.co/): Para geolocalização.
- [Nominatim API](https://nominatim.openstreetmap.org/): Para sugestões de cidade.

---

### ⚠️ Notas

- As animações dependem do Three.js e podem não funcionar sem WebGL.
- O índice UV é um placeholder; substitua por uma API real se necessário.
- Verifique se a chave da API é válida e tem requisições suficientes.

---

### 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.
