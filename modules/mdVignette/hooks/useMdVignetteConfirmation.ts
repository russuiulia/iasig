import { confirmMdVignetteOrder } from '~/services/md-vignette.services'
import { logError } from '~/utils/logger'

export const useMdVignetteConfirmation = () => {
  const confirm = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      return await confirmMdVignetteOrder(orderId)
    } catch (error) {
      logError('Failed to confirm pre-order (confirmMdVignetteOrder)', error)
    }
  }

  return { confirm }
}
