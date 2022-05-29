import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button className={"square" + (props.isWinning ? " winning-square" : "")} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          isWinning={this.props.winningSquares.includes(i)}
        />
      );
    }
  
    render() {
      
      const renderBoard = () => {
        let sqareBoard = []
        for(let i=0; i<3; i++){
          sqareBoard = sqareBoard.concat(renderRow(i))
        }
        return sqareBoard;
      }

      const renderRow = (i) => {
        let sqareRow = []
          for(let j = 0; j<3; j++)
            sqareRow = sqareRow.concat(this.renderSquare(3*i + j))
          return sqareRow.concat(<br key={"br" + i} />)
      }
        
      return (
        <div>
          {renderBoard()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true,
        moveList: [
          [null,null,null]
        ],
        isReversed: false,
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const moveList = this.state.moveList.slice(0, this.state.stepNumber + 1);
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        moveList: moveList.concat([
          [this.state.xIsNext ? 'X' : 'O', i % 3 +1, Math.floor(i / 3) +1]
        ])
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moveList = this.state.moveList;
      const moves = []
      history.map((step, move) => {
        const desc = move? 
          move + ". move: " + moveList[move][0] + " to (" + moveList[move][1]+"," + moveList[move][2] + ")":
          'go to game start';
        moves.push(
          <li key={move}>
            <button onClick={()=> this.jumpTo(move)}>{(move === this.state.stepNumber ? <b>{desc}</b>: desc)}</button>
          </li>
        );
        return true;
      });
  
      let status;
      if (winner) 
        status = 'Winner: ' + winner.player;
      else if (this.state.stepNumber === 9)
        status = 'Draw';
      else 
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winningSquares={winner ? winner.winningSquares : []}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <button onClick={() => this.setState({
              isReversed: !this.state.isReversed,
            })}>Reversed - {this.state.isReversed? "on" : "off"}</button>
            <div>{status}</div>
            <ul>{this.state.isReversed? moves.reverse(): moves}</ul>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {player: squares[a], winningSquares: [a,b,c]};
      }
    }
    return null;
  }

  