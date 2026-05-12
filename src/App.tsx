import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import LogList from './components/LogList'
import TraceFlagManager from './components/TraceFlagManager'
import TraceFlagSetup from './components/TraceFlagSetup'
import ActiveUsers from './components/ActiveUsers'
import ActiveClasses from './components/ActiveClasses'
import ActiveTriggers from './components/ActiveTriggers'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LogList />} />
          <Route path="/active-traces" element={<TraceFlagManager />} />
          <Route path="/setup-trace" element={<TraceFlagSetup />} />
          <Route path="/active-users" element={<ActiveUsers />} />
          <Route path="/active-classes" element={<ActiveClasses />} />
          <Route path="/active-triggers" element={<ActiveTriggers />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <div className="ticks"></div>
        <p>© 2026 Observability Engineering Team</p>
      </footer>
    </div>
  )
}

export default App
