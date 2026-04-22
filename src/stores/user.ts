import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    fullName: '',
    creationDate: '',
    userId: '',
    email: '',
    plan: '',
  }),
  getters: {
    getFullName: (state) => state.fullName,
    getFirstName: (state) => state.fullName.split(' ')[0],
    getCreationDate: (state) => state.creationDate,
    getUserId: (state) => state.userId,
    getEmail: (state) => state.email,
    getPlan: (state) => state.plan,
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
    clearFullName() {
      this.fullName = ''
    },
    clearUser() {
      this.fullName = ''
      this.creationDate = ''
    },
  },
  persist: true,
})
