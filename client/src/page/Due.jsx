import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Due = () => {
  const [dueCard, setDueCard] = useState()

  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(true)
  const closeModal = () => setShowModal(false)

  // 今日の単語リストを取得し、ランダムで一問出題する
  const fetchDue = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/review/due/${id}`, { withCredentials: true })

      if (res.data.length > 0) {
        const randomNum = Math.floor(Math.random() * res.data.length)
        setDueCard(res.data[randomNum])
      } else {
        setDueCard(null)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 問題正解時
  const success = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/success`, null, {withCredentials: true})
      await fetchDue()
    } catch (e) {
      console.log(e)      
    }
  }

  // 問題不正解時
  const failure = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/failure`, null, {withCredentials: true})
      await fetchDue()
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
          <div><span className='fw-bold'>Study now</span></div>
        </div>

        <div className='w-100 h-100 d-flex flex-column align-items-center fs-4'>
          {dueCard? (
            <>
              <p>{dueCard?.card?.sentence}</p>
              <p>{dueCard?.card?.word}</p>
              <hr />
              <p>{dueCard?.card?.pronounce}</p>
              <p>{dueCard?.card?.meaning}</p>
              <p>{dueCard?.card?.translate}</p>

              <div className='d-flex'>
                <button onClick={failure} className="m-3 btn btn-primary custom-btn-blue w-100">Hard</button>
                <button onClick={success} className="m-3 btn btn-primary custom-btn-blue w-100">Easy</button>
              </div>
            </>
          ) : (
            <div className='text-center'>
              <h2 className='fw-bold text-success'>Congratulations!</h2>
              <p>You have finished this deck for now.</p>
              <Link to={`/deck/${id}`}>Back to deck</Link>
            </div>
          )}
        </div>
      </div>

      {showModal && dueCard && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
          >
            <div className="modal-content">
              <div className="modal-body">
                <h3 className='text-center'>Are you ready?</h3>
                <br />
                <div>
                  <button onClick={() => navigate("/")} type="submit" className="mb-3 btn btn-primary custom-btn-blue w-50">Back</button>
                  <button onClick={closeModal} type="submit" className="mb-3 btn btn-primary custom-btn-blue w-50">Start</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Due
