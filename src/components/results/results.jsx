import React, { Component } from 'react';
import './results.css'

const Results = (props) => {
  //if there are multiple games
  if (props.gameData.length > 1) {
    return (
      <div className='resultsWrapper'>
        <div className='resultsBox'>
          <div className='platformHeader'>
            {props.platform}
          </div>
          <div className='gameList'>
            {props.gameData.map(game => (
              <div key={game.id} className='gameInfo list' onClick={() => props.handleTitleClick(props.platform, game)}>
                {game.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  //if there is only one game
  else if (props.gameData[0].name || props.gameData[0].title) {
    return (
      <div className='resultsWrapper'>
        <div className='resultsBox singleGame'>
          <div className='platformHeader'>
            {props.platform}
          </div>
          <div className='gameList'>
            {props.gameData.map(game => (
              <div key={game.id} className='gameInfo'>
                <div>
                  {game.name}
                </div>
                <div>
                  {game.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  //if the game is not found
  else {
    return (
      <div className='resultsWrapper'>
        <div className='resultsBox'>
          {`unable to find game on ${props.platform}`}
        </div>
      </div>
    )
  }
}

export default Results