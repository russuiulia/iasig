import { confirmMedicalOrder } from '~/services/medical.services'
import { logError } from '~/utils/logger'

export const useMedicalConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmMedicalOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmMedicalOrder)', error)
    }
  }

  return { confirm }
}
