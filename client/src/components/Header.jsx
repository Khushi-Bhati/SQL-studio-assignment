import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <svg 
            className="header__icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M4 7h16M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l4-4h8l4 4" />
            <path d="M8 11h8M8 15h4" />
          </svg>
          Cipher<span>SQL</span>Studio
        </Link>
        
        <nav className="header__nav">
          <Link to="/" className="header__link">
            Assignments
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
