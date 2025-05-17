import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Header from '../components/Header'

const Home = () => {
  const { user } = useUser()
  const [decks, setDecks] = useState([])
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const navigate = useNavigate()


  // デッキ一覧を取得
  const fetchDecks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/deck/decks/${user.id}`, { withCredentials: true })
      if(res.status===200) {
        setDecks(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }


  // 新規デッキ作成
  const createDeck = async (e) => {
    e.preventDefault()
    const deck = {
      userId: user.id,
      deckName,
      deckDescription
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/deck/create`, 
        deck,
        { withCredentials: true })
      if (res.status===200) {
        fetchDecks()
        setDeckName("")
        setDeckDescription("")
        closeModal()
      }

    } catch (err) {
      console.log(err)
    }
  }

  const navigateToDeck = (id) => {
    navigate(`/deck/${id}`)
  }


  useEffect(() => {
    fetchDecks()
  }, [])


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
          <div>デッキ一覧</div>
          <div>
            <button className="custom-font-size btn custom-btn-blue text-white rounded-pill">デッキ編集</button>
            <button onClick={openModal} className="custom-font-size btn custom-btn-blue text-white rounded-pill">デッキ追加</button>
          </div>
        </div>

        <div className="card-body d-flex flex-column align-items-center">
        <ul className="w-100 list-group list-group-flush">
        {decks.map((deck) => (
          <li 
            className="list-group-item d-flex justify-content-between"
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigateToDeck(deck.id)}
          >
            <div>
              <div>{deck?.deckName}</div>
              <div>{deck?.deckDescription}</div>
            </div>
            <div>
              100単語
            </div>
          </li>
        ))}
        </ul>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={closeModal}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // モーダル本体のクリックは無視
          >
            <div className="modal-content">
              <div className="modal-body">
                <h3 className='text-center'>デッキ新規作成</h3>

                <form onSubmit={createDeck}>
                  <div className="mb-3">
                    <label className="form-label small">デッキ名</label>
                    <input
                      type="text"
                      name="deckName"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">説明文</label>
                    <textarea
                      type="text"
                      name="deckDescription"
                      value={deckDescription}
                      onChange={(e) => setDeckDescription(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>

                  <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">保存する</button>

                </form>

                <div className='text-end'>
                  <span onClick={closeModal} style={{color: '#615fff'}}>閉じる</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    
    </div>
  )
}

export default Home
