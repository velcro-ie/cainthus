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
// import $ from 'jquery';

class Background extends React.Component{
    constructor(){
        super();
        this.state = {
            tags: ["buildings"],
            pictures: [],
        };
    }
    componentDidMount() {
        var urlString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5eca61dad6d092dd2772b646e9103b62&tags=buildings&page=2&per_page=10&format=json&nojsoncallback=1';
        // var urlString = 'https://randomuser.me/api/?results=5';
        // $.ajax({
		// 	url: {urlString},
		// 	dataType: "json",
		// 	type: "GET",
		// 	data: { hcSetID: run },
		// 	success: function (d) {
		// 		console.log(d);
		// 	}.bind(this)
		// });
        fetch(urlString)
        .then(results => {
            return results.json();
        })
        .then(data => {
            var photoArray = data.photos.photo;
            let pictures = photoArray.map((pic) => {
            // let pictures = data.results.map((pic) => {
                console.log(pic);
                var farmID = pic.farm;
                var serverID = pic.server;
                var secret = pic.secret;
                var id = pic.id;
                var picUrl = 'https://farm' + farmID + '.staticflickr.com/' + serverID + '/' + id + '_' + secret + '.jpg';
                console.log(picUrl);
                return(
                    <div key = {pic.results}>                        
                        <img key={id} src={picUrl} alt={pic.title}/>
                        <h1>{pic.title}</h1>
                        <p>{pic.title}</p>
                        <p>{pic.title}</p>
                        <p>{pic.title}</p>
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