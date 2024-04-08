import {harryPotter} from './DATA.js'

const $time = document.getElementById('time')
const $text = document.getElementById('text')
const $input = document.getElementById('type-handler')
const $totalWords = document.getElementById('word-counter')
const $info = document.querySelector('.info')
const $acuracy = document.querySelector('#acuracy')
const $wpm = document.querySelector('#wpm')
const INITIAL_TIME = 10

const TEXT = harryPotter[21]

const objectiveWords = TEXT.split(' ').length
let totalWords = 0

let words = []
let currentTime = INITIAL_TIME

initGame()
initEvents()

function initGame() {
    words = TEXT.split(' ')
    currentTime = INITIAL_TIME  
    $totalWords.textContent = `${totalWords}/${objectiveWords}`

    $time.textContent = currentTime

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

    const intervalId = setInterval(() => {
        currentTime--
        $time.textContent = currentTime
    
        if (currentTime === 0) {
            clearInterval(intervalId)
            gameOver()
        }
    }, 1000)
    
}

function initEvents() {
    document.addEventListener('keydown', () => {
        $input.focus()
    })

    $input.addEventListener('keydown', onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
}

function onKeyDown(event) {
    const $currentWord = document.querySelector('tg-word.active')
    const $currentLetter = document.querySelector('tg-letter.active')
    const $nextWord = $currentWord.nextElementSibling
    const $nextLetter = $nextWord.querySelector('tg-letter')
    const {key} = event

    if (!$nextWord) gameOver()

    if (key === ' ') {
        event.preventDefault() 

        $currentWord.classList.remove('active')
        $currentLetter.classList.remove('active')

        $nextWord.classList.add('active')
        $nextLetter.classList.add('active')

        $input.value = ''

        const hasIncorrectLetters = $currentWord
            .querySelectorAll('tg-letter:not(.correct)').length > 0

        const classToAdd = hasIncorrectLetters ? 'marked' : 'correct'
        $currentWord.classList.add(classToAdd)
        totalWords++
        $totalWords.textContent = `${totalWords}/${objectiveWords}`
        
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
            $prevWord.classList.remove('marked')
            $currentWord.classList.remove('active')
            $currentLetter.classList.remove('active')

            let prevInput = [...$prevWord
                .querySelectorAll('.correct, .incorrect')]
                .map(letter => {
                    if (letter.classList.contains('correct')) return letter.textContent
                    if (letter.classList.contains('incorrect')) return [...letter.style.cssText.split('')].reverse()[1]
                 })
                 .join('')
            
            // const lastInput = [...$prevWord
                // .querySelectorAll('.correct, .incorrect')].map(letter => letter.textContent).join('')

            const indexToBack = $prevWord
                .querySelectorAll('.correct, .incorrect').length
            
                console.log({prevInput, indexToBack, $prevWord, $currentLetter})

            $input.value = prevInput
            // $input.value = inputSearch
                
            $prevWord.classList.add('active')
            console.log($prevWord.querySelectorAll('tg-letter'))
            $prevWord.querySelectorAll('tg-letter')[indexToBack].classList.add('active')
        }
    } 
}

function onKeyUp(event) {
    // select current active elements
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

        // TODO if (incorrect) => :after content = $letter.textContent 
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
    }
}

function gameOver() {
    // UI Render stats of game: Acuracy, wpm, svg graphics {wpm, errors, time/wpm}
    console.log('game over')

    const wpm = Math.floor( totalWords / INITIAL_TIME * 60)
    const errors = document.querySelectorAll('tg-letter.incorrect').length
    const totalLetters = document.querySelectorAll('.correct, .incorrect').length
    const acuracy = Math.floor(100 - (errors * 100 / totalLetters)) 

    // errors         totalLetters   
    // 1              100  

    $info.style.display = 'flex'
    $acuracy.textContent = `${acuracy}%`
    $wpm.textContent = wpm

}