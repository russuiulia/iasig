import { GoogleMap, InfoWindow, Marker, LoadScript, Libraries } from '@react-google-maps/api'
import { GoogleAutoComplete } from '../googleAutoComplete/googleAutoComplete'
import { EAST_BOUND, NORTH_BOUND, SOUTH_BOUND, WEST_BOUND } from './isgMap.constants'

const GOOGLE_LIBRARIES: Libraries = ['places']
export interface IsgMapProps {
  deliveryAddress: string
  mapCenter: { lat: number; lng: number }
  marker: { lat: number | null; lng: number | null }
  zoom: number

  onMarkerDragEnd: (event: any) => void
  onPlaceSelected: (event: any) => void
  onPlaceChange: (event: any) => void
}

const Map = (props: any) => {
  return (
    <>
      <div className="order-2">
        <GoogleAutoComplete
          onPlaceChange={props.onPlaceChange}
          onPlaceSelected={props.onPlaceSelected}
          value={props.deliveryAddress}
        />
      </div>
      <GoogleMap
        zoom={props.zoom}
        mapContainerStyle={{ height: '475px' }}
        mapContainerClassName="order-2 md:w-8/12 w-full mx-auto h-full rounded-2xl"
        center={props.mapCenter}
        options={{
          restriction: {
            latLngBounds: {
              north: NORTH_BOUND,
              south: SOUTH_BOUND,
              east: EAST_BOUND,
              west: WEST_BOUND,
            },
            strictBounds: false,
          },
        }}
      >
        {props.deliveryAddress && props.marker.lat && props.marker.lng ? (
          <>
            <InfoWindow
              position={{
                lat: props.marker.lat + 0.0018,
                lng: props.marker.lng,
              }}
            >
              <div>
                <span className="m-0 p-0">{props.deliveryAddress}</span>
              </div>
            </InfoWindow>
            <Marker
              draggable={true}
              onDragEnd={props.onMarkerDragEnd}
              position={{ lat: props.marker.lat, lng: props.marker.lng }}
            />
          </>
        ) : (
          <></>
        )}
      </GoogleMap>
    </>
  )
}

export const IsgMap = ({
  deliveryAddress,
  mapCenter,
  marker,
  onPlaceSelected,
  onMarkerDragEnd,
  onPlaceChange,
  zoom,
}: IsgMapProps): JSX.Element => {
  return (
    <LoadScript
      googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`}
      libraries={GOOGLE_LIBRARIES}
    >
      <Map
        onMarkerDragEnd={onMarkerDragEnd}
        deliveryAddress={deliveryAddress}
        mapCenter={mapCenter}
        marker={marker}
        zoom={zoom}
        onPlaceSelected={onPlaceSelected}
        onPlaceChange={onPlaceChange}
      />
    </LoadScript>
  )
}
