import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    fullName: '',
    creationDate: '',
    userId: '',
    email: '',
  }),
  getters: {
    getFullName: (state) => state.fullName,
    getFirstName: (state) => state.fullName.split(' ')[0],
    getCreationDate: (state) => state.creationDate,
    getUserId: (state) => state.userId,
    getEmail: (state) => state.email,
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
