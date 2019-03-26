import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
        className="square" 
        onClick={props.onClick} 
      >
        {props.value}
      </button>
  );
}



class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  vetorSquares(){
    let Squares = Array(3)
    for (let i=0; i<9; i++) {
      Squares.push(this.renderSquare(i))
    }
    return Squares
  }

  render() {
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

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

      historico: [{
        squares: Array(9).fill(null)
      }],

      proximo: true,
      jogada: 0
    }
  }

  handleClick(i) {
    const historico = this.state.historico.slice(0, this.state.jogada + 1)
    const atual = historico[historico.length - 1]
    const squares = atual.squares.slice()  
    if (calculateWinner(squares) || squares[1]) {
      return;
    }
    squares[i] = this.state.proximo ? 'X' : '0';
    this.setState({

      historico: historico.concat([{
        squares: squares
      }]),
      jogada: historico.length,
      proximo: !this.state.proximo
    });
  }

  irPara(idJogada) {
    this.setState({
      jogada: idJogada,
      proximo: (idJogada%2) === 0
    });
  }

  render() {
    const historico = this.state.historico
    const atual = historico[this.state.jogada]
    const vencedor = calculateWinner(atual.squares)

    const jogadas = historico.map((jogadas, movimento) => {
      const descricao = movimento ? 
      `Movimento ${movimento+1}` :
      `Ínicio do jogo`
      return (
        <li key={movimento}>
          <button className="botao" onClick={() => this.irPara(movimento)}>
          {descricao}
          </button>
        </li>
      );
    });

    let status
    let classe
    if (vencedor) {
      status = `Jogador ${vencedor} venceu!`
      classe = 'vencedor'
    } else {
      status = `Próximo jogador: ${this.state.proximo ? 'X' : '0'}`
      classe = 'status-game'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={atual.squares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div className={classe} >{status}</div>
          <ol>{jogadas}</ol>
        </div>
      </div>
    );
  }
}

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
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
