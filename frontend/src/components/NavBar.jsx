import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <form className="containerNav">
        <Link to="/">
          <button className="buttonCalc" type="button">
            Calculate
          </button>
        </Link>
        <Link to="/history">
          <button className="buttonHist" type="button">
            History
          </button>
        </Link>
      </form>
    </nav>
  );
}

export default NavBar;
