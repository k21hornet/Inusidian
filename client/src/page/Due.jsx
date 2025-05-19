import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Due = () => {
  const [dueCards, setDueCards] = useState([])
  const [dueCard, setDueCard] = useState()
  const [index, setIndex] = useState()

  const { id } = useParams()

  // 今日の単語リストを取得
  const fetchDue = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/review/due/${id}`, { withCredentials: true })
      setDueCards(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  // 問題をランダムに選択
  const pickupCard = () => {
    if(dueCards.length == 0) return

    const randomNum = Math.floor(Math.random() * dueCards.length)
    const item = dueCards[randomNum]
    
    setIndex(randomNum)
    setDueCard(item.card)
  }

  // 問題正解時
  const success = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/success`, null, {withCredentials: true})
      setDueCards(dueCards.splice(index,1))
      setDueCard(null)
      pickupCard()
    } catch (e) {
      console.log(e)      
    }
  }

  // 問題不正解時
  const failure = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/failure`, null, {withCredentials: true})
    } catch (e) {
      console.log(e)      
    }
  }

  useEffect(() => {
    fetchDue()
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
          <div onClick={pickupCard}><span className='fw-bold'>Study now</span></div>
        </div>

        <div className='w-100 h-100 d-flex flex-column align-items-center fs-4'>
          <p>{dueCard?.sentence}</p>
          <p>{dueCard?.word}</p>
          <hr />
          <p>{dueCard?.pronounce}</p>
          <p>{dueCard?.meaning}</p>
          <p>{dueCard?.translate}</p>

          <div className='d-flex'>
            <button onClick={failure} className="m-3 btn btn-primary custom-btn-blue w-100">Hard</button>
            <button onClick={success} className="m-3 btn btn-primary custom-btn-blue w-100">Easy</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Due
