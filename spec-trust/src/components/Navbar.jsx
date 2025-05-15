import {useDispatch} from "react-redux";
import {setIsShowingModal} from "../redux/csvSlice.js";

export default function Navbar({isShowingModal}) {
    const dispatch = useDispatch()
    const handleOpenModal = () => dispatch(setIsShowingModal(true))

    return (
        <nav className="navbar navbar-light bg-light d-flex justify-content-between px-3">
            <a className="navbar-brand d-flex align-items-center">
                <img src="/spectrometer.png" width="30" height="30"
                     className="d-inline-block align-top me-2 ms-2" alt=""/>
                uCalc-SSB
            </a>

            <button className="btn btn-outline-secondary pulse" onClick={handleOpenModal}>
                README
            </button>
        </nav>
    );
}

