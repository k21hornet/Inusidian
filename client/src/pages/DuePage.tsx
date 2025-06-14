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

              <button
                onClick={toggleAnswers}
                className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
              >
                Answer {showAnswers ? " - " : " + "}
              </button>

              {showAnswers && (
                <>
                  <Typography variant='h5' align='center' sx={{ marginTop: 8 }}>{dueCard?.card?.meaning}</Typography>
                  <Typography variant='h5' align='center' sx={{ marginTop: 4 }} >{dueCard?.card?.translate}</Typography>
                </>
              )}


              <div className='flex mt-8'>
                <div className='flex flex-col items-center m-1'>
                  <p className='text-gray-500'>0 day</p>
                  <button 
                    onClick={failure} 
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >Again</button>
                </div>
                
                <div className='flex flex-col items-center m-1'>
                  <p className='text-gray-500'>{dueCard?.nextDateDiff} day</p>
                  <button 
                    onClick={success} 
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >Easy</button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-600">Congratulations!</h2>
              <p className="mt-2 text-xl text-gray-700">You have finished this deck for now.</p>
              <Link
                to={`/deck/${id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Back to deck
              </Link>
            </div>
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
