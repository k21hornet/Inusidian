import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const Card = () => {
  const [card, setCard] = useState([])
  const [deckId, setDeckId] = useState()

  const [sentence, setSentence] = useState("")
  const [word, setWord] = useState("")
  const [pronounce, setPronounce] = useState("")
  const [meaning, setMeaning] = useState("")
  const [translate, setTranslate] = useState("")

  const { id } = useParams()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  // カードを取得
  const fetchCard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/card/${id}`, { withCredentials: true })
      if(res.status===200) {
        setDeckId(res.data.deckId)
        setCard(res.data)
        setSentence(res.data.sentence)
        setWord(res.data.word)
        setPronounce(res.data.pronounce)
        setMeaning(res.data.meaning)
        setTranslate(res.data.translate)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // カード情報編集
  const editCard = async (e) => {
    e.preventDefault()
    const card = {
      id,
      sentence,
      word,
      pronounce,
      meaning,
      translate
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/card/update`, 
        card,
        { withCredentials: true })
      if (res.status===200) {
        setSentence("")
        setWord("")
        setPronounce("")
        setMeaning("")
        setTranslate("")
        closeModal()
        fetchCard()
      }

    } catch (err) {
      console.log(err)
    }
  }

  const deleteCard = async() => {
    const check = window.confirm("Are you sure?")
    if (!check) return

    try {
      await axios.delete(`${import.meta.env.VITE_API}/card/delete/${id}`,{ withCredentials: true })
      navigate(`/deck/${deckId}`)
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
          <div><span className='fw-bold'>Card Details</span></div>
          <div>
            <button onClick={() => navigate(`/deck/${card.deckId}`)} className="custom-font-size btn custom-btn-blue text-white rounded-pill">Back</button>
            <button onClick={openModal} className="custom-font-size btn custom-btn-blue text-white rounded-pill">Edit</button>
          </div>
        </div>

        <div className="card-body d-flex flex-column align-items-center">
          <ul className="w-100 list-group list-group-flush fs-3 d-flex align-items-center">
            <li className="list-group-item">
              <div>{card?.sentence}</div>
            </li>
            <li className="list-group-item">
              <div>{card?.word}</div>
            </li>
            <li className="list-group-item">
              <div>{card?.pronounce}</div>
            </li>
            <li className="list-group-item">
              <div>{card?.meaning}</div>
            </li>
            <li className="list-group-item">
              <div>{card?.translate}</div>
            </li>
          </ul>
        </div>

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
                <h3 className='text-center'>Edit card</h3>

                <form onSubmit={editCard}>
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

                  <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">Save</button>

                  <button onClick={deleteCard} className="mb-3 btn btn-primary custom-btn-blue w-100">Delete this card</button>

                </form>

                <div className='text-end'>
                  <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Card
