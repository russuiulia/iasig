import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { DeliveryBody } from '~/services/interfaces/delivery'
import { IsgOrder } from '~/services/interfaces/order'
import { getGeoFromAddress, getGeoFromLatLng } from '~/utils/geocode'
import { hoursOptions } from '~/utils/hoursOptions'
import { useLiveDocument } from '~/utils/useLive'
import { IsgMap } from '../shared/isgMap/isgMap'
import {
  DEFAULT_ZOOM,
  PICKUP_ADDRESS,
  PICKUP_ADDRESS_LAT,
  PICKUP_ADDRESS_LNG,
} from '../shared/isgMap/isgMap.constants'
import { IsgSelect } from '../shared/isgSelect/isgSelect'
import { DeliverySuccess } from '../deliverySuccess/deliverySuccess'
import { differenceInCalendarDays } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { createNewDelivery } from '~/services/green-card.services'
export interface DeliveryFormProps {
  order: IsgOrder<any>
  setConfirmedDelivery?: (value: boolean) => void
}

export const DeliveryForm = ({ order }: DeliveryFormProps): JSX.Element => {
  const { translate } = useTranslation()
  const router = useRouter()

  const { data: delivery } = useLiveDocument('deliveries', `${order?.deliveryRef}`)
  const [requestDelivery, setRequestDelivery] = useState(false)

  const [confirmedDelivery, setConfirmedDelivery] = useState(false)

  return (
    <div className="text-left mt-6">
      {order?.deliveryRef || confirmedDelivery ? (
        <>
          <Title />
          <DeliverySuccess delivery={delivery} orderId={`${router.query.order}`} />
        </>
      ) : requestDelivery ? (
        <Form order={order} setConfirmedDelivery={setConfirmedDelivery}></Form>
      ) : (
        <div className="md:w-7/12 w-full mx-auto text-center">
          <p
            className="text-center mb-6"
            dangerouslySetInnerHTML={{
              __html: translate('delivery:mandatory'),
            }}
          />
          <>
            {order?.details?.zone === '3' ? (
              <>
                <p className="mb-2">{translate('delivery:optional:europe')}</p>
                <div className="flex justify-center mt-4">
                  <IsgButton
                    styleClass="d-block mx-auto py-4 h-12 sm:w-44 w-full"
                    type="submit"
                    text={translate('request-delivery')}
                    onClick={() => setRequestDelivery(true)}
                  />
                </div>
              </>
            ) : (
              <p className="mb-2">{translate('delivery:optional')}</p>
            )}
          </>
        </div>
      )}
    </div>
  )
}

const Title = (): JSX.Element => {
  const { translate } = useTranslation()
  return <h3 className="text-center">{translate('delivery')}</h3>
}

const Form = ({ order, setConfirmedDelivery }: DeliveryFormProps): JSX.Element => {
  const options = hoursOptions()
  const [deliveryTime, setDeliveryTime] = useState(options[0])
  const { handleSubmit } = useForm({ mode: 'onBlur' })
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({
    lat: PICKUP_ADDRESS_LAT,
    lng: PICKUP_ADDRESS_LNG,
  })
  const [marker, setMarker] = useState({
    lat: PICKUP_ADDRESS_LAT,
    lng: PICKUP_ADDRESS_LNG,
  })

  const { translate } = useTranslation()
  const router = useRouter()

  const onMarkerDragEnd = async (event) => {
    const newLat = event.latLng.lat()
    const newLng = event.latLng.lng()

    const response = await getGeoFromLatLng(newLat, newLng)

    if (response?.error) {
      return
    }

    setDeliveryAddress(response?.results?.[0]?.formatted_address || '')
    setMapCenter({ lat: newLat, lng: newLng })
    setMarker({ lat: newLat, lng: newLng })
  }

  const onPlaceSelected = async (place) => {
    setDeliveryAddress(place?.formatted_address || place.name || '')

    const places = place?.formatted_address || place.name
    const response = await getGeoFromAddress(places)

    if (response?.error) {
      return
    }

    const { lat, lng } = response.results[0].geometry.location
    setMapCenter({ lat, lng })
    setMarker({ lat, lng })
  }

  const onPlaceChange = async (e) => {
    setDeliveryAddress(e.target.value)
    const response = await getGeoFromAddress(e.target.value)

    if (response?.error) {
      setMarker({ lat: 0, lng: 0 })
      return
    }

    const { lat, lng } = response.results[0].geometry.location
    setMapCenter({ lat, lng })
    setMarker({ lat, lng })
  }

  const onSubmit = async (): Promise<void> => {
    if (deliveryAddress && marker?.lat && marker?.lng) {
      setIsLoading(true)
      setError('')
      const data: DeliveryBody = {
        pickupAddress: PICKUP_ADDRESS,
        deliveryAddress,
        pickupAddressLat: PICKUP_ADDRESS_LAT || 0,
        pickupAddressLng: PICKUP_ADDRESS_LNG || 0,
        lng: marker.lng,
        lat: marker.lat,
        deliveryTime: new Date(deliveryTime),
        orderId: order?.orderId || `${router.query.order}`,
        phone: order?.contact?.phone || '',
        email: order?.contact?.email || '',
      }
      const res = await createNewDelivery(data)
      if (res?.deliveryRef) {
        setConfirmedDelivery?.(true)
      } else {
        setError(translate('delivery-error'))
      }
      setIsLoading(false)
    } else {
      setError(translate('required-fields'))
    }
  }

  const getDay = (value: Date): string => {
    return differenceInCalendarDays(new Date(value), new Date()) >= 1 ? 'tomorrow' : 'today'
  }

  return (
    <>
      <Title />
      <form style={{ maxWidth: 'unset' }} className="mt-10">
        <div className="mb-6 xl:w-2/5 md:w-3/5 w-full mx-auto">
          <label htmlFor="deliveryHour">{translate('delivery-hour')}</label>
          <IsgSelect
            name="hours"
            id="deliveryHour"
            defaultValue={{
              value: deliveryTime,
              label: `${translate(`${getDay(deliveryTime)}`)} 17:00-20:00`,
            }}
            options={options.map((value) => ({
              value,
              label: `${translate(`${getDay(value)}`)} 17:00-20:00`,
            }))}
            onChange={({ value }: { value: any }) => setDeliveryTime(value)}
          />
        </div>
        <IsgMap
          zoom={DEFAULT_ZOOM}
          onPlaceSelected={onPlaceSelected}
          onMarkerDragEnd={onMarkerDragEnd}
          mapCenter={mapCenter}
          marker={marker}
          deliveryAddress={deliveryAddress}
          onPlaceChange={onPlaceChange}
        />
        {error && <p className={`text-center text-danger mt-3`}>{error}</p>}
        <div className="flex justify-center mt-10">
          <IsgButton
            styleClass="d-block mx-auto py-4 h-12 sm:w-44 w-full"
            type="submit"
            text={translate('confirm-delivery')}
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </div>
      </form>
    </>
  )
}
