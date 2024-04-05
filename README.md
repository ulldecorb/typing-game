# Typing-game
Typing game with timer

## About
Web page to improve type skills.

## Table of content
* [About](#about)   
* [Jest](#jest)   

## Jest
```bash
npm init --y

npm i -D jest

npm install --save-dev babel-jest @babel/core @babel/preset-env
```
1. Iniciar el projecte.   
2. Instalar jest.   
3. Instalar compilador de javascript modern.   

Patró bàsic:
```javascript
describe('Name of the test suit', () => {
    test('Name of unit test', () => {
        const result = myFunction();
        expect(result).toBe('harcoded result')
    })
})
```