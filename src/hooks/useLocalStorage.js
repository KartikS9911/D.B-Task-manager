import { useState, useEffect } from 'react'

/**
 * Persists state to localStorage under `key`.
 * Lazily reads on first render so we don't touch localStorage on every render.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.warn(`Could not read localStorage key "${key}":`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Could not write localStorage key "${key}":`, err)
    }
  }, [key, value])

  return [value, setValue]
}
