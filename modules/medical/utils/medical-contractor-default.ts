import { differenceInYears } from 'date-fns'
import { ContractorType } from '~/modules/shared/types/insurance'
import { normalizeDate } from '~/utils/normalizeDate'

export const contractorDefaultValue = (persons) =>
  [
    ...persons
      .filter((value) => differenceInYears(new Date(), value.birthday) >= 18)
      .map((el) => {
        return { fullName: el.fullName, idnx: el.idnp, contractorType: ContractorType.INDIVIDUAL }
      }),
    { fullName: '', idnx: '', contractorType: ContractorType.COMPANY },
    { fullName: '', idnx: '', contractorType: ContractorType.INDIVIDUAL, id: 'another' },
  ][0]

export const medicalOptionalContractorDefault = (persons) =>
  [
    ...persons
      .filter((value) => differenceInYears(new Date(), normalizeDate(value.birthday) as Date) >= 18)
      .map((el) => {
        return {
          fullName: el.fullName,
          idnx: el.idnp,
          contractorType: ContractorType.INDIVIDUAL,
          address: el.address,
        }
      }),
    { fullName: '', idnx: '', contractorType: ContractorType.COMPANY, address: '' },
  ][0]
