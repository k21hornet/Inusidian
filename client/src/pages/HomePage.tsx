import axios from 'axios'
import { useEffect, useState } from 'react'
import {  Navigate, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import type { Deck } from '../types/Deck'
import BaseLayout from '../components/layout/BaseLayout'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';

const HomePage = () => {
  const navigate = useNavigate()
  
  const [decks, setDecks] = useState<Deck[]>([])
  const [deckName, setDeckName] = useState<string>("")
  const [deckDescription, setDeckDescription] = useState<string>("")

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    fetchDecks()
  }, [])

  const { user } = useUser()
  if (!user) return <Navigate to="/signin" />

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
  const createDeck = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const navigateToDeck = (id: number) => {
    navigate(`/deck/${id}`)
  }


  return (
    <BaseLayout>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4
        }}
      >
        <Typography variant='h4'>Welcome Back!</Typography>

        {/* <ul 
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
        </ul> */}
        <List sx={{ width: '100%'}}>
          {decks.map((deck) => (
            <ListItem
              secondaryAction={
                <button 
                onClick={(e) => {
                  e.stopPropagation() // 親要素にイベントがバブリングしない
                  navigate(`deck/${deck?.id}/review`)
                }} 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Review</button>
              }
              key={deck.id}
              onClick={() => navigateToDeck(deck.id)}
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={deck?.deckName}
                secondary={deck?.deckDescription}
              ></ListItemText>
            </ListItem>
          ))}
        </List>

        <div className='w-64 flex flex-col items-center mt-5'>
          <button 
            onClick={openModal} 
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Create Deck</button>
        </div>
      </Box>

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
    
    </BaseLayout>
  )
}

export default HomePage
