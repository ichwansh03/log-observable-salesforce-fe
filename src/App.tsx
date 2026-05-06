import './App.css'
import LogList from './components/LogList'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Salesforce Observability</h1>
      </header>
      <main>
        <LogList />
      </main>
      <footer className="app-footer">
        <div className="ticks"></div>
        <p>© 2026 Observability Engineering Team</p>
      </footer>
    </div>
  )
}

export default App
