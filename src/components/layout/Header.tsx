import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = term.trim()
    navigate(q ? `/questions?q=${encodeURIComponent(q)}` : '/questions')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">Interview<span className="logo-accent">Prep</span></span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <form className="header-search" onSubmit={onSearch} role="search">
            <input
              type="search"
              className="header-search-input"
              placeholder="Search questions…"
              value={term}
              onChange={e => setTerm(e.target.value)}
              aria-label="Search all questions"
            />
          </form>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/questions" className={`nav-link ${isActive('/questions') ? 'active' : ''}`}>
            Questions
          </Link>
          <Link to="/coding" className={`nav-link ${isActive('/coding') ? 'active' : ''}`}>
            Coding
          </Link>
          <Link to="/videos" className={`nav-link ${isActive('/videos') ? 'active' : ''}`}>
            Videos
          </Link>
          <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>
            Practice
          </Link>
        </nav>
      </div>
    </header>
  )
}
