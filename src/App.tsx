import { useState, useEffect } from "react"



import {



  BrowserRouter,



  Routes,



  Route,



  useNavigate,



  useLocation,



} from "react-router-dom"



import Header from "./components/Header"



import TournamentHeader from "./components/TournamentHeader"



import TournamentTabs from "./components/TournamentTabs"



import FloatingChatWidget from "./components/FloatingChatWidget"



import ChatPage from "./pages/ChatPage"



import { useIsDesktop } from "./hooks/useIsDesktop"



import "./App.css"







function TournamentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useIsDesktop()
  const [chatOpen, setChatOpen] = useState(false)
  const [popupChannelId, setPopupChannelId] = useState<string | undefined>()







  // Full chat page minimize → open Messenger popup (desktop only)



  useEffect(() => {



    const state = location.state as {



      openChatPopup?: boolean



      activeChannelId?: string



    } | null



    if (!state?.openChatPopup) return







    if (isDesktop) {



      setPopupChannelId(state.activeChannelId)



      setChatOpen(true)



    }



    navigate(".", { replace: true, state: {} })



  }, [location.state, isDesktop, navigate])







  return (



    <div className="min-h-[100dvh] bg-[#080a12] text-white pt-16 pb-16 md:pb-0">



      <Header />







      <main className={`mx-auto max-w-7xl pb-16 transition-all ${isDesktop && chatOpen ? 'pr-[420px]' : ''}`}>



        <TournamentHeader onOpenChatDrawer={() => navigate("/chat")} />



        <TournamentTabs />



      </main>







      {/* Docked panel (after minimize from full chat, or FAB) */}

      <FloatingChatWidget

        open={chatOpen}

        onOpenChange={(open) => {

          setChatOpen(open)

          if (!open) setPopupChannelId(undefined)

        }}

        initialChannelId={popupChannelId}

      />



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



