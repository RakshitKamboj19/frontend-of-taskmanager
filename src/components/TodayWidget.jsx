import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import useFetch from '../hooks/useFetch'

const Stat = ({ label, value, color }) => (
  <div className={`p-4 rounded-2xl card text-center ${color}`}>
    <div className="text-sm opacity-70">{label}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
)

const TodayWidget = () => {
  const { token, isLoggedIn } = useSelector(s => s.authReducer)
  const [fetchData, { data }] = useFetch()

  useEffect(() => {
    if (!isLoggedIn) return
    const config = { url: '/tasks', method: 'get', headers: { Authorization: `Bearer ${token}` } }
    fetchData(config, { showSuccessToast: false }).catch(() => {})
  }, [isLoggedIn, token, fetchData])

  const { total, completed, pending, dueToday } = useMemo(() => {
    const list = data?.tasks || []
    const total = list.length
    const completed = list.filter(t => t.status === 'completed').length
    const pending = total - completed
    const todayStr = new Date().toDateString()
    const dueToday = list.filter(t => new Date(t.tillDate).toDateString() === todayStr).length
    return { total, completed, pending, dueToday }
  }, [data])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Total" value={total} />
      <Stat label="Completed" value={completed} />
      <Stat label="Pending" value={pending} />
      <Stat label="Due Today" value={dueToday} />
    </div>
  )
}

export default TodayWidget


