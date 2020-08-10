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
        squares: Array(9).fill(null),
      }],

      // stepNumber is needed to make jumpTo method work.
      // That method allows buttons of game history work.
      stepNumber: 0,
      xIsNext: true,
      
    };
  }

  // Information about how handleClick works is in Board component.
  // Its due to the fact that initially that function was there, before
  // lifitng state up to Game comp.
  handleClick(i) {

    // // history contains array of Board configurations after each turn.
    // // Then we get into current configuration on board assigned to 
    // // current constant.
    // // After that, winner calcualting, etc. works similiar as earlier.

    // Here the history constant has .slice() method - it will ensure 
    // that after going back in time, all the future-but-not-true-anymore
    // steps will be deleted. Bear in mind that deletion of these buttons
    // does not affect the element's key rule, because index will also go
    // back and new buttons will get keys of older buttons.
    // jumpTo() method alters the state.stepNumber value - that value
    // is stored in State, so that will update below 'history' value and
    // update the whole button tree.
    const history = this.state.history.slice(0, this.state.stepNumber +1);

    // Here history.length - 1 and this.state.stepNumber are equal, so it
    // does not matter which we use. What is more, the history.length is
    // linked to this.state.stepNumber value (check line above)
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
        squares: squares,
        ClickedSquare: i,
      }]),

      // Here, stepNumber reflects moment on which the game is currently on,
      // before new symbol were put in Square. At the start it's equal to 0,
      // so 'Go to game start button' will bring back the full empty board.
      // Each new elements adds 1 to stepNumber and after pressing the button,
      // counter will reset accordingly to new Game status.
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // Very poor wording of arguments, as 'step' is called 'move'
  // in render() method.
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;

    // Here we changed it from history.length - 1 to
    // this.state.stepNumber - it will now render the currently 
    // selected move (in case of clicking a button), from previous
    // always rendering the last move. Without that change, buttons
    // will not work.
    const current = history[this.state.stepNumber];
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

      // In state we keep the clicked Square that happened in each
      // Board config. Based on that, we calculate in which column
      // and row the clicked Square was.
      const currentSquare = step.ClickedSquare;
      const col = (currentSquare % 3) + 1;
      const row = Math.floor(currentSquare / 3) + 1;

      const desc = move ?
      'Go to move #' + move + ' col: ' + col + ' row: ' + row :
      'Go to game start';

      // each child element in React needs a KEY - normally it suppose
      // to be unique ID generated from DB or generated earlier on,
      // however here the buttons will never be reordered, deleted
      // or inserted in the middle, so here using index as a key is
      // safe option.
      return (
        <li key={move}>
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
};
