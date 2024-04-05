const $time = document.getElementById('time')
const $text = document.getElementById('text')
const $input = document.getElementById('type-handler')

const INITIAL_TIME = 30

const TEXT = 'Erase una vez un cruzado de las ideas, un noble de las aventuras, de la vida y la naturaleza. Paseó por los años como brisa por el campo, sin rumbo ni preocupación alguna, amarrado a la inercia de sus pasos.'

let words = []
let currentTime = INITIAL_TIME

initGame()
initEvents()

function initGame() {
    words = TEXT.split(' ')
    currentTime = INITIAL_TIME

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

function onKeyDown() {}
function onKeyUp() {
    const $currentWord = document.querySelector('tg-word.active')
    const $currentLetter = document.querySelector('tg-letter.active')
    
    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length

    
    const $allLetters = $currentWord.querySelectorAll('tg-letter')
    $allLetters.forEach(letter => letter.classList.remove('correct', 'incorrect'))

    $input.value.split('').forEach((letter, index) => {
        const $letter = $allLetters[index]
        const letterToCheck = currentWord[index]

        const isCorrect = letter === letterToCheck
        const letterClass = isCorrect ? 'correct' : 'incorrect'

        $letter.classList.add(letterClass)

        $currentLetter.classList.remove('active', 'is-last')
        const inputLenght = $input.value.length
        const $nextActiveLetter = $allLetters[inputLenght]
        if ($nextActiveLetter) {
            $nextActiveLetter.classList.add('active')
        } else {
            $currentLetter.classList.add('active', 'is-last')
        }
    })
}

function gameOver() {
    console.log('game over')
}