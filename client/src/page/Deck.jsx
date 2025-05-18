import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigate, useParams } from 'react-router-dom'

const Deck = () => {
  const [deck, setDeck] = useState()
  const [cards, setCards] = useState([])
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")

  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const [showModal2, setShowModal2] = useState(false)
  const openModal2 = () => setShowModal2(true)
  const closeModal2 = () => setShowModal2(false)

  const { id } = useParams()
  const navigate = useNavigate()

  // デッキとカードを取得
  const fetchDeck = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/deck/${id}`, { withCredentials: true })
      if(res.status===200) {
        setDeck(res.data)
        setDeckName(res.data.deckName)
        setDeckDescription(res.data.deckDescription)
        setCards(res.data.cards)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // デッキ情報編集
  const editDeck = async (e) => {
    e.preventDefault()
    const deck = {
      id,
      deckName,
      deckDescription
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/deck/update`, 
        deck,
        { withCredentials: true })
      if (res.status===200) {
        setDeckName("")
        setDeckDescription("")
        closeModal2()
        fetchDeck()
      }

    } catch (err) {
      console.log(err)
    }
  }

  const deleteDeck = async() => {
    const check = window.confirm("Are you sure?")
    if (!check) return

    try {
      await axios.delete(`${import.meta.env.VITE_API}/deck/delete/${id}`,{ withCredentials: true })
      navigate("/")
    } catch (e) {
      console.log(e)
    }
  }

  // 新規カード作成
  const [sentence, setSentence] = useState("")
  const [word, setWord] = useState("")
  const [pronounce, setPronounce] = useState("")
  const [meaning, setMeaning] = useState("")
  const [translate, setTranslate] = useState("")

  const createCard = async (e) => {
    e.preventDefault()

    const card = {
      deckId: id,
      sentence,
      word,
      pronounce,
      meaning,
      translate
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/card/create`, 
        card,
        { withCredentials: true })
      if (res.status===200) {
        setSentence("")
        setWord("")
        setPronounce("")
        setMeaning("")
        setTranslate("")
        closeModal()
        fetchDeck()
      }

    } catch (err) {
      console.log(err)
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
          <div><span className='fw-bold'>{deck?.deckName}</span></div>
          <div>
            <button onClick={openModal2} className="custom-font-size btn custom-btn-blue text-white rounded-pill">デッキ編集</button>
            <button onClick={openModal} className="custom-font-size btn custom-btn-blue text-white rounded-pill">カード追加</button>
          </div>
        </div>

        <div className="card-body d-flex flex-column align-items-center">
          <ul className="w-100 list-group list-group-flush">
            <li className="list-group-item row d-flex">
              <div className='col-8 fw-bold'>Sentence</div>
              <div className='col-4 fw-bold'>Word</div>
            </li>

            {cards.map((card) => (
              <li
                className="list-group-item row d-flex"
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/card/${card.id}`)}
              >
                <div className='col-8'>{card?.sentence}</div>
                <div className='col-4'>{card?.word}</div>
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
                <h3 className='text-center'>Create new card</h3>

                <form onSubmit={createCard}>
                  <div className="mb-3">
                    <label className="form-label small">Sentence</label>
                    <input
                      type="text"
                      name="sentence"
                      value={sentence}
                      onChange={(e) => setSentence(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">Word</label>
                    <input
                      type="text"
                      name="word"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">Pronounce</label>
                    <input
                      type="text"
                      name="pronounce"
                      value={pronounce}
                      onChange={(e) => setPronounce(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">Meaning</label>
                    <input
                      type="text"
                      name="meaning"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">Translate</label>
                    <input
                      type="text"
                      name="translate"
                      value={translate}
                      onChange={(e) => setTranslate(e.target.value)}
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

      {showModal2 && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={closeModal2}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // モーダル本体のクリックは無視
          >
            <div className="modal-content">
              <div className="modal-body">
                <h3 className='text-center'>Edit Deck</h3>

                <form onSubmit={editDeck}>
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

                  <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">Save</button>

                  <button onClick={deleteDeck} className="mb-3 btn btn-primary custom-btn-blue w-100">Delete this deck</button>

                </form>

                <div className='text-end'>
                  <span onClick={closeModal2} style={{color: '#615fff'}}>閉じる</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Deck
