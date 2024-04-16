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

Set global game-mode
Handler game-mode selectors
<!--    
        Logics Diagrames
        Test for component refactor
-->

## Project status
> First do it.   
> Second do it right.   
> Then do it better.   

There are 3 stages on this project:
### 1. Develop basic game
🟩 Type response 
🟩 Space response 
🟩 Backspace response
🟩 Info wpm
🟩 Info acuracy

### 2. Develop custom features and refactor style
> 🛠 On Progres...

🟩 Header game option bar
⬛ bar > toggle typing source (numbers/punctuation)
🟩 bar > toggle typing modes (time/words/paragraph/zen)
🟩 bar > toggle time selector

🟩 reset button => little icon down the text

⬛ Create gameState object for punctuation and error recolector
⬛ 🐞 Accuracy return 'infinity' => fix no timer variable

🟩 Info option bar
🟩 Next
⬛ SVG stats graphic
⬛ Type same text again
⬛ Replay
⬛ Replay
⬛ Ghost typing

⬛ On game over => Save new userState on local storage {game mode, averageData, errorData} 

🟩 🐞 Word counter increase when space

⬛ Style palette {matrix, pokemon, wonderland, retro, ...}

⬛ On start => Await load game mode from local storage
⬛ Key down 'Space' logic => if ($totalLettersCorrectOrIncorrectInCurrentWord.length < 1) no jump to $nextWord
🟩 UX > Tooltips
🟩 UI > SVG icons for bar
⬛ UI > Custom SVG icons
⬛ :after render .incorrectLetters

### 3. Set e2e and unit tests to refactor javascript
⬛ Unit tests
⬛ E2E tests
⬛ Modularize javascript index

## Sources
This project is based on [this video of Midudev](https://www.youtube.com/watch?v=157qVlTelOg&t=118s), a fast clone of [Monkeytype](https://monkeytype.com/). 
Improving the UX and UI with custom sets of colors, svg generator to render the game info stats when game is over and render the wrong type letter. I also get some functionalities from [Agile Fingers](https://agilefingers.com/es) another type web.
The objectives of develop this web are fun and the opportunity to aply tools and functionalities that I was deserve to touch:
SVG stats graphic generator

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