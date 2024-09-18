import { logEvent } from '~/services/firebase.service'

export const pageView = (url) => {
  logEvent('page_view', {
    page_path: url,
  })
}

export const beginCheckout = (value, item_id, item_name, item_brand) => {
  logEvent('begin_checkout', {
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    items: [{ item_id, item_name, item_brand }],
  })
}

export const addToCart = (value, item_id, item_name, item_brand) => {
  logEvent('add_to_cart', {
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    items: [{ item_id, item_name, item_brand }],
  })
}

export const lead = (value, item_name, item_brand) => {
  logEvent('generate_lead', {
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    item_name,
    item_brand,
  })
}

export const purchase = (value, item_id, item_name, item_brand) => {
  logEvent('purchase', {
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    transaction_id: `${item_id}`,
    items: [{ item_id, item_name, item_brand }],
  })
}

export const express_order = (product) => logEvent('express_order', { content_type: product })
