import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'
import type { Deck } from '../types/Deck'
import type { Card } from '../types/Card'

const DeckPage = () => {
  const [deck, setDeck] = useState<Deck>()
  const [cards, setCards] = useState<Card[]>([])
  const [deckName, setDeckName] = useState<string>("")
  const [deckDescription, setDeckDescription] = useState<string>("")

  const [showModal, setShowModal] = useState<boolean>(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const [showModal2, setShowModal2] = useState<boolean>(false)
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
  const editDeck = async (e: React.FormEvent<HTMLFormElement>) => {
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
  const [sentence, setSentence] = useState<string>("")
  const [word, setWord] = useState<string>("")
  const [pronounce, setPronounce] = useState<string>("")
  const [meaning, setMeaning] = useState<string>("")
  const [translate, setTranslate] = useState<string>("")

  const createCard = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0]  // 'YYYY-MM-DD'
}

  useEffect(() => {
    fetchDeck()
  },[])

  return (
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-5xl">
        <h1 className='text-3xl my-10'>{deck?.deckName}</h1>

        <ul 
          className="w-full divide-y divide-gray-100 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
          <li className="flex font-bold justify-between py-2 bg-white sticky top-0 z-10">
            <div className='w-2/12'>Word</div>
            <div className='w-8/12'>Sentence</div>
            <div className='w-2/12'>Created At</div>
          </li>

          {cards.map((card) => (
            <li className="flex justify-between py-2" onClick={() => navigate(`/card/${card.id}`)} key={card.id}>
              <div className='w-2/12 line-clamp-1'>{card?.word}</div>
              <div className='w-8/12 line-clamp-1'>{card?.sentence}</div>
              <div className='w-2/12'>{formatDate(card?.createdAt)}</div>
            </li>
          ))}
        </ul>

        <div className='w-64 flex mt-5'>
          <button 
            onClick={openModal2} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Edit Deck</button>
          <button 
            onClick={openModal} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Create Card</button>
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
            <h3 className='text-xl font-semibold text-center mb-4'>Create new card</h3>

            <form onSubmit={createCard} className='space-y-6'>
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
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

      {showModal2 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal2}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-semibold text-center mb-4'>Edit Deck</h3>

            <form onSubmit={editDeck} className='space-y-6'>
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
                  name="deckDescription"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <button 
                type="submit" 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

              <button 
                onClick={deleteDeck} 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Delete this deck</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal2} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

    </BaseTemplate>
  )
}

export default DeckPage
