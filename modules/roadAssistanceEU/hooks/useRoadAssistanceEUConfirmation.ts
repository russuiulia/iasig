import { confirmRoadAssistanceEUOrder } from '~/services/road-assistance-eu.services'
import { logError } from '~/utils/logger'

export const useRoadAssistanceEUConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmRoadAssistanceEUOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmRoadAssistanceEUOrder)', error)
    }
  }

  return { confirm }
}
