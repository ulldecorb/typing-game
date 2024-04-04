const $time = document.getElementById('time');
const $text = document.getElementById('text');
const $input = document.getElementById('type-handler');

const INITIAL_TIME = 5;

const TEXT = 'Erase una vez un cruzado de las ideas, un noble de las aventuras, de la vida y la naturaleza. Paseó por los años como brisa por el campo, sin rumbo ni preocupación alguna, amarrado a la inercia de sus pasos.'

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
    words = TEXT.split(' ');
    currentTime = INITIAL_TIME;

    $time.textContent = currentTime;

    $text.innerHTML = words.map((word, index) => {
        const letters = word.split('');


        return `<tg-word>
            ${letters
                .map((letter) => {
                    console.log(letter);
                    return `<tg-letter>${letter}</tg-letter>`
                })
                .join('')
            }
        </tg-word>
        `;
    }).join('')

    const $firstWord = $text.querySelector('tg-word')
    $firstWord.classList.add('active')
    $firstWord.querySelector('tg-letter').classList.add('active')


    const intervalId = setInterval(() => {
        currentTime--
        $time.textContent = currentTime

        if (currentTime === 0) {
            clearInterval(intervalId)
            console.log('game over')
        }
    }, 1000);
}
function initEvents() {}
