import { differenceInCalendarDays } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { ResponsiveDatePicker } from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { useTranslation } from '~/context/LanguageContext'

export const RcaDocumentDatePicker = ({ documentDate }): JSX.Element => {
  const { translate } = useTranslation()

  const { control, clearErrors, setValue, trigger } = useFormContext()

  const documentDateOptions = {
    label: translate('driver:document-date'),
    name: 'documentDate',
    inputFormat: 'dd.MM.yyyy',
    value: documentDate,
    disableFuture: true,
    maxDate: new Date(),
    control: control,
    mask: '__.__.____',
    onChange: async (date) => {
      clearErrors('documentDate')
      setValue('documentDate', date)
      await trigger('documentDate')
    },
    isFuture: (date) => !(differenceInCalendarDays(date, new Date()) > 0),
  }

  return <ResponsiveDatePicker {...documentDateOptions} />
}
