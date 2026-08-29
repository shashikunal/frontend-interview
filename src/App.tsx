import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/home/Home'
import QuestionList from './components/questions/QuestionList'
import QuestionDetail from './components/questions/QuestionDetail'
import QuestionDetailPage from './components/questions/QuestionDetailPage'
import CodingList from './components/coding/CodingList'
import Workspace from './components/workspace/Workspace'
import Videos from './components/videos/Videos'
import Quiz from './components/quiz/Quiz'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/questions/:id/detail" element={<QuestionDetailPage />} />
          <Route path="/coding" element={<CodingList />} />
          <Route path="/coding/:id" element={<Workspace />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
