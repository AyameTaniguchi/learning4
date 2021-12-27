import React, {useState, useContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

type squareProps = {
    value: squareState
    onClick: () => void
    children?: React.ReactNode
}

type squareState = 'O' | 'X' | null;

type boardProps = {
    squares: squareState[]
    onClick: (i: number) => void
}

// クリックされるごとにprops.value(〇,×)を描画
const Square = (props: squareProps) => {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


// 表の描画・表のマス目ごとに数字をつける(i)、クリックするとi番目のマス目を引数にしてSquare呼出
const Board = (props: boardProps) => {
    const renderSquare = (i: number) => {
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}


const Game = () => {
    const [history, setHistory] = useState<{ squares: squareState[] }[]>([{squares: Array(9).fill(null)}]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    const [xIsNext, setXIsNext] = useState<boolean>(true);

    const handleClick = (i: number) => {
        const partHistory = history.slice(0, stepNumber + 1);
        const current = partHistory[partHistory.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";
        setHistory(partHistory.concat([{squares: squares}]));
        setStepNumber(partHistory.length);
        setXIsNext(!xIsNext);
    }

    const jumpTo = (step: number) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    }

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step: { squares: squareState[] }, move: number) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i: number) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}


// ========================================

ReactDOM.render(<Game/>, document.getElementById("root"));

function calculateWinner(squares: squareState[]): string | null {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();