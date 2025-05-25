# 🌤️ Weather App

A Node.js command-line app that fetches real-time weather data from multiple providers. Built with OOP, clean architecture, and design patterns in mind.

## Features 🚀

- Fetches weather data from **multiple providers**
- Follows **Object-Oriented Programming (OOP)** principles for clean, modular design
- Implements design patterns like [Facade](https://refactoring.guru/design-patterns/facade), [Factory](https://refactoring.guru/design-patterns/factory-method), and [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [Redis](https://redis.io/) caching to reduce redundant API calls
- **Unit tested** with [Vitest](https://vitest.dev/)

## Architecture Highlights 🧱
- **Facade Pattern**: At the core of the app we have ```WeatherAggregator``` class, which abstracts away details of querying multiple weather providers, as well as data transformation and unification, and exposes a single, clean ```getAggregatedWeather``` method to consumers.
- **Factory Pattern**: Each weather provider is encapsulated via a factory to decouple instantiation of the provider from its usage
- **Dependency Injection**: All services and providers are explicitly constructed and injected into ```WeatherService```. This keeps components decoupled and testable, while centralizing configuration logic in one place
- **Redis Caching**: Improves performance and reduces API calls.

## Tech Stack 🧰
- Typescirpt
- Node.js
- Redis
- Vitest

## Getting Started 🛠️

### 1. Clone and Install

```bash
git clone https://github.com/your-username/weather-cli.git
cd weather-cli
npm install
```

### 2. Setup API Keys
- Copy `.env.example` to `.env` and add API keys for weather providers.

### 3. Setup Redis

- Redis should be available on `localhost:6379`. 
- You can start the Redis container by running following command from the project’s root directory:

  ```sh
  docker-compose up -d
  ```

### 4. Run the App
```bash
npm run dev Kyiv
```  
   or
```bash
npm start Kyiv
```  
*(Replace `Kyiv` with any other city)*

## Running Tests 🧪

The project uses Vitest for unit testing:
```bash
npm test
```
