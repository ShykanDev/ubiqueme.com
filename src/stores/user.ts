import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    fullName: '',
    creationDate: '',
    userId: '',
    email: '',
    plan: '',
    isAuthenticated: false,
    authReady: false,
  }),
  getters: {
    getFullName: (state) => state.fullName,
    getFirstName: (state) => state.fullName.split(' ')[0],
    getCreationDate: (state) => state.creationDate,
    getUserId: (state) => state.userId,
    getEmail: (state) => state.email,
    getPlan: (state) => state.plan,
    getIsAuthenticated: (state) => state.isAuthenticated,
    isAuthReady: (state) => state.authReady,
  },
  actions: {
    setFullName(fullName: string) {
      this.fullName = fullName
    },
    setUserId(id: string) {
      this.userId = id
    },
    setCreationDate(creationDate: string) {
      this.creationDate = creationDate
    },
    setEmail(email: string) {
      this.email = email
    },
    setPLan(plan: string) {
      this.plan = plan
    },
    setIsAuthenticated(val: boolean) {
      this.isAuthenticated = val
    },
    setAuthReady(val: boolean) {
      this.authReady = val
    },
    clearFullName() {
      this.fullName = ''
    },
    clearUser() {
      this.fullName = ''
      this.creationDate = ''
      this.userId = ''
      this.email = ''
      this.plan = ''
      this.isAuthenticated = false
    },
  },
  persist: true,
})
