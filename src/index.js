import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import happy from './happy.jpg';
import sad  from './sad.jpg';


class Square extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        value: null,
        };
}
  render() {
    let valueOfSource;
    if (this.state.value != null)
    {
        valueOfSource = sad;
    } 
    else
    {
        valueOfSource = happy;
    }

    return (
      <img 
        src={valueOfSource} 
        alt="pic" 
        onClick={() => {
            if(this.state.value == null)
            {
                this.setState({value: 'X'}) 
            }

            else
            {
                this.setState({value: null})
            }
          }
        }/>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          squares: Array(9).fill(null),
      };
  }
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Cadia fell before the guard did';

    return (
      <div>
        <div className="status">{status}</div>
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

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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
