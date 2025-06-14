import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Due } from '../types/Due'
import BaseLayout from '../components/layout/BaseLayout'
import { Box, Button, Modal, Typography } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  width: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const DuePage = () => {
  const [dueCard, setDueCard] = useState<Due | null>()
  const [cardCount, setCardCount] = useState<number>()

  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState<boolean>(true)
  const closeModal = () => setShowModal(false)

  // 正解表示を切り替え
  const [showAnswers, setShowAnswers] = useState(false)
  const toggleAnswers = () => setShowAnswers(prev => !prev)

  // 今日の単語リストを取得し、ランダムで一問出題する
  const fetchDue = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/review/due/${id}`, { withCredentials: true })

      if (res.data.length > 0) {
        const randomNum = Math.floor(Math.random() * res.data.length)
        setDueCard(res.data[randomNum])
        setCardCount(res.data.length)
      } else {
        setShowModal(false)
        setDueCard(null)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 問題正解時
  const success = async () => {
    if (!dueCard) return

    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/success`, null, {withCredentials: true})
      await fetchDue()
       setShowAnswers(false)
    } catch (e) {
      console.log(e)      
    }
  }

  // 問題不正解時
  const failure = async () => {
    if (!dueCard) return
    
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/failure`, null, {withCredentials: true})
      await fetchDue()
      setShowAnswers(false)
    } catch (e) {
      console.log(e)      
    }
  }

  useEffect(() => {
    fetchDue()
  },[])

  return (
    <BaseLayout>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        <Typography variant='h6' align='center' sx={{ marginTop: 4 }}>Study Now!!!</Typography>

        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {dueCard? (
            <>
              <Typography variant='h4' align='center' sx={{ marginTop: 4 }}>{dueCard?.card?.word}</Typography>
              <Typography variant='h5' align='center' sx={{ marginTop: 4 }}>{dueCard?.card?.sentence}</Typography>
              <Typography variant='h5' align='center' sx={{ marginTop: 4 }}>{dueCard?.card?.pronounce}</Typography>

              <Typography
                variant='h6'
                sx={{ marginTop: 2 }}
                onClick={toggleAnswers}
                className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
              >
                Answer {showAnswers ? " - " : " + "}
              </Typography>

              {showAnswers && (
                <>
                  <Typography variant='h5' align='center' sx={{ marginTop: 8 }}>{dueCard?.card?.meaning}</Typography>
                  <Typography variant='h5' align='center' sx={{ marginTop: 4 }} >{dueCard?.card?.translate}</Typography>
                </>
              )}


              <Box sx={{ display: 'flex', marginTop: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 1 }}>
                  <p>0 day</p>
                  <Button 
                    onClick={failure}
                    variant="contained"
                  >Again</Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 1 }}>
                  <p>{dueCard?.nextDateDiff} day</p>
                  <Button 
                    onClick={success}
                    variant="contained"
                  >Easy</Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h3'>Congratulations!</Typography>
              <p>You have finished this deck for now.</p>
              <Link
                to={`/deck/${id}`}
              >
                Back to deck
              </Link>
            </Box>
          )}
        </Box>
      </Box>

      <Modal
        open={showModal}
        onClose={closeModal}
      >
        <Box sx={style}>
          <Typography variant='h5'>Are you ready? ({cardCount})</Typography>

          <Box marginTop={4} sx={{ display: 'flex' }}>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{ margin: 2}}
            >Back</Button>

            <Button
              onClick={closeModal}
              variant="contained"
              sx={{ margin: 2}}
            >Start</Button>
          </Box>
        </Box>
      </Modal>

    </BaseLayout>
  )
}

export default DuePage
