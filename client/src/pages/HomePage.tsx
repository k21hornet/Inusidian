import axios from 'axios'
import { useEffect, useState } from 'react'
import {  Navigate, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import type { Deck } from '../types/Deck'
import BaseLayout from '../components/layout/BaseLayout'
import { Avatar, Box, Button, FormControl, FormLabel, List, ListItem, ListItemAvatar, ListItemText, Modal, TextField, Typography } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  width: 700
}

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

        <List sx={{ width: '100%'}}>
          {decks.map((deck) => (
            <ListItem
              secondaryAction={
                <Button 
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation() // 親要素にイベントがバブリングしない
                    navigate(`deck/${deck?.id}/review`)
                  }}
                >Review</Button>
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
          <Button 
            variant="contained"
            onClick={openModal} 
            >Create Deck</Button>
        </div>
      </Box>

      <Modal
        open={showModal}
        onClose={closeModal}
      >
        <Box sx={style}>
          <Typography variant='h5'>Create A New Deck</Typography>

          <Box 
          component="form" 
          onSubmit={createDeck}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}>
            <FormControl>
              <FormLabel htmlFor='deckName'>Deck Name</FormLabel>
                <TextField
                  id='deckName'
                  type='text'
                  name='deckName'
                  value={deckName}
                  onChange={ (e) => setDeckName(e.target.value)}
                  fullWidth
                  required
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='deckDescription'>Deck Description</FormLabel>
                <TextField
                  id='deckDescription'
                  type='text'
                  name='deckDescription'
                  value={deckDescription}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setDeckDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  required
                />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    
    </BaseLayout>
  )
}

export default HomePage
