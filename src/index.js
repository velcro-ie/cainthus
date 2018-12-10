import React from 'react';
import ReactDOM from 'react-dom';
import ScrollUpButton from "react-scroll-up-button";
import Masonry from 'react-masonry-css'
import './reset.css';
import './index.css';

// import images
import camera from './camera.png';
import clock from './clock.png';
import logo from './cainthus.png';

var api_key = "5eca61dad6d092dd2772b646e9103b62"

class PhotoCard extends React.Component{
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

class Photos extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pictures: [],
            nextPage: 1,
            error: false,
            noMore:false,
            isLoading:false,
        };

        window.onscroll = () =>{    
            if (this.state.error || this.state.isLoading || this.state.noMore) return;
            if (
                window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight
            ) {
                this.getPictures();
            }
        };
    }

    // componentDidMount() {
    //     if (this.props.search !== "") {
    //         this.getPictures()
    //     }
    // }
    
    componentWillReceiveProps(nextProps){
        if (this.props.search !== nextProps.search){
            this.setState({
                pictures: [],
                nextPage: 1,
                error: false,
                noMore:false,
                isLoading:false,},() =>this.getPictures());
        }
    }

    getPictures(){
        this.setState({ isLoading: true })
        var urlString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + api_key;
        urlString += '&tags=' + this.props.search + '&page=' + this.state.nextPage;
        urlString += '&per_page=20&format=json&nojsoncallback=1';
        fetch(urlString)
        .then(results => {
            return results.json();
        })
        .then(data => {
            var photoArray = data.photos.photo;
            let pictures = photoArray.map((pic) => {
                return <PhotoCard key={this.state.nextPage + "-" + pic.id} id = {pic.id} secret={pic.secret}/>
            })
            this.setState({pictures: this.state.pictures.concat(pictures)});
            var nextPageNo = this.state.nextPage + 1;
            this.setState({nextPage:nextPageNo});
            if (nextPageNo > data.photos.pages){
                this.setState({noMore:true});
            }
        })
        .catch((err) => {
            this.setState({
                error: err.message,
                isLoading: false,
            });
        })
        this.setState({ isLoading: false })
    }

    render() {
        return(
            <div className="photoResults">
                <Masonry breakpointCols={4}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column">                    
                    {this.state.pictures}
                </Masonry>

                {this.state.error &&
                    <div style={{ color: '#900' }} className="errMsg">
                        {this.state.error}
                    </div>
                }
                {this.state.isLoading &&
                    <div className="errMsg">Loading...</div>
                }
                {this.state.noMore &&
                    <div className="errMsg">There are no more images for this search!</div>
                }
            </div>
        );
    }
}

class SearchBar extends React.Component{
    constructor(){
        super();
        this.state = {
            search: "",
        };
        this.handleInputChange = this.handleInputChangeUnbound.bind(this);
        this.handleInputSubmit = this.handleInputSubmitUnbound.bind(this);
    }
    
    handleInputChangeUnbound(event){
        this.setState({search:event.target.value}, () =>{
            this.props.onChange(this.state.search);
        })
    }

    handleInputSubmitUnbound(event){
        this.setState({search:this._search.value}, () =>{
            this.props.onChange(this.state.search);
        })
        event.preventDefault()
    }

    render() {
        return(
            <div className= "search">
                <img src={logo} alt="Cainthus Logo" />
                <form onSubmit={this.handleInputSubmit}>
                    <label>Search: </label>
                    <input placeholder="search..."
                        type="text"
                        name="search"
                        ref = {input => this._search = input}
                    />
                </form>
            </div> 
        );
    }
}

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            searchString: "",
        };
        this.handleSubmit = this.handleSubmitUnbound.bind(this);
    }
    
    handleSubmitUnbound(txt){
        this.setState({searchString:txt});
    }

    render() {
        return(
            <div className = "">
                <SearchBar  onChange={this.handleSubmit} />
                <Photos search={this.state.searchString} />
                <ScrollUpButton />
            </div>
        );
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);