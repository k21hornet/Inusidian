import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const Card = () => {
  const [card, setCard] = useState([])

  const { id } = useParams()
  const navigate = useNavigate()

  // カードを取得
  const fetchCard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/card/${id}`, { withCredentials: true })
      if(res.status===200) {
        setCard(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCard()
  }, [])

  return (
    <div>
      <div className='bg-light min-vh-100 w-100 d-flex flex-column align-items-center overflow-hidden'>
      <Header />

      <div
        className="card m-4 shadow-lg rounded-4 w-100"
        style={{
          maxWidth: '1000px',
          height: '86vh',
          overflowY: 'auto',
        }}
      >

        <div className="card-header d-flex justify-content-between align-items-center">
          <div><span className='fw-bold'>カード詳細</span></div>
          <div>
            <button onClick={() => navigate(`/deck/${card.deckId}`)} className="custom-font-size btn custom-btn-blue text-white rounded-pill">戻る</button>
            <button className="custom-font-size btn custom-btn-blue text-white rounded-pill">編集</button>
          </div>
        </div>

        <div className="card-body d-flex flex-column align-items-center">
          <ul className="w-100 list-group list-group-flush">
            <li className="list-group-item row d-flex fs-3">{card?.sentence}</li>
            <li className="list-group-item row d-flex fs-3">{card?.word}</li>
            <li className="list-group-item row d-flex fs-3">{card?.pronounce}</li>
            <li className="list-group-item row d-flex fs-3">{card?.meaning}</li>
            <li className="list-group-item row d-flex fs-3">{card?.translate}</li>
          </ul>
        </div>

      </div>
      
      </div>
    </div>
  )
}

export default Card
