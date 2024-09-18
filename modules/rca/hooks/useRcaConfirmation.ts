import { confirmRcaOrder } from '~/services/rca.services'
import { logError } from '~/utils/logger'

export const useRcaConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmRcaOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (useRcaConfirmation)', error)
    }
  }

  return { confirm }
}
