import { useState, useCallback } from 'react'

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFunc(...args)
      setData(response)
      return response
    } catch (err) {
      setError(err.message || 'Something went wrong')
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { data, error, loading, execute }
}

export default useApi
