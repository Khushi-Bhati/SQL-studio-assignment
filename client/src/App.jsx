import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assignment from './pages/Assignment'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assignment/:id" element={<Assignment />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
