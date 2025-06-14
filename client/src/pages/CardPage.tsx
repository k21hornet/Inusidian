import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import type { Card } from '../types/Card'
import BaseLayout from '../components/layout/BaseLayout'
import { Box, Button, FormControl, FormLabel, Modal, TextField, Typography } from '@mui/material'

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

const CardPage = () => {
  const [card, setCard] = useState<Card>()
  const [deckId, setDeckId] = useState<number>()

  const [sentence, setSentence] = useState<string>("")
  const [word, setWord] = useState<string>("")
  const [pronounce, setPronounce] = useState<string>("")
  const [meaning, setMeaning] = useState<string>("")
  const [translate, setTranslate] = useState<string>("")

  const { id } = useParams()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState<boolean>(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  useEffect(() => {
    fetchCard()
  }, [])

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
  const editCard = async (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <BaseLayout>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>

        <Typography variant='h4' align='center' sx={{ marginTop: 8 }}>{card?.word}</Typography>

        <Typography variant='h5' align='center' sx={{ marginTop: 4 }}>{card?.sentence}</Typography>

        <Typography variant='h5' align='center' sx={{ marginTop: 4 }}>{card?.pronounce}</Typography>

        <Typography variant='h5' align='center' sx={{ marginTop: 12 }}>{card?.meaning}</Typography>

        <Typography variant='h5' align='center' sx={{ marginTop: 4, fontStyle: 'italic' }}>{card?.translate}</Typography>

        <div className='w-64 flex mt-5'>
          <button 
            onClick={() => navigate(`/deck/${card?.deckId}`)}
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Back</button>
          <button 
            onClick={openModal} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Edit</button>
        </div>
      </Box>      

      <Modal
        open={showModal}
        onClose={closeModal}
      >
        <Box sx={style}>
          <Typography variant='h5'>Edit This Card</Typography>

          <Box 
          component="form" 
          onSubmit={editCard}
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

            <Button
              onClick={deleteCard} 
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

export default CardPage
