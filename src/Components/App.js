import React, { Component } from 'react';
import Adapter from '../Adapter';
import TVShowList from './TVShowList';
import Nav from './Nav';
import SelectedShowContainer from './SelectedShowContainer';
import { Grid } from 'semantic-ui-react';



class App extends Component {
  state = {
    shows: [],
    searchTerm: "",
    selectedShow: "",
    episodes: [],
    filterByRating: "",
    page: 1
  }

  componentDidMount () {
    //Modified
    window.addEventListener('scroll', this.infiniteScroll)
    Adapter.getShows(this.state.page).then(shows => this.setState({shows}))
  }
  
  //function created to do new fetch after page reaches the bottom
  infiniteScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.getElementById('root').offsetHeight) {
      let newPage = this.state.page
      newPage++
      this.setState({
        page: newPage
      })
      this.fetchMoreMovies(newPage)
    }
  }
  
  fetchMoreMovies = (pageNum) => {
    Adapter.getShows(pageNum).then(shows => this.setState({shows: [...this.state.shows,...shows]}))
  }

  componentDidUpdate = (prevProps,prevState) => {
    //Modified
    if (this.state.selectedShow !== prevState.selectedShow) {
      window.scrollTo(0, 0)
    }
  }

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value.toLowerCase() })
  }

  handleFilter = (e) => {
    e.target.value === "No Filter" ? this.setState({ filterByRating:"" }) : this.setState({ filterByRating: e.target.value})
  }

  selectShow = (show) => {
    Adapter.getShowEpisodes(show.id)
    .then(episodes => this.setState({
      selectedShow: show,
      episodes
    }))
  }

  displayShows = () => {
    if (this.state.filterByRating){
      return this.state.shows.filter((s)=> {
        return s.rating.average >= this.state.filterByRating
      })
    } else {
      return this.state.shows
    }
  }

  render (){
    return (
      <div>
        <Nav handleFilter={this.handleFilter} handleSearch={this.handleSearch} searchTerm={this.state.searchTerm}/>
        <Grid celled>
          <Grid.Column width={5}>
            {!!this.state.selectedShow ? <SelectedShowContainer selectedShow={this.state.selectedShow} allEpisodes={this.state.episodes}/> : <div/>}
          </Grid.Column>
          <Grid.Column width={11}>
            <TVShowList shows={this.displayShows()} selectShow={this.selectShow} searchTerm={this.state.searchTerm}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
