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
import './reset.css';
import './index.css';
// import images
// import picon from './picon.jpg';
import camera from './camera.png';
import clock from './clock.png';
// import $ from 'jquery';

var api_key = "5eca61dad6d092dd2772b646e9103b62"

class Photo extends React.Component{
    constructor(){
        super();
        this.state = {
            tags: [],
            title: "",
            owner: "",
            date: "",
            buildUrl: "",
            linkUrl: ""
        };
    }
    
    componentDidMount() {
        var picUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' 
        picUrl += api_key 
        picUrl += '&photo_id='+ this.props.id 
        picUrl += '&secret='+ this.props.secret + '&format=json&nojsoncallback=1'
        
        fetch(picUrl)
        .then(results => {
            return results.json();
        })
        .then(data => {
            var tagData = data.photo.tags.tag
            let tags = tagData.map((tag) => {
                return tag.raw
            })

        // in order to display the photos you need to build the url. The one returned by 
        // the query only works directly in the browser and not through this site. 
            var buildUrl = 'https://farm' + data.photo.farm
            buildUrl +=  '.staticflickr.com/' + data.photo.server + '/' 
            buildUrl +=  this.props.id + '_' + this.props.secret + '.jpg'
        
            var date = new Date(data.photo.dates.taken);
            date = date.toLocaleDateString();

            this.setState({tags: tags,
                title:data.photo.title._content,
                owner:data.photo.owner.realname,
                date:date,
                photoUrl:buildUrl,
                linkUrl:data.photo.urls.url[0]._content});
        })
    }
    render(){
        return(
            <div className="photoCard">   
                <span className="owner">
                    <img src={camera} alt="picon"/>
                    {this.state.owner}
                </span>
                <a href={this.state.linkUrl}><img key={this.props.id} src={this.state.photoUrl} alt={this.state.title}/></a>
                <span className="details">
                    <h1>{this.state.title}</h1>
                    <p className="clock"><img src={clock} alt="picon"/>{this.state.date}</p>
                    <p className="tags">{this.state.tags.join(", ")}</p>
                </span>
            </div>
        )
    }
}

class Background extends React.Component{
    constructor(){
        super();
        this.state = {
            tags: ["buildings"],
            pictures: [],
        };
    }
    componentDidMount() {
        var urlString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + api_key + '&tags=buildings&page=2&per_page=10&format=json&nojsoncallback=1';
        fetch(urlString)
        .then(results => {
            return results.json();
        })
        .then(data => {
            var photoArray = data.photos.photo;
            let pictures = photoArray.map((pic) => {
                return <Photo key={pic.id} id = {pic.id} secret={pic.secret}/>
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
        );
    }
}


ReactDOM.render(
    <Background />,
    document.getElementById('root')
);