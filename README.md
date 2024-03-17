# Kamylla
[![CI](https://github.com/MonashUAS/kamylla/actions/workflows/main.yml/badge.svg)](https://github.com/MonashUAS/kamylla/actions/workflows/main.yml)

Kamylla is the Monash UAS Inventory Management web app which utilises the BOMIST API. Software for the backend websocket server is stored in /backend.

## Kamylla is designed to be run with
1. Tablet running the Kamylla web app on Chrome
2. Monash UAS Inventory PC (backend server) running scanner webpage
3. Wireless handheld scanner connected to Inventory PC

## Stage 1 of Kamylla's development supports (see project brief for more details):
* Logging in and out of your personal user account
* Taking parts through a handheld scanner
* Returning parts through a handheld scanner

## Stage 2 of Kamylla's development supports (see project brief for more details):
* Viewing and undoing local device history
* Searching for parts

**Project brief**: https://docs.google.com/document/d/1JiUWvmJ_jHBmSLAZnOGHlpiCzqR_JFdqMIz5UdF8VRc/edit <br/>
**Training on using Kamylla**: https://inventory-s-school.thinkific.com/

<br/>

# Running Kamylla

## Project setup
```
npm install
```

### Compiles and hot-reloads for development [web app]
```
npm run serve
```

### Host backend server [scanner]
```
cd backend
node .
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Testing with Jest
```
npm test
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
