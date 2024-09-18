import { confirmBaggageOrder } from '~/services/baggage.services'
import { logError } from '~/utils/logger'

export const useBaggageConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmBaggageOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmBaggageOrder)', error)
    }
  }

  return { confirm }
}
