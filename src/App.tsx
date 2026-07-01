import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import TournamentHeader from "./components/TournamentHeader"
import TournamentTabs from "./components/TournamentTabs"
import ChatPage from "./pages/ChatPage"
import "./App.css"

function TournamentPage() {
  return (
    <div className="min-h-screen bg-[#080a12] text-white">
      {/* Top Navbar */}
      <Header />

      {/* Main Tournament layout */}
      <main className="mx-auto max-w-7xl pb-16">
        {/* Upper section */}
        <TournamentHeader />

        {/* Lower section with tabs */}
        <TournamentTabs />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TournamentPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
