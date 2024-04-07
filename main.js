const $time = document.getElementById('time')
const $text = document.getElementById('text')
const $input = document.getElementById('type-handler')
const $totalWords = document.getElementById('word-counter')

const INITIAL_TIME = 30

const TEXT = 'A tinkling bell rang somewhere in the depths of the shop as they stepped inside. It was a tiny place, empty except for a single, spindly chair that Hagrid sat on to wait. Harry felt strangely as though he had entered a very strict library; he swallowed a lot of new questions that had just occurred to him and looked instead at the thousands of narrow boxes piled neatly right up to the ceiling. For some reason, the back of his neck prickled. The very dust and silence in here seemed to tingle with some secret magic.'


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
            // gameOver()
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

            let prevInput = []
            let inputSearch = [...$prevWord
                .querySelectorAll('.correct, .incorrect')]
                .forEach(letter => {
                    if (letter.classList.contains('correct')) prevInput.push(letter.textContent)
                    if (letter.classList.contains('incorrect')) prevInput.push([...letter.style.cssText.split('')].reverse()[1])
                 })
            
            const lastInput = [...$prevWord
                .querySelectorAll('.correct, .incorrect')].map(letter => letter.textContent).join('')

            const indexToBack = $prevWord
                .querySelectorAll('.correct, .incorrect').length
            
            console.log({prevInput, inputSearch, indexToBack})

            $input.value = prevInput.join('')
                
            $prevWord.classList.add('active')
            $prevWord.querySelectorAll('tg-letter')[indexToBack].classList.add('active')

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

        // TODO if (incorrect) => :before content = $letter.textContent 
        if (!isCorrect && key.length === 1) {
            // $currentLetter.style.setProperty("--before-content", "'Nuevo contenido del pseudo-elemento ::before'");
            console.log(key)
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
}