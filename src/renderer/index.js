import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './index.css';

setTimeout(() => {
    ipcRenderer.send('cmd', Date.now());
}, 3000);

const render = () => {
    const App = require('./App').default;
    
    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>, 
        document.getElementById('App')
    );
};

render();

if (process.env.NODE_ENV !== 'production' && module.hot) {

    module.hot.accept(render);
}
