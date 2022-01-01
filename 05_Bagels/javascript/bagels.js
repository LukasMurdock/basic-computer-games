// BAGELS
//
// Converted from BASIC to Javascript by Oscar Toledo G. (nanochess)
//

// Game settings
let numberDigitLength = 3;
let allowedGuesses = 20;

const lowercaseYesStrings = ['yes', 'y'];
const lowercaseNoStrings = ['no', 'n'];
const validInputStrings = [...lowercaseYesStrings, ...lowercaseNoStrings];

// Determine if code is running in browser;
// by default there is no window object in Node.js.
const isRunningInBrowser = typeof window !== 'undefined';

// Function to handle printing to browser DOM and Node console.
function print(string) {
    if (isRunningInBrowser) {
        document
            .getElementById('output')
            .appendChild(document.createTextNode(string + '\n'));
    } else {
        console.log(string);
    }
}

// Function to handle printing inline to browser DOM and Node console.
function printInline(string) {
    if (isRunningInBrowser) {
        document
            .getElementById('output')
            .appendChild(document.createTextNode(string));
    } else {
        process.stdout.write(string);
    }
}

// Function to handle input from browser DOM and Node console.
function input() {
    if (isRunningInBrowser) {
        // Accept input from the browser DOM input
        return new Promise(function (resolve) {
            let input_element = document.createElement('INPUT');
            input_element.setAttribute('type', 'text');
            input_element.setAttribute('length', '50');
            document.getElementById('output').appendChild(input_element);
            input_element.focus();
            let input_str = undefined;
            input_element.addEventListener('keydown', function (event) {
                if (event.code === 'Enter') {
                    input_str = input_element.value;
                    document
                        .getElementById('output')
                        .removeChild(input_element);
                    print(input_str);
                    print('');
                    resolve(input_str);
                }
            });
        });
    } else {
        // Accept input from the command line in Node.js
        // See: https://nodejs.dev/learn/accept-input-from-the-command-line-in-nodejs
        return new Promise(function (resolve) {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readline.question('', function (input) {
                resolve(input);
                readline.close();
            });
        });
    }
}

// Function to easily add spaces to a string
function tab(numberOfSpaces) {
    let spaces = ' '.repeat(numberOfSpaces);
    return spaces;
}

print(tab(33) + 'BAGELS');
print(tab(15) + 'CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY');

// *** Bagles number guessing game
// *** Original source unknown but suspected to be
// *** Lawrence Hall of Science, U.C. Berkeley

print('');
print('');
print('');

async function playBagelGame() {
    print('WOULD YOU LIKE THE RULES (YES OR NO)');
    let wantsRulesResponse = await input();

    if (lowercaseYesStrings.includes(wantsRulesResponse.toLowerCase())) {
        print('');
        print('I AM THINKING OF A THREE-DIGIT NUMBER.  TRY TO GUESS');
        print('MY NUMBER AND I WILL GIVE YOU CLUES AS FOLLOWS:');
        print('   PICO   - ONE DIGIT CORRECT BUT IN THE WRONG POSITION');
        print('   FERMI  - ONE DIGIT CORRECT AND IN THE RIGHT POSITION');
        print('   BAGELS - NO DIGITS CORRECT');
    }

    // If you just wanted to generate a random three digit number;
    // let numberToGuess = Math.floor(Math.random() * 900 + 100);

    // However, we want to generate a three digit number with no repeating digits
    let numberToGuess = [];
    while (numberToGuess.length < numberDigitLength) {
        let randomNumber = Math.floor(Math.random() * 10);
        if (numberToGuess.indexOf(randomNumber) === -1) {
            numberToGuess.push(randomNumber);
        }
    }

    print('');
    print('O.K.  I HAVE A NUMBER IN MIND.');

    let guesses = 0;
    let response;
    let gameWon = false;

    for (let guesses = 0; guesses < allowedGuesses; guesses++) {
        guesses > 0 && print('GUESS #' + guesses);
        let validInput = false;

        // Repeat until a valid input is given
        while (!validInput) {
            guesses === 0 && print('TRY GUESSING A THREE-DIGIT NUMBER.\n');
            response = await input();
            let guessMeetsDigitLength =
                String(response).length === numberDigitLength;
            let guessIsValidNumber = !Number.isNaN(response);
            let guessHasRepeatNumbers = response
                .split('')
                .some(function (element, index, array) {
                    return array.lastIndexOf(element) != index;
                });

            if (!guessMeetsDigitLength) {
                print('TRY GUESSING A THREE-DIGIT NUMBER.\n');
            } else if (guessHasRepeatNumbers) {
                print(
                    'OH, I FORGOT TO TELL YOU THAT THE NUMBER I HAVE IN MIND'
                );
                print('HAS NO TWO DIGITS THE SAME.');
            } else if (!guessIsValidNumber) {
                print('WHAT?');
            } else {
                validInput = true;
            }
        }

        // If response matches number to guess, the game is won! Return game data.
        if (response === numberToGuess.join('')) {
            gameWon = true;
            return { guesses, response, gameWon, numberToGuess };
        }

        // Split response number into an array of digits and cast from string to number.
        let responseArray = response.split('').map(Number);

        // Boolean test if response includes no digits from the numberToGuess
        let noDigitsCorrect = !responseArray.some(function (element) {
            return numberToGuess.includes(element);
        });

        if (noDigitsCorrect) {
            print('BAGELS');
        }

        // Check each response digit
        responseArray.forEach((element, index) => {
            let rightIndex = element === numberToGuess[index];
            if (rightIndex) {
                // If response digit matches numberToGuess index value
                printInline('FERMI ');
            } else if (numberToGuess.includes(element)) {
                // If response digit in included in numberToGuess at different index
                printInline('PICO ');
            }
        });
        print('');
    }
    // If they use all available guesses, the game is lost. Return game data.
    return { guesses, response, gameWon, numberToGuess };
}

// Main program
async function main() {
    let wantsToPlay = true;
    let points = 0;

    while (wantsToPlay) {
        let { gameWon, numberToGuess } = await playBagelGame();

        if (gameWon) {
            print('YOU GOT IT!!!');
            print('');
            points++;
        } else {
            print('OH WELL.');
            print(
                "THAT'S A TWENTY GUESS.  MY NUMBER WAS " +
                    numberToGuess.join('')
            );
        }

        print('PLAY AGAIN (YES OR NO)');
        let wantsToPlayAgainResponse = await input();

        wantsToPlay = lowercaseYesStrings.includes(
            wantsToPlayAgainResponse.toLowerCase()
        );

        if (points === 0) {
            print('HOPE YOU HAD FUN.  BYE.');
        } else {
            print('\nA ' + points + ' POINT BAGELS BUFF!!\n');
        }
    }
}

main();
