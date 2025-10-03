import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Carregar tema salvo do localStorage
    const savedTheme = localStorage.getItem('finance-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      // Detectar preferência do sistema
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Aplicar tema ao documento
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Salvar no localStorage
    localStorage.setItem('finance-theme', isDark ? 'dark' : 'light')
  }, [isDark, mounted])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Retornar false durante SSR para evitar hidratação mismatch
  return {
    isDark: mounted ? isDark : false,
    toggleTheme
  }
}