import { confirmMedicalOptionalOrder } from '~/services/medical-optional.services'
import { logError } from '~/utils/logger'

export const useMedicalOptionalConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmMedicalOptionalOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmMedicalOptionalOrder)', error)
    }
  }

  return { confirm }
}
