import React from 'react'
import ReactDOM from 'react-dom/client'
import '../src/assets/style/main.css'
import { Provider } from 'react-redux'
import { App } from './root-cmp.jsx'
import { store } from './store/store'
const elContainer = document.getElementById('root')
const root = ReactDOM.createRoot(elContainer);
root.render (<Provider store={store}>
<App />
</Provider>);
