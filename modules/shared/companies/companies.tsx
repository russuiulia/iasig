/* eslint-disable @next/next/no-img-element */
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CompaniesImg } from '~/constants/companies'
import { useTranslation } from '~/context/LanguageContext'
import { MedicalOptionalOfferPrice } from '~/services/interfaces/medical-optional'
import { InsuranceType } from '../types/insurance'

export interface CompaniesProps {
  offers: string[] | MedicalOptionalOfferPrice[]
  price?: number
  priceEUR?: number
  name: string
  handleChange: (value) => void
  defaultValue?: string
  insuranceType?: InsuranceType
  id?: string
}

const IsgRadio = (props) => {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
        '& .MuiSvgIcon-root': {
          fontSize: 16,
        },
      }}
      disableRipple
      {...props}
    />
  )
}

const IsgLabel = ({ priceEUR, price, companyName }): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div id="offers" className="flex h-full items-center justify-between">
      <div className="flex items-center sm:text-base text-sm">
        <img
          src={CompaniesImg[companyName]}
          alt="companyName"
          width="35"
          height="35"
          className="object-contain"
        />
        <span className="ml-2" translate="no">
          {translate(`company:${companyName?.toLowerCase?.()}`)}
        </span>
      </div>
      <div className="price flex items-center sm:text-base text-sm">
        <span className="ml-2 font-bold text-black-lightest">{price?.toFixed(2)} MDL</span>

        {priceEUR && (
          <span className="text-gray ml-1">{'(' + priceEUR?.toFixed(2) + ' €' + ')'}</span>
        )}
      </div>
    </div>
  )
}

export const Companies = ({
  offers,
  priceEUR,
  price,
  name,
  handleChange,
  defaultValue = '',
  insuranceType = InsuranceType.RCA,
  id = '',
}: CompaniesProps): JSX.Element => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const { translate } = useTranslation()
  const isRca = insuranceType === InsuranceType.RCA
  const watchCompany = watch('companyName')

  useEffect(() => {
    if (!isRca) {
      if (!watchCompany) {
        return
      }

      const offer = (offers as MedicalOptionalOfferPrice[]).find(
        (item) => item.company === watchCompany
      )
      if (!offer) {
        return
      }

      setValue('price', offer.price)
    }
  }, [watchCompany])

  return (
    <div id="companies">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          required: {
            value: true,
            message: translate(`${name}:required`),
          },
        }}
        render={({ field: { value, onChange, ref } }) => {
          return (
            <>
              <FormControl component="fieldset" fullWidth id={id}>
                <RadioGroup
                  onChange={(e) => {
                    handleChange(e)
                    onChange(e)
                  }}
                  aria-label={name}
                  name={name}
                  value={value}
                  className="space-y-2"
                >
                  {offers.map((offer, index) => (
                    <FormControlLabel
                      sx={{
                        alignItems: 'center !important',
                        borderColor: '#B8C8D9',
                        padding: '0px 16px 0px 8px',
                        width: '100%',
                        margin: '0 auto',
                        borderRadius: '4px',
                        border: '1px solid #B8C8D9',
                        height: '56px',
                      }}
                      key={index}
                      value={isRca ? offer : offer?.company}
                      control={<IsgRadio />}
                      label={
                        <IsgLabel
                          priceEUR={isRca ? priceEUR : offer?.priceEUR}
                          price={isRca ? price : offer?.price}
                          companyName={isRca ? offer : offer?.company}
                        />
                      }
                      inputRef={ref}
                    ></FormControlLabel>
                  ))}
                </RadioGroup>
              </FormControl>
              <p className="text-danger">{errors?.[name]?.message}</p>
            </>
          )
        }}
      />
    </div>
  )
}
