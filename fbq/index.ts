import { firebaseAuth } from '~/services/firebase'

const getUserUid = () => firebaseAuth?.currentUser?.uid

export const event = (event, params, optionalParams?: any) => {
  window?.fbq?.('track', event, params, optionalParams)
}

export const pageView = () => {
  event('PageView', {
    external_id: getUserUid(),
  })
}

export const beginCheckout = (value, orderId, content_name, content_brand) => {
  event(
    'InitiateCheckout',
    {
      value: Number?.(value?.toFixed?.(2)),
      currency: 'EUR',
      content_ids: [`${orderId}`],
      transaction_id: `${orderId as string}`,
      external_id: getUserUid(),
      content_name,
      content_brand,
    },
    { eventID: orderId }
  )
}

export const addToCart = (value, orderId, content_name, content_brand) => {
  event(
    'AddToCart',
    {
      value: Number?.(value?.toFixed?.(2)),
      currency: 'EUR',
      content_ids: [`${orderId}`],
      content_name,
      content_brand,
    },
    { eventID: orderId }
  )
}

export const lead = (value, content_name, content_brand) => {
  event('Lead', {
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    content_name,
    content_brand,
  })
}

export const purchase = (value, orderId, content_name, content_brand) => {
  event(
    'Purchase',
    {
      value: Number?.(value?.toFixed?.(2)),
      currency: 'EUR',
      content_ids: [`${orderId}`],
      content_name,
      content_brand,
    },
    { eventID: orderId }
  )
}

export const viewContent = (content_name) => {
  event('ViewContent', {
    content_name,
    external_id: getUserUid(),
  })
}
