import {englishLetters, harryPotter} from './DATA.js'

const $timerModeHandler = document.querySelector('#timer-mode')
const $textModeHandler = document.querySelector('#text-mode')
const $wordsModeHandler = document.querySelector('#words-mode')
const $zenModeHandler = document.querySelector('#zen-mode')
const $timer5 = document.querySelector('#timer5') 
const $timer30 = document.querySelector('#timer30') 
const $timer60 = document.querySelector('#timer60') 

const $timer = document.getElementById('timer')
const $text = document.getElementById('text')
const $input = document.getElementById('type-handler')
const $wordsCounter = document.getElementById('word-counter')
const $info = document.querySelector('.info')
const $accuracy = document.querySelector('#accuracy')
const $wpm = document.querySelector('#wpm')
const $reset = document.querySelector('#reset')
const $closeInfo = document.querySelector('#closeInfoHandler')
const wordsCounterGoal = 30
let wordsCounter = 0
let gameMode = ''

let INITIAL_TIME = 60
let TEXT = getText(englishLetters)

let words = []
let currentTime = INITIAL_TIME
let playing = false


setGameMode('words')

function setTimer(time) {
    INITIAL_TIME = time
    setGameMode('timer')
}

function setGameMode(mode) {
    gameMode = mode
    reset()
    if (gameMode === 'text') {
        TEXT = harryPotter[Math.floor(Math.random(harryPotter.length))].split(' ')
    }
    if (gameMode === 'words') {
        TEXT = getText(englishLetters)
    }

    initGame()
    initEvents()
    $info.style.display = 'none'
}

function getText(wordsArray) {
    return wordsArray.toSorted(() => Math.random() - .5).slice(0, wordsCounterGoal)
}

function initGame() {
    words = TEXT
    currentTime = INITIAL_TIME  
    $wordsCounter.textContent = `${wordsCounter}/${wordsCounterGoal}`

    
    if (gameMode === 'timer') {
        $timer.style.display = 'block'
        $wordsCounter.style.display = 'none'
    } else if (gameMode === 'words') {
            $timer.style.display = 'none'
            $wordsCounter.style.display = 'block'
    } else {
        $timer.style.display = 'none'
        $wordsCounter.style.display = 'none'
    }
    $timer.textContent = currentTime

    $text.innerHTML = words.map((word) => {
        const letters = word.split('')

        return `<tg-word>
            ${letters
                .map(letter => `<tg-letter>${letter}</tg-letter>`)
                .join('')
            }
        </tg-word>
        `
    }).join('')

    const $firstWord = $text.querySelector('tg-word')
    $firstWord.classList.add('active')
    $firstWord.querySelector('tg-letter').classList.add('active')
}

function handlerReset(event) {
    // event.preventDefault()
    console.log('??')
    setGameMode(gameMode)
}

function initEvents() {
    document.addEventListener('keydown', focusInput)
    $input.addEventListener('keydown', onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
    $closeInfo.addEventListener('click', closeInfo)

    $timer5.addEventListener('click', () => setTimer(5))
    $timer30.addEventListener('click', () => setTimer(30))
    $timer60.addEventListener('click', () => setTimer(60))
    
    $timerModeHandler.addEventListener('click', () => setGameMode('timer'))
    $textModeHandler.addEventListener('click', () => setGameMode('text'))
    $wordsModeHandler.addEventListener('click', () => setGameMode('words'))
    $zenModeHandler.addEventListener('click', () => setGameMode('zen'))
    
    $reset.addEventListener('click', handlerReset)
}

function focusInput() {
    $input.focus()
    if(!playing) {
        playing = true
        
        if(gameMode === 'timer') {
            const intervalId =
            setInterval(() => {
                currentTime--
                $timer.textContent = currentTime
                
                if (!playing) {clearInterval(intervalId)}
                if (currentTime <= 0) {
                    clearInterval(intervalId)
                    gameOver()
                }
                
            }, 1000)
        }
    }
}


function reset() {
    playing = false
    wordsCounter = 0
    currentTime = 0
    $input.value = ''
    $text.innerHTML = ''
}

function closeInfo() {
    reset()

    $info.style.display = 'none'
    $accuracy.textContent = ''
    $wpm.textContent = ''
    initGame()
    initEvents()
}

function onKeyDown(event) {
    const $currentWord = document.querySelector('tg-word.active')
    const $currentLetter = document.querySelector('tg-letter.active')
    const {key} = event
    
    
    if (key === ' ') {
        event.preventDefault() 

        const $nextWord = $currentWord.nextElementSibling
        const $nextLetter = $nextWord.querySelector('tg-letter')            

        $currentWord.classList.remove('active')
        $currentLetter.classList.remove('active')

        $nextWord.classList.add('active')
        $nextLetter.classList.add('active')

        $input.value = ''

        const hasIncorrectLetters = $currentWord
            .querySelectorAll('tg-letter:not(.correct)').length > 0

        const classToAdd = hasIncorrectLetters ? 'marked' : 'correct'
        $currentWord.classList.add(classToAdd)
        wordsCounter++
        $wordsCounter.textContent = `${wordsCounter}/${wordsCounterGoal}`
        
        return
    }

    if (key === 'Backspace') {
        const $prevWord = $currentWord.previousElementSibling
        const $prevLetter = $currentLetter.previousElementSibling  

        if(!$prevWord && !$prevLetter) {
            event.preventDefault()
            return
        }

        const $markedWord = $text.querySelector('tg-word.marked')
        if (!$prevLetter && $markedWord) {
            event.preventDefault()
            wordsCounter--
            $wordsCounter.textContent = `${wordsCounter}/${wordsCounterGoal}`
            $prevWord.classList.remove('marked')
            $prevWord.classList.add('active')

            const $letterToBack = $prevWord
                .querySelector('tg-letter:last-child')

            $currentLetter.classList.remove('active')
            $letterToBack.classList.add('active')

            let prevInput = [...$prevWord
                .querySelectorAll('.correct, .incorrect')]
                .map(letter => {
                    if (letter.classList.contains('correct')) return letter.textContent
                    if (letter.classList.contains('incorrect')) return [...letter.style.cssText.split('')].reverse()[1]
                 })
                 .join('')
            
            $input.value = prevInput
        }
    } 
}

function onKeyUp(event) {
    const $currentWord = document.querySelector('tg-word.active')
    const $currentLetter = document.querySelector('tg-letter.active')
    
    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length
    
    const $allLetters = $currentWord.querySelectorAll('tg-letter')

    $allLetters.forEach(letter => letter.classList.remove('correct', 'incorrect'))

    $input.value.split('').forEach((letter, index) => {
        const $letter = $allLetters[index]
        const letterToCheck = currentWord[index]
        const {key} = event

        const isCorrect = letter === letterToCheck
        const letterClass = isCorrect ? 'correct' : 'incorrect'

        $letter.classList.add(letterClass)

        // TODO =>  if (incorrect) => $letter.textContent = :after content   
        if (!isCorrect && key.length === 1) {
            $currentLetter.style.setProperty('--after-content', key);
        }
    })
      
    $currentLetter.classList.remove('active', 'is-last')
    const inputLenght = $input.value.length
    const $nextActiveLetter = $allLetters[inputLenght]

    if ($nextActiveLetter) {
        $nextActiveLetter.classList.add('active')
    } else {
        $currentLetter.classList.add('active', 'is-last')
        const $isNextWord = $currentWord.nextElementSibling
        if(!$isNextWord) gameOver()
    }
}

function gameOver() {
    // TODO => UI Render stats of game: Accuracy, wpm, svg graphics {wpm, errors, time/wpm}
    console.log('game over')
    playing = false
    
    $input.removeEventListener('keydown', onKeyDown)
    $input.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('keydown', focusInput)
    const wpm = Math.floor( wordsCounter / (INITIAL_TIME - currentTime) * 60)

    const errors = document.querySelectorAll('tg-letter.incorrect').length
    const totalLetters = document.querySelectorAll('.correct, .incorrect').length
    let accuracy = (100 - (errors * 100 / totalLetters)) 
    if (isNaN(accuracy)) {accuracy = 0} 

    $info.style.display = 'grid'
    $accuracy.textContent = `${accuracy.toFixed(1)}%`
    $wpm.textContent = wpm
    $accuracy.classList.add('correct')
    $wpm.classList.add('correct')
}







export function testMain(a, b){
    return a * b + 2
}