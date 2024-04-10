# Typing-game
Typing game with timer

## Table of content
* [General info](#general-info)   
* [Scope of functionalities](#scope-of-functionalities)
* [Project status](#project-status)
* [Sources](#sources)
* [Jest](#jest)

## General info
Simple web page to improve type skills created with HTML, CSS and Javascript.

## Scope of functionalities

<!-- Diagrames llogics
Test -->


🟩 Type response 
🟩 Space response 
⬛ Backspace response
🟩 Info wpm
🟩 Info acuracy
⬛ SVG stats graphic
⬛ header options bar

## Project status

## Sources
This project is based on [this video of Midudev](https://www.youtube.com/watch?v=157qVlTelOg&t=118s), a fast clone of [monkeytype](https://monkeytype.com/). 
Improving the UX and UI with custom sets of colors, svg generator to render the game info at game over and render the wrong type letter.

## Jest
1. Iniciar el projecte:   
```bash
npm init --y
```
2. Instalar jest:   

```bash
npm i -D jest
```
3. Instalar compilador de javascript modern:   

```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

Patró bàsic:
```javascript
describe('Name of the test suit', () => {
    test('Name of unit test', () => {
        const result = myFunction();
        expect(result).toBe('harcoded result')
    })
})
```