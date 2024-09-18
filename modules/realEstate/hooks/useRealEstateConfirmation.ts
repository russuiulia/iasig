import { confirmRealEstateOrder } from '~/services/real-estate.services'
import { logError } from '~/utils/logger'

export const useRealEstateConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmRealEstateOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmRealEstateOrder)', error)
    }
  }

  return { confirm }
}
