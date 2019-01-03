import React, { Component } from 'react';
import './results.css'

const Results = (props) => {
  //if there are multiple games
  if (props.gameData.length > 1) {
    return (
      <div className='resultsWrapper'>
        <div className='platformHeader'>
          {props.platform}
        </div>
        <div className='gameList'>
          {props.gameData.map(game => (
            <div key={game.id} onClick={() => props.handleTitleClick(props.platform, game)}>
              {game.name}
            </div>
          ))}
        </div>
      </div>
    )
  }
  //if there is only one game
  else if (props.gameData[0].name || props.gameData[0].title) {
    return (
      <div className='results'>
        {props.gameData[0].name}
        {props.gameData[0].price}
      </div>
    )
  }
  //if the game is not found
  else {
    return (
      <div className='results'>
        {`unable to find game on ${props.platform}`}
      </div>
    )
  }
}

export default Results