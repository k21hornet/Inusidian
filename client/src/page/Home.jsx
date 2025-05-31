import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import BaseTemplate from '../components/templates/BaseTemplate'

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
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-5xl">
        <h1 className='text-4xl my-10'>Welcome Back!</h1>

        <ul 
          className="w-full divide-y divide-gray-100 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
        {decks.map((deck) => (
          <li className="flex justify-between py-2" key={deck.id}>
            <div onClick={() => navigateToDeck(deck.id)} className='flex items-center'>
              <div
                className="d-flex justify-content-center align-items-center rounded-full text-white"
                style={{width: '40px', height: '40px', marginRight: '16px' , backgroundColor: '#aaa'}}
              >
              </div>

              <div>
                <div className='text-xl'>{deck?.deckName}</div>
                <div className="italic">{deck?.deckDescription}</div>
              </div>
            </div>

            <div className='flex items-center'>
              <button 
                onClick={() => navigate(`deck/${deck?.id}/review`)} 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Review</button>
            </div>
          </li>
        ))}
        </ul>

        <div className='w-64 flex flex-col items-center mt-5'>
          <button 
            onClick={openModal} 
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Create Deck</button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()} // モーダル本体のクリックは無視
          >
            <h3 className='text-xl font-semibold text-center mb-4'>Add new deck</h3>

            <form onSubmit={createDeck} className='space-y-6'>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Deck Name</label>
                <input
                  type="text"
                  name="deckName"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Description</label>
                <textarea
                  type="text"
                  name="deckDescription"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <button type="submit" 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

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

export default Home
