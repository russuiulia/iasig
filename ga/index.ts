export const event = (event, params) => {
  if (window && window?.gtag) {
    window?.gtag('event', event, params)
  }
}

export const setUserId = (user_id) => {
  if (window && window?.gtag) {
    window?.gtag('set', { user_id })
  }
}

export const pageView = (url) => {
  event('page_view', {
    page_path: url,
  })
}

export const beginCheckout = (value, item_id, item_name, item_brand) => {
  event('conversion', {
    send_to: `${process.env.NEXT_PUBLIC_CONVERSION_ID}/${process.env.NEXT_PUBLIC_BEGIN_CHECKOUT_CONVERSION_LABEL}`,
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    items: [{ item_id, item_name, item_brand }],
  })
}

export const addToCart = (value, item_id, item_name, item_brand) => {
  event('conversion', {
    send_to: `${process.env.NEXT_PUBLIC_CONVERSION_ID}/${process.env.NEXT_PUBLIC_ADD_TO_CART_CONVERSION_LABEL}`,
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    items: [{ item_id, item_name, item_brand }],
  })
}

export const lead = (value, item_name, item_brand) => {
  event('conversion', {
    send_to: `${process.env.NEXT_PUBLIC_CONVERSION_ID}/${process.env.NEXT_PUBLIC_GENERATE_LEAD_CONVERSION_LABEL}`,
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    item_name,
    item_brand,
  })
}

export const purchase = (value, item_id, item_name, item_brand) => {
  event('conversion', {
    send_to: `${process.env.NEXT_PUBLIC_CONVERSION_ID}/${process.env.NEXT_PUBLIC_PURCHASE_CONVERSION_LABEL}`,
    value: Number?.(value?.toFixed?.(2)),
    currency: 'EUR',
    transaction_id: `${item_id}`,
    items: [{ item_id, item_name, item_brand }],
  })
}
