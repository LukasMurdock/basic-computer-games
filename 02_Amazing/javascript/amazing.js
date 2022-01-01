// AMAZING
//
// Converted from BASIC to Javascript by Oscar Toledo G. (nanochess)
//

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

// Function to get inputs: width and height
async function inputWidthAndLength() {
    let validInput = false;
    let width, height;
    while (!validInput) {
        print('WHAT ARE YOUR WIDTH AND LENGTH');
        let widthAndHeight = await input();
        let [width, height] = widthAndHeight.split(',').map(Number);
        if (width > 1 && height > 1) {
            validInput = true;
        } else {
            print('MEANINGLESS DIMENSIONS.  TRY AGAIN.');
        }
    }
    return [width, height];
}

print(tab(28) + 'AMAZING PROGRAM');
print(tab(15) + 'CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY');
print('');
print('');
print('');
print('FOR EXAMPLE TYPE 10,10 AND PRESS ENTER');
print('');

// Main program
async function main() {
    let [width, height] = await inputWidthAndLength();
    printCells(width, height);
}

main();

// Function to generate and print cells
function printCells(width, height, seeOrderOfVisitedCells) {
    let w = [];
    let v = [];
    for (let i = 1; i <= height; i++) {
        w[i] = [];
        v[i] = [];
        for (let j = 1; j <= width; j++) {
            w[i][j] = 0;
            v[i][j] = 0;
        }
    }
    print('');
    print('');
    print('');
    print('');
    let q = 0;
    let z = 0;
    let x = Math.floor(Math.random() * height + 1);
    for (let i = 1; i <= height; i++) {
        if (i == x) printInline('.  ');
        else printInline('.--');
    }
    print('.');
    let c = 1;
    w[x][1] = c;
    c++;
    let r = x;
    let s = 1;
    let entry = 0;
    while (1) {
        if (entry == 2) {
            // Search for a non-explored cell
            do {
                if (r < height) {
                    r++;
                } else if (s < width) {
                    r = 1;
                    s++;
                } else {
                    r = 1;
                    s = 1;
                }
            } while (w[r][s] == 0);
        }
        if (entry == 0 && r - 1 > 0 && w[r - 1][s] == 0) {
            // Can go left?
            if (s - 1 > 0 && w[r][s - 1] == 0) {
                // Can go up?
                if (r < height && w[r + 1][s] == 0) {
                    // Can go right?
                    // Choose left/up/right
                    x = Math.floor(Math.random() * 3 + 1);
                } else if (s < width) {
                    if (w[r][s + 1] == 0) {
                        // Can go down?
                        // Choose left/up/down
                        x = Math.floor(Math.random() * 3 + 1);
                        if (x == 3) x = 4;
                    } else {
                        x = Math.floor(Math.random() * 2 + 1);
                    }
                } else if (z == 1) {
                    x = Math.floor(Math.random() * 2 + 1);
                } else {
                    q = 1;
                    x = Math.floor(Math.random() * 3 + 1);
                    if (x == 3) x = 4;
                }
            } else if (r < height && w[r + 1][s] == 0) {
                // Can go right?
                if (s < width) {
                    if (w[r][s + 1] == 0) {
                        // Can go down?
                        // Choose left/right/down
                        x = Math.floor(Math.random() * 3 + 1);
                    } else {
                        x = Math.floor(Math.random() * 2 + 1);
                    }
                    if (x >= 2) x++;
                } else if (z == 1) {
                    x = Math.floor(Math.random() * 2 + 1);
                    if (x >= 2) x++;
                } else {
                    q = 1;
                    x = Math.floor(Math.random() * 3 + 1);
                    if (x >= 2) x++;
                }
            } else if (s < width) {
                if (w[r][s + 1] == 0) {
                    // Can go down?
                    // Choose left/down
                    x = Math.floor(Math.random() * 2 + 1);
                    if (x == 2) x = 4;
                } else {
                    x = 1;
                }
            } else if (z == 1) {
                x = 1;
            } else {
                q = 1;
                x = Math.floor(Math.random() * 2 + 1);
                if (x == 2) x = 4;
            }
        } else if (s - 1 > 0 && w[r][s - 1] == 0) {
            // Can go up?
            if (r < height && w[r + 1][s] == 0) {
                if (s < width) {
                    if (w[r][s + 1] == 0) x = Math.floor(Math.random() * 3 + 2);
                    else x = Math.floor(Math.random() * 2 + 2);
                } else if (z == 1) {
                    x = Math.floor(Math.random() * 2 + 2);
                } else {
                    q = 1;
                    x = Math.floor(Math.random() * 3 + 2);
                }
            } else if (s < width) {
                if (w[r][s + 1] == 0) {
                    x = Math.floor(Math.random() * 2 + 2);
                    if (x == 3) x = 4;
                } else {
                    x = 2;
                }
            } else if (z == 1) {
                x = 2;
            } else {
                q = 1;
                x = Math.floor(Math.random() * 2 + 2);
                if (x == 3) x = 4;
            }
        } else if (r < height && w[r + 1][s] == 0) {
            // Can go right?
            if (s < width) {
                if (w[r][s + 1] == 0) x = Math.floor(Math.random() * 2 + 3);
                else x = 3;
            } else if (z == 1) {
                x = 3;
            } else {
                q = 1;
                x = Math.floor(Math.random() * 2 + 3);
            }
        } else if (s < width) {
            if (w[r][s + 1] == 0)
                // Can go down?
                x = 4;
            else {
                entry = 2; // Blocked!
                continue;
            }
        } else if (z == 1) {
            entry = 2; // Blocked!
            continue;
        } else {
            q = 1;
            x = 4;
        }
        if (x == 1) {
            // Left
            w[r - 1][s] = c;
            c++;
            v[r - 1][s] = 2;
            r--;
            if (c == height * width + 1) break;
            q = 0;
            entry = 0;
        } else if (x == 2) {
            // Up
            w[r][s - 1] = c;
            c++;
            v[r][s - 1] = 1;
            s--;
            if (c == height * width + 1) break;
            q = 0;
            entry = 0;
        } else if (x == 3) {
            // Right
            w[r + 1][s] = c;
            c++;
            if (v[r][s] == 0) v[r][s] = 2;
            else v[r][s] = 3;
            r++;
            if (c == height * width + 1) break;
            entry = 1;
        } else if (x == 4) {
            // Down
            if (q != 1) {
                // Only if not blocked
                w[r][s + 1] = c;
                c++;
                if (v[r][s] == 0) v[r][s] = 1;
                else v[r][s] = 3;
                s++;
                if (c == height * width + 1) break;
                entry = 0;
            } else {
                z = 1;
                if (v[r][s] == 0) {
                    v[r][s] = 1;
                    q = 0;
                    r = 1;
                    s = 1;
                    while (w[r][s] == 0) {
                        if (r < height) {
                            r++;
                        } else if (s < width) {
                            r = 1;
                            s++;
                        } else {
                            r = 1;
                            s = 1;
                        }
                    }
                    entry = 0;
                } else {
                    v[r][s] = 3;
                    q = 0;
                    entry = 2;
                }
            }
        }
    }
    for (let j = 1; j <= width; j++) {
        let str = 'I';
        for (let i = 1; i <= height; i++) {
            if (v[i][j] < 2) str += '  I';
            else str += '   ';
        }
        print(str + '');
        str = '';
        for (let i = 1; i <= height; i++) {
            if (v[i][j] == 0 || v[i][j] == 2) str += ':--';
            else str += ':  ';
        }
        print(str + '.');
    }

    // If you want to see the order of visited cells
    if (seeOrderOfVisitedCells) {
        for (let j = 1; j <= width; j++) {
            let str = 'I';
            for (let i = 1; i <= height; i++) {
                str += w[i][j] + ' ';
            }
            print(str + '');
        }
    }
}
