import {englishLetters, harryPotter} from './DATA.js'

const $timerModeHandler = document.getElementById('timer-mode')
const $textModeHandler = document.getElementById('text-mode')
const $wordsModeHandler = document.getElementById('words-mode')
const $zenModeHandler = document.getElementById('zen-mode')
const $timer5 = document.getElementById('timer5') 
const $timer30 = document.getElementById('timer30') 
const $timer60 = document.getElementById('timer60') 

const $game = document.querySelector('.game')
const $timer = document.getElementById('timer')
const $text = document.getElementById('text')
const $input = document.getElementById('type-handler')
const $wordsCounter = document.getElementById('word-counter')
const $info = document.querySelector('.info')
const $accuracy = document.getElementById('accuracy')
const $wpm = document.getElementById('wpm')
const $reset = document.getElementById('reset')
const $closeInfo = document.getElementById('closeInfoHandler')

const STATE = {currentGameData: []}

const wordsCounterGoal = 10
let wordsCounter = 0
let gameMode = ''

let TIMER_INITIAL_TIME = 5
let INITIAL_TIME
let TEXT = getText(englishLetters)

let words = []
let currentTime = TIMER_INITIAL_TIME
let playing = false


setGameMode('timer')

function setGameMode(mode) {    
    gameMode = mode
    reset()
    if (gameMode === 'text') {
        TEXT = harryPotter[Math.floor(Math.random(harryPotter.length))].split(' ')
    }
    if (gameMode === 'words') {
        TEXT = getText(englishLetters)
    }

    if (gameMode === 'zen') {
        TEXT = [' ']
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
    currentTime = TIMER_INITIAL_TIME
    INITIAL_TIME = Date.now()  
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

    // Active first word and letter
    const $firstWord = $text.querySelector('tg-word')
    $firstWord.classList.add('active')
    $firstWord.querySelector('tg-letter').classList.add('active')
    if (gameMode === 'zen') $firstWord.querySelector('tg-letter').classList.add('correct')
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

function setTimer(time) {
    TIMER_INITIAL_TIME = time
    setGameMode('timer')
}

function reset() {
    playing = false
    wordsCounter = 0
    currentTime = 0
    $game.style.display = 'flex'
    $input.value = ''
    $text.innerHTML = ''
}

function handlerReset() {
    setGameMode(gameMode)
}

function printText() {
    let newText = ''
    $text.querySelectorAll('tg-word').forEach($word => {
        $word.querySelectorAll('tg-letter').forEach($letter => {
            newText = newText + $letter.innerText
        })
        newText = newText + ' '
    })
    console.log(newText)
}

function closeInfo() {
    reset()
    initGame()
    initEvents()
    STATE.currentGameData = []
    $info.style.display = 'none'
    $accuracy.textContent = ''
    $wpm.textContent = ''
}

function onKeyDown(event) {
    const $currentWord = document.querySelector('tg-word.active')
    const $currentLetter = document.querySelector('tg-letter.active')
    const {key} = event
    
    if (key === ' ') {
        event.preventDefault() 

        if (gameMode === 'zen') {
            const $newWord = document.createElement('tg-word')
            $newWord.innerHTML = '<tg-letter></tg-letter>'
            $newWord.classList.add('active')
            $newWord.querySelector('tg-letter').classList.add('active', 'correct')
            
            $currentWord.classList.remove('active')
            $currentLetter.remove()
            
            $currentWord.insertAdjacentElement('afterend', $newWord)
            return
        }

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
    
        wordsCounter++
        $currentWord.classList.add(classToAdd)
        $wordsCounter.textContent = `${wordsCounter}/${wordsCounterGoal}`
        
        // const newWordData = {typeTime, condition}
        // user.gameAcuracy.push(newWordData)
        
        return
    }
    
    if (key === 'Backspace') {
        if (gameMode === 'zen') {
            if (!$currentLetter.previousElementSibling && !$currentWord.previousElementSibling) return

            if (!$currentLetter.previousElementSibling) {
                $currentWord.previousElementSibling.classList.add('active')
                // $currentWord.previousElementSibling.querySelector('tg-letter:last-child').classList.add('active')

                
        const $newLetter = document.createElement('tg-letter')
        $newLetter.innerText = ' '
        $newLetter.classList.add('active', 'correct')
        $currentWord.previousElementSibling.insertAdjacentElement('beforeend', $newLetter)


                $currentWord.remove()

                return
            }
            $currentLetter.previousElementSibling.remove()

            return
        }

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
    event.preventDefault()
    const {key} = event
    const $currentWord = document.querySelector('tg-word.active')
    const $currentLetter = document.querySelector('tg-letter.active')
    
    if (gameMode === 'zen') {
        const {key} = event
        if (key.length > 1 || key === ' ') return
        const $newLetter = document.createElement('tg-letter')
        $currentLetter.innerText = key
        $currentLetter.classList.remove('active')
        $newLetter.classList.add('active', 'correct')
        $currentLetter.insertAdjacentElement('afterend', $newLetter)

        return
    }
    
    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length
    
    const $allLetters = $currentWord.querySelectorAll('tg-letter')

    $allLetters.forEach(letter => letter.classList.remove('correct', 'incorrect'))

    // Capture type status
    if (playing) getGameData($currentWord, key)

    // display letter status
    $input.value.split('').forEach((letter, index) => {
        const $letter = $allLetters[index]
        const letterToCheck = currentWord[index]

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

function getGameData($currentWord, key) {
    if ( key === ' ' || key === 'Backspace') return

    const isCorrect = key === $currentWord.querySelectorAll('tg-letter')[$input.value.length - 1].textContent
    const time = Date.now()
    
    const currentTotalLetters = $text.querySelectorAll('tg-letter.correct', 'tg-letter.incorrect').length
    const wpm = Math.floor( currentTotalLetters / 5 / ((time - INITIAL_TIME) / 1000) * 60)
    // Set gameData to info graphics
    const newGameData = {
        time,
        isCorrect,
        key,
        wpm,
    }
    STATE.currentGameData.push(newGameData)
}

function gameOver() {
    // TODO => UI Render stats of game: Accuracy, wpm, svg graphics {wpm, errors, time/wpm}
    playing = false
    
    $input.removeEventListener('keydown', onKeyDown)
    $input.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('keydown', focusInput)
    // const wpm = Math.floor( wordsCounter / (TIMER_INITIAL_TIME - currentTime) * 60)
    const currentTotalLetters = $text.querySelectorAll('tg-letter.correct', 'tg-letter.incorrect').length

    const lastType = [...STATE.currentGameData].reverse()[0].time
    const wpm = Math.floor( currentTotalLetters / 5 / ((lastType - INITIAL_TIME) / 1000) * 60)

    const errors = document.querySelectorAll('tg-letter.incorrect').length
    const totalLetters = document.querySelectorAll('.correct, .incorrect').length
    let accuracy = (100 - (errors * 100 / totalLetters)) 
    if (isNaN(accuracy)) {accuracy = 0} 

    $game.style.display = 'none';
    $info.style.display = 'grid'
    $accuracy.textContent = `${accuracy.toFixed(1)}%`
    $wpm.textContent = wpm
    $accuracy.classList.add('correct')
    $wpm.classList.add('correct')

    renderStats(STATE.currentGameData)
}

function renderStats(data) {
    // get total time
    const totalSeconds = ([...data].reverse()[0].time - INITIAL_TIME) / 1000
    // get errors
    const errorsList = data.filter(action => action.isCorrect === false)
    // get corrects
    const correctList = data.filter(action => action.isCorrect === true)
    console.log({totalSeconds, errorsList, correctList})
    // graph SVG
    // render border
    // render numbers, range
    // render errors
    // get average of wpm/time
    // render average/time


}






export function testMain(a, b){
    return a * b + 2
}