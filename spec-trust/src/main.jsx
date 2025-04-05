import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import { store } from "./redux/store";

window.pyodideReady = window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
});

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
