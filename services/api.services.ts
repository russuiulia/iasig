import { getFunctions, httpsCallable } from 'firebase/functions'
import { FIREBASE_REGION } from '~/constants/region'
import { logError } from '~/utils/logger'
import { firebaseApp } from './firebase'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const sendContactEmail = async (data: {
  name: string
  email: string
  message: string
}): Promise<boolean> => {
  try {
    const sendContactEmail = httpsCallable(functions, 'sendcontactemail')
    await sendContactEmail(data)

    return true
  } catch (e) {
    logError('sendContactEmail error', e)
    return false
  }
}
