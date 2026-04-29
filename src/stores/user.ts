import { defineStore } from 'pinia'
import 'pinia-plugin-persistedstate'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  // State
  const fullName = ref('')
  const creationDate = ref('')
  const userId = ref('')
  const email = ref('')
  const plan = ref('')
  const isAuthenticated = ref(false)
  const authReady = ref(false)

  // Getters
  const getFullName = computed(() => fullName.value)
  const getFirstName = computed(() => fullName.value.split(' ')[0] || '')
  const getCreationDate = computed(() => creationDate.value)
  const getUserId = computed(() => userId.value)
  const getEmail = computed(() => email.value)
  const getPlan = computed(() => plan.value)
  const getIsAuthenticated = computed(() => isAuthenticated.value)
  const isAuthReady = computed(() => authReady.value)

  // Actions
  function setFullName(val: string) {
    fullName.value = val
  }
  function setUserId(id: string) {
    userId.value = id
  }
  function setCreationDate(date: string) {
    creationDate.value = date
  }
  function setEmail(val: string) {
    email.value = val
  }
  function setPlan(val: string) {
    plan.value = val
  }
  function setIsAuthenticated(val: boolean) {
    isAuthenticated.value = val
  }
  function setAuthReady(val: boolean) {
    authReady.value = val
  }
  function clearFullName() {
    fullName.value = ''
  }
  function clearUser() {
    fullName.value = ''
    creationDate.value = ''
    userId.value = ''
    email.value = ''
    plan.value = ''
    isAuthenticated.value = false
  }

  return {
    // State
    fullName,
    creationDate,
    userId,
    email,
    plan,
    isAuthenticated,
    authReady,
    // Getters
    getFullName,
    getFirstName,
    getCreationDate,
    getUserId,
    getEmail,
    getPlan,
    getIsAuthenticated,
    isAuthReady,
    // Actions
    setFullName,
    setUserId,
    setCreationDate,
    setEmail,
    setPlan,
    setIsAuthenticated,
    setAuthReady,
    clearFullName,
    clearUser,
  }
}, {
  persist: true
})
