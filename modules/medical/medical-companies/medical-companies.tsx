/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { CompaniesImg } from '~/constants/companies'
import { MedicalOfferPrice } from '~/services/interfaces/medical'
import { useEffect } from 'react'
import { MedicalOptionalOfferPrice } from '~/services/interfaces/medical-optional'

export interface CompaniesProps {
  offers: string[] | MedicalOfferPrice[] | MedicalOptionalOfferPrice[]
  name: string
  handleChange: (value) => void
  defaultValue: string
  id: string
  includeCovidRisk: boolean
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

const IsgLabel = ({ priceEUR, price, companyName, setOpen, open }): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="flex h-full items-center justify-between">
      <div className="flex items-center sm:text-base text-xs">
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
      <div className="flex h-full w-2/3 justify-end items-center">
        <div className="flex items-center sm:text-base text-xs">
          <span className="ml-2 font-bold text-black-lightest">{price?.toFixed(2)} MDL</span>

          {priceEUR && (
            <span className="text-gray ml-1">{'(' + priceEUR?.toFixed(2) + ' €' + ')'}</span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="h-10 w-10 m-1.5 hover:bg-black-4 hover:rounded-full"
          type="button"
        >
          <img
            src="/images/dropdown.svg"
            alt="dropdown"
            width={16}
            height={16}
            className={`${
              open
                ? 'transform -rotate-180 ease-linear duration-300'
                : 'transform rotate-0 ease-linear duration-300'
            } mx-auto`}
          />
        </button>
      </div>
    </div>
  )
}

export const MedicalCompanies = ({
  offers,
  name,
  handleChange,
  defaultValue = '',
  id = '',
  includeCovidRisk,
}: CompaniesProps): JSX.Element => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const [open, setOpen] = useState({})
  const { translate } = useTranslation()
  const watchCompany = watch('companyName')

  useEffect(() => {
    if (!watchCompany) {
      return
    }

    const offer = (offers as MedicalOfferPrice[]).find((item) => item.company === watchCompany)
    if (!offer) {
      return
    }

    setValue('price', offer.price)
    setValue('priceEUR', offer.priceEUR)
    setValue('region', offer.region)
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
                    <div
                      key={offer.company}
                      className={`w-full space-y-2 ${
                        open[index] ? 'border border-gray-200 rounded-sm' : 'rounded-sm'
                      }`}
                    >
                      <FormControlLabel
                        sx={{
                          alignItems: 'center !important',
                          borderColor: '#B8C8D9',
                          width: '100%',
                          margin: '0 auto',
                          height: '56px',
                        }}
                        className={`${open[index] ? 'border-b' : 'border rounded-sm'}`}
                        value={offer?.company}
                        control={<IsgRadio />}
                        label={
                          <IsgLabel
                            open={open[index]}
                            setOpen={() => setOpen({ ...open, [index]: !open[index] })}
                            priceEUR={offer?.priceEUR}
                            price={offer?.price}
                            companyName={offer?.company}
                          />
                        }
                        inputRef={ref}
                      ></FormControlLabel>
                      {open[index] && (
                        <div className="px-3 pb-2 space-y-1">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: translate(`${offer.company}:coverage`),
                            }}
                          />
                          {includeCovidRisk &&
                            translate(`${offer?.company}:covidInfo`) !==
                              `${offer.company}:covidInfo` && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: translate(`${offer.company}:covidInfo`),
                                }}
                              />
                            )}
                        </div>
                      )}
                    </div>
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
