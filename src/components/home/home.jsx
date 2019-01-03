import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../searchBar/searchBar.jsx';
import Results from '../results/results';

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steamGameData: {},
      gogGameData: {},
      similarTitlesSteam: [],
      similarTitlesGog: [],
      searched: false
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleTitleClick = this.handleTitleClick.bind(this)
  }

  async handleSearch(event, query) {
    this.setState({
      steamGameData: {},
      gogGameData: {},
      similarTitlesSteam: [],
      similarTitlesGog: [],
      searched: false
    })
    event.preventDefault()
    query.trim()
    const steamAppId = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/name/${query}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
    const gogData = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/goggame/${query}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )

    if (steamAppId.data.length > 1) {
      this.setState({ similarTitlesSteam: steamAppId.data })
    } else if (steamAppId.data.length === 1) {
      const steamGame = await axios.get(process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/appid/${steamAppId.data[0].appid}`)
      this.setState({
        steamGameData: this.formatSteamData(steamGame.data[steamAppId.data[0].appid].data)
      })
    }

    if (gogData.data.products.length > 1) {
      this.setState({
        similarTitlesGog: gogData.data.products.map(game => this.formatGogData(game))
      })
    } else if (gogData.data.products.length === 1) {
      this.setState({
        gogGameData: this.formatGogData(gogData.data.products[0])
      })
    }

    this.setState({
      searched: true
    })
  }

  formatSteamData(gameData) {
    const resultObj = {
      id: gameData.appid,
      price: gameData.isFree ? 'Free' : gameData.price_overview.final_formatted + '',
      name: gameData.name
    }
    return resultObj
  }

  formatGogData(gameData) {
    const resultObj = {
      id: gameData.id,
      price: gameData.price.isFree ? 'Free' : gameData.price.symbol + '' + gameData.price.final_amount,
      name: gameData.title
    }
    return resultObj
  }

  handleTitleClick(platform, game) {
    if (platform === 'steam') {
      this.setState({
        similarTitlesSteam: [],
        steamGameData: game
      })
    } else if (platform === 'gog') {
      this.setState({
        similarTitlesGog: [],
        gogGameData: game
      })
    }
  }

  render() {
    const SearchResults = (
      <div className='Results'>
        <Results platform="steam" handleTitleClick={this.handleTitleClick} gameData={this.state.similarTitlesSteam.length > 1 ? this.state.similarTitlesSteam : [this.state.steamGameData]} />
        <Results platform="gog" handleTitleClick={this.handleTitleClick} gameData={this.state.similarTitlesGog.length > 1 ? this.state.similarTitlesGog : [this.state.gogGameData]} />
      </div>
    )

    return (
      <div className="home">
        {/* <img src={`${process.env.REACT_APP_SERVER_URL}/money.jpg`} /> */}
        <SearchBar handleSearch={this.handleSearch} />
        {this.state.searched ? SearchResults : null}
      </div>
    );
  }
}
