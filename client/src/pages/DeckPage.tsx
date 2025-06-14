import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Deck } from '../types/Deck'
import type { Card } from '../types/Card'
import BaseLayout from '../components/layout/BaseLayout'
import { Box, Button, FormControl, FormLabel, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'

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
    <BaseLayout>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4
        }}
      >
        <Typography variant='h4'>{deck?.deckName}</Typography>

        <Box sx={{ width: '100%', overflow: 'hidden'}}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 260px)' }}>
            <Table stickyHeader>

              <TableHead>
                <TableRow>
                  <TableCell>Word</TableCell>
                  <TableCell>Sentence</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card.id} onClick={() => navigate(`/card/${card.id}`)}>
                    <TableCell>{card?.word}</TableCell>
                    <TableCell>{card?.sentence}</TableCell>
                    <TableCell sx={{ width: 120 }}>{formatDate(card?.createdAt)}</TableCell>
                </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </Box>

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

      </Box>

      <Modal
        open={showModal}
        onClose={closeModal}
      >
        <Box sx={style}>
          <Typography variant='h5'>Create A New Card</Typography>

          <Box 
          component="form" 
          onSubmit={createCard}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}>
            <FormControl>
              <FormLabel htmlFor='sentence'>Sentence</FormLabel>
                <TextField
                  id='sentence'
                  type='text'
                  name='sentence'
                  required
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='word'>Word</FormLabel>
                <TextField
                  id='word'
                  type='text'
                  name="word"
                  required
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  fullWidth
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='pronounce'>Pronounce</FormLabel>
                <TextField
                  id='pronounce'
                  type='text'
                  name='pronounce'
                  value={pronounce}
                  onChange={ (e) => setPronounce(e.target.value)}
                  fullWidth
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='meaning'>Meaning</FormLabel>
                <TextField
                  id='meaning'
                  type='text'
                  name='meaning'
                  value={meaning}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setMeaning(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='translate'>Translate</FormLabel>
                <TextField
                  id='translate'
                  type='text'
                  name='translate'
                  value={translate}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setTranslate(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
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

      <Modal
        open={showModal2}
        onClose={closeModal2}
      >
        <Box sx={style}>
          <Typography variant='h5'>Edit This Deck</Typography>

          <Box 
          component="form" 
          onSubmit={editDeck}
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

            <Button
              onClick={deleteDeck} 
              fullWidth
              variant="contained"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

    </BaseLayout>
  )
}

export default DeckPage
