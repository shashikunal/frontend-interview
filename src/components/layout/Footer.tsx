import { useQuestions } from '../../data/useQuestions'
import './Footer.css'

export default function Footer() {
  const { questions } = useQuestions()
  const totalCount = questions.length || 10550

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">
          <span className="footer-mark" aria-hidden="true" />
          InterviewPrep
        </span>
        <span className="footer-note">
          {totalCount.toLocaleString()} questions &bull; JavaScript &amp; ES6 &bull; React &bull; TypeScript &bull; CSS &bull; Performance
        </span>
      </div>
    </footer>
  )
}

