// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button className="square">
//           {/* TODO */}
//         </button>
//       );
//     }
//   }
  
//   class Board extends React.Component {
//     renderSquare(i) {
//       return <Square />;
//     }
  
//     render() {
//       const status = 'Next player: X';
  
//       return (
//         <div>
//           <div className="status">{status}</div>
//           <div className="board-row">
//             {this.renderSquare(0)}
//             {this.renderSquare(1)}
//             {this.renderSquare(2)}
//           </div>
//           <div className="board-row">
//             {this.renderSquare(3)}
//             {this.renderSquare(4)}
//             {this.renderSquare(5)}
//           </div>
//           <div className="board-row">
//             {this.renderSquare(6)}
//             {this.renderSquare(7)}
//             {this.renderSquare(8)}
//           </div>
//         </div>
//       );
//     }
//   }
  
//   class Game extends React.Component {
//     render() {
//       return (
//         <div className="game">
//           <div className="game-board">
//             <Board />
//           </div>
//           <div className="game-info">
//             <div>{/* status */}</div>
//             <ol>{/* TODO */}</ol>
//           </div>
//         </div>
//       );
//     }
//   }
  
//   // ========================================
  
//   ReactDOM.render(
//     <Game />,
//     document.getElementById('root')
//   );
  
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Background extends React.Component{
    constructor(){
        super();
        this.state = {
            pictures: [],
        };
    }
    componentDidMount() {
        fetch('https://randomuser.me/api/?results=500')
        .then(results => {
            return results.json();
        })
        .then(data => {
            let pictures = data.results.map((pic) => {
                return(
                    <div key = {pic.results}>
                        <img src={pic.picture.medium} alt="blahh"/>
                    </div>
                )
            })
            this.setState({pictures: pictures});
            console.log("state", this.state.pictures);
        })
    }

    render() {
        return(
            <div className = "container2">
                <div className= "container1">
                    {this.state.pictures}
                </div>    
            </div>
        )
    }
}


ReactDOM.render(
    <Background />,
    document.getElementById('root')
);