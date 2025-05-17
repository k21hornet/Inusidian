import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

const Deck = () => {
  const [deck, setDeck] = useState([])

  const { id } = useParams()

  // デッキを取得
  const fetchDeck = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/deck/${id}`, { withCredentials: true })
      if(res.status===200) {
        setDeck(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchDeck()
  },[])

  return (
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
          <div><span className='fw-bold'>{deck?.deckDTO.deckName}</span></div>
          <div>
            <button className="custom-font-size btn custom-btn-blue text-white rounded-pill">属性編集</button>
            <button className="custom-font-size btn custom-btn-blue text-white rounded-pill">カード追加</button>
          </div>
        </div>

        <div className="card-body d-flex flex-column align-items-center">
          <ul className="w-100 list-group list-group-flush">
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Deck
