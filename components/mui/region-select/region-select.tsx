import React from 'react'
import { matchSorter } from 'match-sorter'
import { Controller, useFormContext } from 'react-hook-form'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { getAllRegionOptions, RESTRICTED_COUNTRIES } from './region-select.const'
import { useTranslation } from '~/context/LanguageContext'

type Option = {
  name: string
  value: string[]
  group?: string
}

export const RegionSelect = ({ control, errorMessage, setValue }) => {
  const { translate } = useTranslation()
  const { watch } = useFormContext()

  const selectedOptions = watch('regions')

  const handleSelectionChange = (newValue) => {
    if (newValue.length > 0) {
      const lastSelected = newValue[newValue.length - 1]

      newValue = newValue.filter((option) => {
        if (option.name === lastSelected.name) {
          return true
        }

        return !option.value.every((country) => lastSelected.value.includes(country))
      })
    }

    setValue('regions', newValue)
    setValue('territories', getCountriesFromRegions(newValue, translate))
  }

  const excludeSelectedRegions = (options: Option[]) =>
    options.filter(
      (option) =>
        !selectedOptions.some((selectedOption) =>
          option.value.every((country) => selectedOption.value.includes(country))
        )
    )

  const filterOptions = (options: Option[], { inputValue }) => {
    if (!inputValue) {
      return excludeSelectedRegions(options)
    }

    const matchingOptions = matchSorter(options, inputValue, {
      keys: [(option) => [translate(option.name), option.name].join(',')],
    })

    if (matchingOptions.length > 0) {
      const restrictedCountries = matchingOptions.filter((el) => el.group)
      return [
        ...excludeSelectedRegions(matchingOptions.filter((el) => !el.group)),
        ...restrictedCountries,
      ]
    }

    return []
  }

  return (
    <div>
      <Controller
        name="regions"
        control={control}
        defaultValue={[]}
        render={({ field: { onBlur, ref }, fieldState: { error } }) => {
          return (
            <Autocomplete
              multiple
              onChange={(_, newValue) => {
                handleSelectionChange?.(newValue)
              }}
              value={selectedOptions}
              onBlur={onBlur}
              options={getAllRegionOptions()}
              getOptionLabel={(option) => translate(option.name)}
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={translate('travel-destination')}
                  fullWidth
                  inputRef={ref}
                  error={!!error}
                />
              )}
              getOptionDisabled={(val) => RESTRICTED_COUNTRIES.includes(val.name)}
              groupBy={(el) => translate((el as any).group)}
              isOptionEqualToValue={(option, value) => option.name === value.name}
            />
          )
        }}
        rules={{
          required: {
            value: true,
            message: translate(`regions:required`),
          },
        }}
      />
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  )
}

const getCountriesFromRegions = (regions: { name: string; value: string[] }[], translate: any) => {
  const concatenatedCountries = regions.reduce(
    (acc: string[], curr: { name: string; value: string[] }) => acc.concat(curr.value),
    []
  )

  const zoneKey = regions.reduce(
    (acc: string[], curr: { name: string; value: string[] }) => acc.concat(curr.name),
    []
  )

  const zoneValues = zoneKey?.map((el) => translate(el, 'common', 'en').toUpperCase()).join(',')

  return { countries: Array.from(new Set(concatenatedCountries)), zoneKey, zoneValues }
}
