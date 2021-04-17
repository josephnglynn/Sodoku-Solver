export const MakeSudoku = (n: number): Array<Array<number>> => {

    const actualLength: number = n * n

    //setup of arrays to hold values
    const sudoku: Array<Array<number>> = []

    //setup of random numbers for first grid
    let options: Array<number> = []

    //looping through providing values
    for (let i = 0; i < actualLength; i++) {
        let temp: Array<number> = []
        for (let k = 0; k < actualLength; k++) {
            temp.push(0)
        }
        sudoku.push(temp)
        options.push(i + 1)
    }

    for (let i = 0; i < actualLength; i++) {
        const rando: number = Math.floor(Math.random() * (actualLength - 1)) + 1;
        [options[i], options[rando]] = [options[rando], options[i]];
    }

    sudoku[0] = options;


    for (let i = 1; i < actualLength; i++) {
        if (i % n == 0) {
            sudoku[i] = pushArrayToTheLeft(1, sudoku[i - 1])
        } else {
            sudoku[i] = pushArrayToTheLeft(n, sudoku[i - 1])
        }
    }

    return mixBlocksUp(sudoku, n)
}

const mixBlocksUp = (sudoku: Array<Array<number>>, n: number): Array<Array<number>> => {


    const col: Array<Array<Array<number>>> = []
    for (let i = 0; i < n; i++) {
        col.push([])
    }

    for (let p = 0; p < sudoku.length; p++) {
        for (let i = 0; i < n; i++) {
            col[i].push(sudoku[p].slice(n*i, (n*i)+n))
        }
    }

    [col[0], col[1]] = [col[1], col[0]]

    return sudoku;
}


const pushArrayToTheLeft = (amount: number, array: Array<number>): Array<number> => {
    const pushedArray: Array<number> = []
    for (let i = amount; i < array.length; i++) {
        pushedArray.push(array[i])
    }

    for (let i = 0; i < amount; i++) {
        pushedArray.push(array[i])
    }

    return pushedArray
}