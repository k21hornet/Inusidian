import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'

const Due = () => {
  const [dueCard, setDueCard] = useState()

  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(true)
  const closeModal = () => setShowModal(false)

  // 今日の単語リストを取得し、ランダムで一問出題する
  const fetchDue = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/review/due/${id}`, { withCredentials: true })

      if (res.data.length > 0) {
        const randomNum = Math.floor(Math.random() * res.data.length)
        setDueCard(res.data[randomNum])
      } else {
        setDueCard(null)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 問題正解時
  const success = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/success`, null, {withCredentials: true})
      await fetchDue()
    } catch (e) {
      console.log(e)      
    }
  }

  // 問題不正解時
  const failure = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/review/${dueCard.id}/failure`, null, {withCredentials: true})
      await fetchDue()
    } catch (e) {
      console.log(e)      
    }
  }

  useEffect(() => {
    fetchDue()
  },[])

  return (
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-200">
        <h1 className='text-3xl my-10'>Study Now</h1>

        <div className='w-full divide-y divide-gray-100 flex flex-col items-center'>
          {dueCard? (
            <>
              <p className="flex text-xl justify-between py-2 text-center">{dueCard?.card?.sentence}</p>
              <p className="flex text-xl justify-between py-2 text-center">{dueCard?.card?.word}</p>
              <p className="flex text-xl justify-between py-2 text-center mb-30">{dueCard?.card?.pronounce}</p>

              <p className="flex text-xl justify-between py-2 text-center">{dueCard?.card?.meaning}</p>
              <p className="flex text-xl justify-between py-2 text-center">{dueCard?.card?.translate}</p>

              <div className='flex mt-10'>
                <button 
                  onClick={failure} 
                  className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Hard</button>
                <button 
                  onClick={success} 
                  className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Easy</button>
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
        </div>
      </div>

      {showModal && dueCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className='text-center text-2xl'>Are you ready?</h3>
            <br />
            <div className='flex'>
              <button 
                onClick={() => navigate("/")} 
                type="submit" 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Back</button>

              <button 
                onClick={closeModal} 
                type="submit" 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Start</button>
            </div>
          </div>
        </div>

      )}

    </BaseTemplate>
  )
}

export default Due
