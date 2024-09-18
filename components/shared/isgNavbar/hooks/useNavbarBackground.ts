import { useEffect } from 'react'

export const useNavbarBackground = () => {
  useEffect(() => {
    const scrollHandler = (): void => {
      const navbar = document.getElementById('navbar')

      if (!navbar) {
        return
      }

      navbar.style.top = '0px'
      navbar.style.marginTop = '0px'
      if (window.scrollY > 20 && window.innerWidth < 768) {
        navbar.style.backgroundColor = 'white'
      } else {
        navbar.style.backgroundColor = 'transparent'
      }
    }

    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])
}
