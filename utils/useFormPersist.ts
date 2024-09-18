import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { pathTranslations } from '~/components/translatedLink/translatedLink';
import { useTranslation } from '~/context/LanguageContext';
import { MedicalPerson } from '~/modules/medical/types';
import { InsuranceType } from '~/modules/shared/types/insurance';

const PAGE_KEY = {
  [InsuranceType.MEDICAL]: '/medical',
  [InsuranceType.GREEN_CARD]: '/green-card',
  [InsuranceType.RCA]: '/rca',
  [InsuranceType.MEDICAL_OPTIONAL]: '/medical-optional',
  [InsuranceType.REAL_ESTATE]: '/ipoteca',
  [InsuranceType.RO_VIGNETTE]: '/rovinieta',
  [InsuranceType.BAGGAGE]: '/bagaj',
  [InsuranceType.ROAD_TAX]: '/taxa-de-drum',
  [InsuranceType.ROAD_SIDE_ASSISTANCE_EU]: '/asistenta-rutiera-ue',
};

const excludedFields = [
  'price',
  'priceRON',
  'priceEUR',
  'carModel',
  'plateNumber',
  'contractorName',
  'validData',
  'companyName',
  'companies',
  'region',
  'externalContract',
  'ownership',
];

export const useFormPersist = (
  name,
  preOrderId,
  { watch, setValue },
  { exclude = ['email', 'phone'] as string[] } = {}
) => {
  const router = useRouter(); // For navigation
  const searchParams = useSearchParams(); // For query params
  const [storage, setStorage] = useState(watch());
  const watchForm = { ...storage, ...watch() };
  const getAllExcludedFields = () => [...exclude, ...excludedFields];
  const getStorage = () => window.sessionStorage;

  const setSpecificValues = (values, key) => {
    if (isDate(key) && values[key]) {
      setValue(key, new Date(values[key]));
    } else if (isPersonalDataConsent(key)) {
      setValue(key, false);
    } else if (
      isPersons(key) &&
      [InsuranceType.MEDICAL, InsuranceType.MEDICAL_OPTIONAL].includes(name)
    ) {
      const persons = parseMedicalPersons(values[key]);
      setValue(key, persons);
    }
  };

  useEffect(() => {
    if (!preOrderId) {
      const renew = searchParams.get('renew') === 'true';
      const suffix = renew ? '-renew' : '';
      const storageData = getStorage().getItem(`${name + suffix}`);
      if (storageData) {
        const values = JSON.parse(storageData);
        Object.keys(values).forEach((key) => {
          const shouldSet = !getAllExcludedFields().includes(key);
          if (shouldSet) {
            setValue(key, values[key]);
            setSpecificValues(values, key);
          }
        });

        setStorage(values);
      }
    }
  }, [name]);

  useEffect(() => {
    if (!preOrderId) {
      const renew = searchParams.get('renew') === 'true';
      const suffix = renew ? '-renew' : '';
      const storageForm = watchForm;
      Object.keys(watchForm).forEach((key) => {
        if (excludedFields.includes(key)) {
          delete watchForm[key];
          if (name === InsuranceType.MEDICAL && !storageForm.isMultipleType) {
            delete storageForm.insuranceValidity;
            delete storageForm.insuredDays;
          }
        }
      });

      getStorage().setItem(`${name + suffix}`, JSON.stringify(storageForm));
    }
  }, [JSON.stringify(watchForm)]);

  return {
    watchForm,
    clearStorage: () => getStorage().clear(),
  };
};

export const useExtendInsurance = (name, details) => {
  const router = useRouter(); // For navigation
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useTranslation();

  const getStorage = () => window.sessionStorage;

  const setSpecificValues = (values, key) => {
    if (isDate(key) && values[key]) {
      return { [key]: key === 'birthday' ? values[key].toDate() : null };
    } else if (isPersonalDataConsent(key)) {
      return { [key]: false };
    } else if (
      isPersons(key) &&
      [InsuranceType.MEDICAL, InsuranceType.MEDICAL_OPTIONAL].includes(name)
    ) {
      const persons = parseMedicalPersons(values[key], true);
      return { [key]: persons };
    } else if (isJsonValue(key) && name === InsuranceType.MEDICAL) {
      return {
        [key]: JSON.stringify({
          activities: values[key].activities,
          name: values[key].name,
        }),
      };
    } else if (isValidity(key) && name === InsuranceType.MEDICAL) {
      return { [key]: '' };
    }
  };

  const renewInsurance = () => {
    setIsLoading(true);
    let values = details;
    Object.keys(values).forEach((key) => {
      const shouldSet = !excludedFields.includes(key);
      if (shouldSet) {
        values = { ...values, ...setSpecificValues(values, key) };
      } else {
        delete values[key];
      }
    });

    getStorage().setItem(`${name}-renew`, JSON.stringify(values));
    const translatedLink =
      pathTranslations?.[PAGE_KEY[name]]?.[locale] || PAGE_KEY[name];
    router.push(`${translatedLink}?renew=true`);
    setIsLoading(false);
  };

  return {
    renewInsurance,
    isLoading,
  };
};

const isDate = (key) =>
  [
    'documentDate',
    'startDate',
    'endDate',
    'birthday',
    'vignetteStartDate',
    'departureDate',
  ].includes(key);
const isJsonValue = (key) => ['tripPurpose', 'contractor'].includes(key);
const isPersonalDataConsent = (key) => key === 'personalDataConsent';
const isPersons = (key) => key === 'persons';
const isValidity = (key) =>
  key === 'insuredDays' || key === 'insuranceValidity';

const parseMedicalPersons = (persons: any, renew = false): MedicalPerson[] => {
  const newPersons = [] as MedicalPerson[];
  Object.keys(persons).forEach((key) => {
    newPersons[key] = renew
      ? {
          ...persons[key],
          birthday: persons[key].birthday.toDate(),
          passport: [
            persons[key].passportSeries?.toUpperCase?.() || '',
            persons[key].passportNumber,
          ].join(''),
        }
      : {
          ...persons[key],
          birthday: new Date(persons[key].birthday),
          passport: [
            persons[key].passportSeries?.toUpperCase?.() || '',
            persons[key].passportNumber,
          ].join(''),
        };
  });
  return newPersons;
};
