import { confirmRoadTaxOrder } from '~/services/road-tax.services'
import { logError } from '~/utils/logger'

export const useRoadTaxConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmRoadTaxOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmRoadTaxOrder)', error)
    }
  }

  return { confirm }
}
