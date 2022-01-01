// ANIMAL
//
// Converted from BASIC to Javascript by Oscar Toledo G. (nanochess)
//

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

print(tab(32) + 'ANIMAL');
print(tab(15) + 'CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY');
print('');
print('');
print('');
print("PLAY 'GUESS THE ANIMAL'");
print('');
print('THINK OF AN ANIMAL AND THE COMPUTER WILL TRY TO GUESS IT.');
print('');

// Function to handle animal input
async function inputAnimal() {
    let validInput = false;
    let animalInput;
    while (!validInput) {
        print('ARE YOU THINKING OF AN ANIMAL');
        animalInput = await input();
        if (animalInput.toLowerCase() === 'list') {
            print('');
            print('ANIMALS I ALREADY KNOW ARE:');
            print(animals.join(', '));
        } else if (lowercaseYesStrings.includes(animalInput.toLowerCase())) {
            validInput = true;
        }
    }
    return animalInput;
}

// Game starting settings
let questionsAndAnimals = [
    { question: 'DOES IT SWIM', fish: true, bird: false },
    { question: 'DOES IT FLY', fish: false, bird: true },
];
let animals = ['FISH', 'BIRD'];

// Main control section
async function main() {
    while (true) {
        let animalInput = await inputAnimal();
        let animalMatches = {};

        // For every question
        for (let questionAndAnimal of questionsAndAnimals) {
            let validInput;
            let response;

            // Wait for a valid answer
            while (!validInput) {
                print(questionAndAnimal.question);
                let answer = await input();
                validInput = validInputStrings.includes(answer.toLowerCase());
                response = lowercaseYesStrings.includes(answer.toLowerCase());
            }

            // If response matches animal values, increment animal in animalMatches.
            Object.keys(questionAndAnimal).forEach((key) => {
                if (questionAndAnimal[key] === response) {
                    animalMatches[key] = animalMatches[key]
                        ? animalMatches[key]++
                        : 1;
                }
            });
        }

        // Guess animal match by selecting the animal in animalMatches with the highest increment value.
        let guess = Object.keys(animalMatches)
            .reduce((a, b) => (animalMatches[a] > animalMatches[b] ? a : b))
            .toUpperCase();

        print('IS IT A ' + guess);

        let isCorrectGuess = lowercaseYesStrings.includes(await input());
        if (isCorrectGuess) {
            print('WHY NOT TRY ANOTHER ANIMAL?');
        } else {
            print('THE ANIMAL YOU WERE THINKING OF WAS A ');
            let newAnimal = await input();
            animals.push(newAnimal);
            print(
                `PLEASE TYPE IN A QUESTION THAT WOULD DISTINGUISH A ${newAnimal} FROM A ${guess} `
            );
            let newQuestion = await input();
            let newAnimalAnswers = {};
            // Set the new question values for each animal
            for (let animal of animals) {
                let response;
                let validInput;
                while (!validInput) {
                    print(`FOR A ${animal} THE ANSWER WOULD BE `);
                    let answer = await input();
                    validInput = validInputStrings.includes(
                        answer.toLowerCase()
                    );
                    response = lowercaseYesStrings.includes(
                        answer.toLowerCase()
                    );
                }

                newAnimalAnswers[animal.toLowerCase()] = response;
            }
            questionsAndAnimals.push({
                question: String(newQuestion),
                ...newAnimalAnswers,
            });
            console.log(questionsAndAnimals);
        }
    }
}

main();
