import { confirmRoVignetteOrder } from '~/services/ro-vignette.services'
import { logError } from '~/utils/logger'

export const useRoVignetteConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmRoVignetteOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmRoVignetteOrder)', error)
    }
  }

  return { confirm }
}
