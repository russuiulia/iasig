import { confirmGreenCardOrder } from '~/services/green-card.services'
import { logError } from '~/utils/logger'

export const useGreenCardConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmGreenCardOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmGreenCardOrder)', error)
    }
  }

  return { confirm }
}
