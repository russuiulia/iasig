import dynamic from 'next/dynamic'

const ReactSelect = dynamic(() => import('react-select'), { ssr: false })
export interface IsgSelectProps {
  defaultValue?: any
  name: string
  options: any
  onChange?: any
  required?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  value?: any
  id?: string
  classNamePrefix?: string
  isClearable?: boolean
  placeholder?: string
  formatOptionLabel?: any
  field?: any
  control?: any
}

export const IsgSelect = ({
  options,
  defaultValue,
  onChange,
  name,
  value,
  required = true,
  isSearchable = false,
  isMulti = false,
  id,
  classNamePrefix = 'select',
  placeholder = '',
  isClearable = false,
  formatOptionLabel,
  field,
  control,
}: IsgSelectProps): JSX.Element => {
  const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const formatGroupLabelConst = (data) => (
    <>
      <div style={groupStyles}>
        <span>{data.label}</span>
      </div>
    </>
  )
  return (
    <ReactSelect
      {...field}
      placeholder={placeholder}
      isClearable={isClearable}
      formatGroupLabel={formatGroupLabelConst}
      options={options}
      rules={{ required }}
      onChange={(e) => {
        onChange(e)
        field?.onChange?.(e)
      }}
      name={name}
      isSearchable={isSearchable}
      defaultValue={defaultValue}
      value={field?.value || value}
      isMulti={isMulti}
      classNamePrefix={classNamePrefix}
      id={id}
      register
      control={control}
      formatOptionLabel={formatOptionLabel}
    />
  )
}
