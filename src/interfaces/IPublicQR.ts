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
  img?: string
}

export interface IQRLog {
  id: string
  scanDate: Timestamp
  scanMetrics: {
    city: string
    country: string
    region: string
  }
  interaction?: {
    reason: string
    message?: string
    type: string
  }
  img?: string
}
