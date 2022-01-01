// ACEY DUCEY
//
// Converted from BASIC to Javascript by Oscar Toledo G. (nanochess)
//

const lowercaseYesStrings = ['yes', 'y'];

// Determine if code is running in browser;
// by default there is no window object in Node.js.
const isRunningInBrowser = typeof window !== 'undefined';

// Function to get a random number (card) 2-14 (ACE is 14)
function getRandomCard() {
    // In our game, the value of ACE is greater than face cards;
    // instead of having the value of ACE be 1, we’ll have it be 14.
    // So, we want to shift the range from 1-13 to 2-14
    let min = 2;
    let max = 14;
    // Return random integer between two values, inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getGameCards() {
    let cardOne = getRandomCard();
    let cardTwo = getRandomCard();
    let cardThree = getRandomCard();
    // Generate random cards until card one is lower than card two
    while (cardOne >= cardTwo) {
        cardOne = getRandomCard();
        cardTwo = getRandomCard();
    }
    return [cardOne, cardTwo, cardThree];
}

// Function to easily add spaces to a string
function tab(numberOfSpaces) {
    let spaces = ' '.repeat(numberOfSpaces);
    return spaces;
}

// Function to get card value
function getCardValue(card) {
    let faceOrAce = {
        11: 'JACK',
        12: 'QUEEN',
        13: 'KING',
        14: 'ACE',
    };
    // If card value matches a key in faceOrAce, use faceOrAce value;
    // Else, return undefined and handle with the Nullish Coalescing Operator (??)
    // and default to card value.
    let cardValue = faceOrAce[card] ?? card;
    return cardValue;
}

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

print(tab(26) + 'ACEY DUCEY CARD GAME');
print(tab(15) + 'CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY');
print('');
print('');
print('ACEY-DUCEY IS PLAYED IN THE FOLLOWING MANNER');
print('THE DEALER (COMPUTER) DEALS TWO CARDS FACE UP');
print('YOU HAVE AN OPTION TO BET OR NOT BET DEPENDING');
print('ON WHETHER OR NOT YOU FEEL THE CARD WILL HAVE');
print('A VALUE BETWEEN THE FIRST TWO.');
print('IF YOU DO NOT WANT TO BET, INPUT A 0');

// Main program
async function main() {
    let bet;
    let dollars = 100;

    // Loop game forever
    while (true) {
        let [cardOne, cardTwo, cardThree] = getGameCards();

        print('YOU NOW HAVE ' + dollars + ' DOLLARS.');
        print('');
        print('HERE ARE YOUR NEXT TWO CARDS: ');

        print(getCardValue(cardOne));
        print(getCardValue(cardTwo));

        // Loop until receiving a valid bet
        let validBet = false;
        while (!validBet) {
            print('');
            print('WHAT IS YOUR BET');
            print('? ');
            bet = parseInt(await input());
            if (bet > 0) {
                if (bet > dollars) {
                    print('SORRY, MY FRIEND, BUT YOU BET TOO MUCH.');
                    print(`YOU HAVE ONLY ${dollars} DOLLARS TO BET.`);
                    continue;
                } else {
                    validBet = true;
                }
            } else {
                print('CHICKEN!!');
                print('');
            }
        }

        print(getCardValue(cardThree));

        // Determine if player won or lost
        if (cardThree > cardOne && cardThree < cardTwo) {
            print('YOU WIN!!!');
            dollars = dollars + bet;
        } else {
            print('SORRY, YOU LOSE');

            if (bet >= dollars) {
                print('');
                print('');
                print('SORRY, FRIEND, BUT YOU BLEW YOUR WAD.');
                print('');
                print('');
                print('TRY AGAIN (YES OR NO)');

                let tryAgainInput = await input();

                print('');
                print('');

                if (lowercaseYesStrings.includes(tryAgainInput.toLowerCase())) {
                    dollars = 100;
                } else {
                    print('O.K., HOPE YOU HAD FUN!');
                    break;
                }
            } else {
                dollars = dollars - bet;
            }
        }
    }
}

main();
