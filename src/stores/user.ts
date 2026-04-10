import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    fullName: '',
    creationDate: '',
  }),
  getters: {
    getFullName: (state) => state.fullName,
    getFirstName: (state) => state.fullName.split(' ')[0],
    getCreationDate: (state) => state.creationDate,
  },
  actions: {
    setFullName(fullName: string) {
      this.fullName = fullName
    },
    setCreationDate(creationDate: string) {
      this.creationDate = creationDate
    },
    clearFullName() {
      this.fullName = ''
    },
  },
})
