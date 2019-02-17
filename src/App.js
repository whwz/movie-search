import React, { Component } from 'react';
import './App.css';

const db = [];
class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      movies: db,
      filteredMovies: db,
      isClicked: false
    }
  }
  
  componentDidMount() {
    let page = 1;

    while(page < 36){
      fetch("https://api.themoviedb.org/3/movie/top_rated?page=" + page + "&language=en-US&api_key=9d59af51a07ce660e8606073f1dfe0ec")
      .then(res => res.json())
      .then(json => {
        for(let i = 0; i < json["results"].length; i++)
          if(json.results[i].vote_count > 2000)
            db.push(json.results[i])
        });

      page++;
    }

    setTimeout(()=>{this.setState({movies: db})}, 3000);
  }

  filterMovies = (e) => {
    const text = e.currentTarget.value;
    const filteredMovies = this.getFilteredMovies(text);
    this.setState({
      filteredMovies
    });
  }

  getFilteredMovies(text) {
    return this.state.movies.filter( movie => 
      movie.title.toLowerCase().includes(text.toLowerCase()))
  }

  handleClick = () => {
    this.setState({isClicked: true});
    console.log("click");
  }

  render() {
    return (
      <div className="App">
        <input onInput={this.filterMovies} placeholder="Search..." />
        {!this.state.isClicked ? <MoviesList filteredMovies={this.state.filteredMovies} movies={this.state.movies} click={this.handleClick} /> : <p>info</p>}
      </div>
    );
  }
}

const MoviesList = ({filteredMovies, movies, click}) => {
  const link = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
  return (
    movies.length ?
      filteredMovies.length ?
        <div className="cards">
          {filteredMovies.map(movie => 
            <div className="item" key={movie.title}>
              <img src={link + movie.poster_path} alt="" onClick={click} />
              <p>{movie.title}</p>
            </div> 
          )}
        </div>
        :
        <p className="no_results">No results</p>
      :
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  )
}

export default App;
