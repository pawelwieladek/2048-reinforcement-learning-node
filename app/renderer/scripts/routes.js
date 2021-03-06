import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import AppPage from './pages/app-page';

import IndexPage from './pages/index-page.js';

import SearchIndexPage from './pages/search/index-page.js';
import CreateSearchPlayerPage from './pages/search/create-player-page.js';
import PlaySearchGamePage from './pages/search/play-game-page.js';
import SearchWinningRatePage from './pages/search/winning-rate-page.js';

import LearnIndexPage from './pages/learn/index-page.js';
import CreateLearnPlayer from './pages/learn/create-player-page.js';
import LearnSettingsPage from './pages/learn/settings-page.js';
import LearnResultsPage from './pages/learn/results-page.js';
import PlayLearnGamePage from './pages/learn/play-game-page.js';

let routes = (
    <Route handler={AppPage}>
        <DefaultRoute handler={IndexPage}/>
        <Route path='search' handler={SearchIndexPage}>
            <DefaultRoute handler={CreateSearchPlayerPage}/>
            <Route path='create' handler={CreateSearchPlayerPage}/>
            <Route path='play' handler={PlaySearchGamePage}/>
            <Route name='search-winning-rate' path='winning-rate' handler={SearchWinningRatePage}/>
        </Route>
        <Route path='learn' handler={LearnIndexPage}>
            <DefaultRoute handler={CreateLearnPlayer}/>
            <Route name="learn-create" path='create' handler={CreateLearnPlayer}/>
            <Route name="learn-settings" path=':learningRate/settings' handler={LearnSettingsPage}/>
            <Route name="learn-results" path=':learningRate/results' handler={LearnResultsPage}/>
            <Route name="learn-play" path=':learningRate/play' handler={PlayLearnGamePage}/>
        </Route>
    </Route>
);

export default routes;