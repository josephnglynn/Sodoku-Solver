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


export const bruteForce = (state: Array<Array<number>>, n: number): boolean => {
    for (let i = 0; i < n*n; i++) {
        for (let j = 0; j < n*n; j++) {
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


const checkSudoku = (state: Array<Array<number>>, n: number):boolean => {
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
    return [state, checkSudoku(state, n)];
}




