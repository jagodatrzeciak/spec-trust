import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkMode } from "../redux/modeSlice";

export default function Navbar({isDarkMode}) {
    const dispatch = useDispatch();

    useEffect(() => {
        document.body.classList.toggle("bg-light-chocolate", isDarkMode);
        document.body.classList.toggle("text-light", isDarkMode);
    }, [isDarkMode]);

    return (
        <nav className={`navbar ${isDarkMode ? "navbar-dark bg-chocolate" : "navbar-light bg-light"} d-flex justify-content-between px-3`}>
            <a className="navbar-brand d-flex align-items-center">
                <img src="/spectrometer.png" width="30" height="30"
                     className="d-inline-block align-top me-2 ms-2" alt=""/>
                SpecTrust
            </a>
            <button
                className="btn btn-outline-secondary"
                onClick={() => dispatch(setIsDarkMode({ isDarkMode: !isDarkMode }))}
            >
                {isDarkMode ?
                    <i className="bi bi-moon-fill"></i> :
                    <i className="bi bi-sun-fill"></i>
                }
            </button>
        </nav>
    );
}
