import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'

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
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-200">
        <h1 className='text-3xl my-10'>Card Details</h1>

        <ul className="w-full divide-y divide-gray-100 flex flex-col items-center">
          <li className="flex text-xl justify-between py-2 text-center">
            <div>{card?.sentence}</div>
          </li>
          <li className="flex text-xl justify-between py-2 text-center">
            <div>{card?.word}</div>
          </li>
          <li className="flex text-xl justify-between py-2 text-center mb-30">
            <div>{card?.pronounce}</div>
          </li>
          <li className="flex text-xl justify-between py-2 text-center">
            <div>{card?.meaning}</div>
          </li>
          <li className="flex text-xl italic justify-between py-2 text-center">
            <div>{card?.translate}</div>
          </li>
        </ul>

        <div className='w-64 flex mt-5'>
          <button 
            onClick={() => navigate(`/deck/${card.deckId}`)}
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Back</button>
          <button 
            onClick={openModal} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Edit</button>
        </div>

      </div>
      

      {showModal && (
       <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-semibold text-center mb-4'>Edit card</h3>

            <form onSubmit={editCard} className='space-y-6'>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Sentence</label>
                <input
                  type="text"
                  name="sentence"
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Word</label>
                <input
                  type="text"
                  name="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Pronounce</label>
                <input
                  type="text"
                  name="pronounce"
                  value={pronounce}
                  onChange={(e) => setPronounce(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Meaning</label>
                <input
                  type="text"
                  name="meaning"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Translate</label>
                <input
                  type="text"
                  name="translate"
                  value={translate}
                  onChange={(e) => setTranslate(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <button 
                type="submit" 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

              <button 
                onClick={deleteCard} 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Delete this card</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

    </BaseTemplate>
  )
}

export default Card
