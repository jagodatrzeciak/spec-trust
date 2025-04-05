import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Navbar() {
    const dispatch = useDispatch();

    return (
        <nav className={"navbar navbar-light bg-light d-flex justify-content-between px-3"}>
            <a className="navbar-brand d-flex align-items-center">
                <img src="/spectrometer.png" width="30" height="30"
                     className="d-inline-block align-top me-2 ms-2" alt=""/>
                SpecTrust
            </a>
        </nav>
    );
}
