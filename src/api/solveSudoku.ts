function isValid(state: Array<Array<number>>, row: number, col: number, k: number, n: number) {
    for (let i = 0; i < n*n; i++) {
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
                for (let k = 1; k <= n*n; k++) {
                    if (isValid(state, i, j, k, n)) {
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


const checkSudoku = (state: Array<Array<number>>):boolean => {
    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state.length; col++) {
            if (state[row][col] == 0) {
                return false;
            }
        }
    }
    return true;
}

const bruteForceWrapper = (state: Array<Array<number>>, n: number):Array<Array<number>> => {
    bruteForce(state, n)
    return state;
}


export const solvePartOfSudoku = (state: Array<Array<number>>, n: number, setState: (s: Array<Array<number>>) => void, showMessage: (message: String, onAccept: Function, onCancel: Function) => void ): [Array<Array<number>>, boolean] => { //need to return array for state change

    let average: number = calculateAverage(n*n);
    if (checkRowsForOneLeft(state, average)) {
        return;
    }

    if (checkColumnsForOneLeft(state, average)) {
        return;
    }

    if (checkSquares(state, n, average)) {
        return;
    }

    if (checkLargerRows(state, n)) {
        return;
    }

    //No Strategy Worked
    showMessage("This Sudoku Proved To Be To Difficult\nReverting To Brute Force", ()=>setState(bruteForceWrapper(state, n)), ()=>{});

    return [state, checkSudoku(state)];
}



const calculateAverage = (length: number) => {
    let count: number = 0;
    for (let i = 1; i <=length; i++) {
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


const checkColumnsForOneLeft  = (state: Array<Array<number>>, average: number): Boolean => { //CHECKS TO SEE HOW MANY NUMBERS ARE LEFT IN A COLUMN - IF ONLY ONE THEN CAN FILL IN
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
        for (let k = (i*n); k < (i+1)*n; k++) {
            for (let j = (i*n); j < (i+1)*n; j++) {
                if(state[j][k] == 0) {
                    totalNumberOfZeros++;
                } else {
                    current += state[j][k];
                }
            }
        }
        if (totalNumberOfZeros == 1) {
            for (let k = (i*n); k < (i+1)*n; k++) {
                for (let j = (i*n); j < (i+1)*n; j++) {
                    if(state[j][k] == 0) {
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
    //check each number through all rows
    
    for (let i = 0; i < n; i++) {
        /*
        CHECKS ALL BIG COLUMNS - E.G:
        [1 2] [3 4]
        [3 4] [1 2]
        [2 1] [4 3]
        [4 3] [2 1]
        IT WOULD CHECK THE COLUMN:
        [1 2]
        [3 4]
        [2 1]
        [4 3]
         */
        for (let k = (i*n); k < (i+1)*n; k++) {
            /*
            (i*n) so we move to correct column
            IN EXAMPLE ABOVE, ON SECOND ITERATION - (i*n) = (1*2) = 2
            SO WE START ITERATING BETWEEN THE VALUES 2 AND 3 IN THE EXAMPLE ABOVE ( INDEXING STARTING AT 0 )
            K IS THE COLUMN NUMBER
             */
            for (let j = (i*n); j < (i+1)*n; j++) {
                    /*
                    HERE LIKE ABOVE WE DO (i*n)
                    THIS TIME j IS THE ROW NUMBER
                     */
                    console.log(`I: ${i}, K: ${k}, J: ${j}`);
            }
        }
    }
    return false;
}