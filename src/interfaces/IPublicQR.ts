//This contains the structure of a public QR

import type { Timestamp } from 'firebase/firestore'

export interface IPublicQR {
  id: string
  status: string
  lastScan: Timestamp | null
  totalScans: number
  ownerName?: string
  isBanned: boolean
  banReason?: string
  docId?: string
}
