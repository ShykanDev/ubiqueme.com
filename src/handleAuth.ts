import { auth as firebaseAuth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

export const useAuth = () => {
  const router = useRouter()
  const userStore = useUserStore()

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth)
      userStore.clearUser()
      router.push({ name: 'login' })
    } catch (error) {
      console.log(`Error while attempting to logout: ${error}`)
    }
  }

  // Regresas tu función para que la usen tus componentes
  return { handleLogout }
}
