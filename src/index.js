import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// // State has been moved from Square to Board for further
// // advancement of the game - it is needed to determine the winner.
// // The Squares are still clickable, yet they rerender accordingly
// // to changes of Board's state.

// State has been lifted up further to Game component for next
// game improvements.
class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }

  // // the .slice() allows creating a copy of squares array
  // // instead of modifying OG array. This allows immutability
  // // of objects, which in exchange gives some benefits:
  // // 1) Avoiding direct data change allows to simplify complex
  // // functionalities like game history,
  // // 2) Detecting changes in objects is much easier;
  // // 3) Not changing objects allow creating pure components in
  // // React and easify determining when component requires 
  // // re-rendering.
  // // Here, square gets the value depending on which player in 
  // // his turn clicked the square.
  // handleClick(i) {
  //   const squares = this.state.squares.slice();

  //   // This if statement does two things - firstly, if Square
  //   // already has X or O inside it, player's clicking the field will
  //   // not change the square's value (and will not change the turn).
  //   // secondly, after winning the game by either of players, clicking
  //   // the squares will not change their value.
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  // whole handleClick(i) method has been moved upward to Game component
  // and has been changed.

  // here we change state to props due to lifting state up
  // to Game component.
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // // Here has been added mechanism to decide the winner base on
  // // calucation from calculateWinner() method. In case nobody wins
  // // (yet), the 'Next player' text will change accordingly to player's
  // // turn.

  render() {
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // }
    // else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    // Above text information has been moved to Game component.
    // Below, one line
    // <div className="status">{status}</div>
    // has been removed due to it's obsoleteness
    
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// We want to introduce 'game history' option,
// to that we will need lift the state up yet again,
// previously from Square to Board, now from Board to Game.
// It will allow to keep the 'history' and keep full control
// over Board's data and let us render previous moves based on
// the 'history'.
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true
    };
  }

  // Information about how handleClick works is in Board component.
  // Its due to the fact that initially that function was there, before
  // lifitng state up to Game comp.
  handleClick(i) {

    // history contains array of Board configurations after each turn.
    // Then we get into current configuration on board assigned to 
    // current constant.
    // After that, winner calcualting, etc. works similiar as earlier.
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Major change occurs here - initially, the board in empty.
    // After clicking any Square, the handleClick(i) method activates,
    // Current Board config is copied, the winner condition is checked,
    // Then the square which was clicked will be assigned the value of
    // X or O. After that, the new state of Board is concatenated to
    // game history (the .push() instead of .concat() would mutate the
    // array) and with that we have access to Board configuration after
    // each step.
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    // .map() method on array is able to map data to other data - 
    // here we use it on the array of Board configs and map it onto 
    // list of buttons. After each move where new Square is filled up,
    // new button will appear - what is more, not the whole structure
    // of buttons will be reloaded, only the new button will be added.
    // .map() works that way only new elements will be mapped after each
    // call of that method. However, there is no way of mutating buttons
    // (elements) that already have been created.
     // 'moves' is a list/array of <button/> elements.
    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return squares[a];
    }
  }
    return null;
}
