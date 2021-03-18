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

export const runBruteForceWrapper = (state: Array<Array<number>>, n: number): Array<Array<number>> => {
    bruteForce(state, n);
    return state;
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


export const solvePartOfSudoku = (state: Array<Array<number>>, n: number): [Array<Array<number>>, boolean] => { //need to return array for state change
    constraintPropagation(state, n);
    return [state, checkSudoku(state)];
}

const constraintPropagation = (state: Array<Array<number>>, n: number) => {
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

    //No Strategy Worked
    alert("This Sudoku Proved To Be To Difficult\nReverting To Brute Force");
    bruteForce(state, n);
}


const calculateAverage = (length: number) => {
    let count: number = 0;
    for (let i = 1; i <=length; i++) {
        count += i;
    }
    return count;
}

const checkRowsForOneLeft = (state: Array<Array<number>>, average: number): boolean => {
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


const checkColumnsForOneLeft  = (state: Array<Array<number>>, average: number): Boolean => {
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


enum height {
    Top,
    Center,
    Bottom,
}

enum width {
    right,
    center,
    left
}


const checkLargerRows = (state: Array<Array<number>>, n: number): Boolean => {
    //check each number through all rows
    
    for (let i = 0; i < n; i++) {
        for (let k = (i*n); k < (i+1)*n; k++) {
            for (let j = (i*n); j < (i+1)*n; j++) {
                    
            }
        }
    }
    return false;
}