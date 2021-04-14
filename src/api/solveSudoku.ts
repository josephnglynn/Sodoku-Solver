export const isValidSudoku = (state: Array<Array<number>>, row: number, col: number, k: number, n: number): Boolean => {
    for (let i = 0; i < n * n; i++) {
        const q = n * Math.floor(row / n) + Math.floor(i / n);
        const p = n * Math.floor(col / n) + i % n;
        if (state[row][i] == k || state[i][col] == k || state[q][p] == k) {
            return false;
        }
    }
    return true;
}


const bruteForce = (state: Array<Array<number>>, n: number): boolean => {
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state.length; j++) {
            if (state[i][j] == 0) {
                for (let k = 1; k <= n * n; k++) {
                    if (isValidSudoku(state, i, j, k, n)) {
                        state[i][j] = k;
                        if (bruteForce(state, n)) {
                            return true;
                        } else {
                            state[i][j] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}


const checkSudoku = (state: Array<Array<number>>): boolean => {
    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state.length; col++) {
            if (state[row][col] == 0) {
                return false;
            }
        }
    }
    return true;
}

const bruteForceWrapper = (state: Array<Array<number>>, n: number): Array<Array<number>> => {
    bruteForce(state, n)
    return state;
}


export const solvePartOfSudoku = (state: Array<Array<number>>, n: number, setState: (s: Array<Array<number>>) => void, showMessage: (message: String, onAccept: Function, onCancel: Function) => void): [Array<Array<number>>, boolean] => { //need to return array for state change

    let average: number = calculateAverage(n * n);
    if (checkRowsForOneLeft(state, average)) {
        return [state, checkSudoku(state)];
    }

    if (checkColumnsForOneLeft(state, average)) {
        return [state, checkSudoku(state)];
    }

    if (checkSquares(state, n, average)) {
        return [state, checkSudoku(state)];
    }

    if (checkLargerRows(state, n)) {
        return [state, checkSudoku(state)];
    }

    //No Strategy Worked
    if (showMessage == null) {
        bruteForceWrapper(state, n)
    } else {
        showMessage("This Sudoku Proved To Be To Difficult\nReverting To Brute Force", () => setState(bruteForceWrapper(state, n)), () => {
        });
    }

    return [state, checkSudoku(state)];
}


const calculateAverage = (length: number) => {
    let count: number = 0;
    for (let i = 1; i <= length; i++) {
        count += i;
    }
    return count;
}

const checkRowsForOneLeft = (state: Array<Array<number>>, average: number): boolean => { //CHECKS TO SEE HOW MANY NUMBERS ARE LEFT IN A ROW - IF ONLY ONE THEN CAN FILL IN
    // noinspection DuplicatedCode
    for (let i = 0; i < state.length; i++) {
        let count = 0;
        let col = 0;
        let onlyOneNumber: number = 0;
        for (let k = 0; k < state.length; k++) {
            count += state[i][k]
            if (state[i][k] == 0) {
                onlyOneNumber++;
                col = k;
            }
        }
        if (onlyOneNumber == 1) {
            state[i][col] = average - count;
            return true;
        }
    }
    return false;
}


const checkColumnsForOneLeft = (state: Array<Array<number>>, average: number): Boolean => { //CHECKS TO SEE HOW MANY NUMBERS ARE LEFT IN A COLUMN - IF ONLY ONE THEN CAN FILL IN
    // noinspection DuplicatedCode
    for (let i = 0; i < state.length; i++) {
        let count = 0;
        let row = 0;
        let onlyOneNumber: number = 0;
        for (let k = 0; k < state.length; k++) {
            count += state[k][i]
            if (state[k][i] == 0) {
                onlyOneNumber++;
                row = k;
            }
        }
        if (onlyOneNumber == 1) {
            state[row][i] = average - count;
            return true;
        }
    }
    return false;
}


const checkSquares = (state: Array<Array<number>>, n: number, average: number): Boolean => {


    for (let i = 0; i < n; i++) {
        let totalNumberOfZeros = 0;
        let current = 0;
        for (let k = (i * n); k < (i + 1) * n; k++) {
            for (let j = (i * n); j < (i + 1) * n; j++) {
                if (state[j][k] == 0) {
                    totalNumberOfZeros++;
                } else {
                    current += state[j][k];
                }
            }
        }
        if (totalNumberOfZeros == 1) {
            for (let k = (i * n); k < (i + 1) * n; k++) {
                for (let j = (i * n); j < (i + 1) * n; j++) {
                    if (state[j][k] == 0) {
                        state[j][k] = average - current;
                        return true;
                    }
                }
            }
        }

    }

    return false;
}


const checkLargerRows = (state: Array<Array<number>>, n: number): Boolean => {

    let totalPossibility: Array<number> = [];

    for (let i = 1; i <= n * n; i++) {
        totalPossibility.push(i);
    }


    //Possible Values Of Numbers
    let speculativeState: Array<Array<Array<number>>> = new Array<Array<Array<number>>>(n*n);
    for (let i = 0; i < state.length; i++) {
        speculativeState[i] = new Array<Array<number>>(n*n);
        for (let k = 0; k < state.length; k++) {

            if (state[i][k] == 0) {
                speculativeState[i][k] = totalPossibility; //We Fill It Up With Numbers Which We Know Are Possibilities
            } else {
                speculativeState[i][k] = [state[i][k]];
            }

        }
    }



    //SET WHERE NUMBER CANNOT GO
    for (let column = 0; column < state.length; column++) {
        for (let row = 0; row < state.length; row++) {

            if (speculativeState[column][row].length == 1) {
                for (let i = 0; i < state.length; i++) {
                    if (speculativeState[column][i].length != 1) {
                        speculativeState[column][i] = speculativeState[column][i].filter(value => value != speculativeState[column][row][0]);
                    }
                    if (speculativeState[i][row].length != 1) {
                        speculativeState[i][row] = speculativeState[i][row].filter(value => value != speculativeState[column][row][0]);
                    }
                }
            }
        }
    }

    for (let bigColumn = 0; bigColumn < state.length; bigColumn+=n) {
        for (let bigRow = 0;  bigRow < state.length;  bigRow+=n) {
            //So Now We Have The Top Left Corner Of Each Square.
            //FIRST WE NEED TO FIND OUT WHAT NUMBERS HAVE BEEN DONE
            let doneNumbers: Array<number> = [];
            for (let smallColumn = bigColumn; smallColumn < bigColumn+n; smallColumn++) {
                for (let smallRow = bigRow; smallRow < bigRow+n; smallRow++) {
                    //Now We Get All Numbers
                    if (speculativeState[smallColumn][smallRow].length == 1) {
                        doneNumbers.push(speculativeState[smallColumn][smallRow][0]);
                    }
                }
            }

            //Now We Know What Numbers Are Done, We Can Safly remove them
            for (let smallColumn = bigColumn; smallColumn < bigColumn+n; smallColumn++) {
                for (let smallRow = bigRow; smallRow < bigRow+n; smallRow++) {
                    if (speculativeState[smallColumn][smallRow].length > 1) {
                        let before = speculativeState[smallColumn][smallRow].length;
                        speculativeState[smallColumn][smallRow] = speculativeState[smallColumn][smallRow].filter((value => {
                            for (let i = 0; i < doneNumbers.length; i++) {
                                if (value == doneNumbers[i]) {
                                    return false;
                                }
                            }
                            return true;
                        }))
                    }
                }
            }
        }
    }


    for (let i = 0; i < state.length; i++) { //Row
        for (let k = 0; k < state.length; k++) { //Column
            if (speculativeState[i][k].length == 1) {
                if (state[i][k] == 0) {
                    state[i][k] = speculativeState[i][k][0];
                    return true;
                }
                state[i][k] = speculativeState[i][k][0];
            }
        }
    }

    return false;
}