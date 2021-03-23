import React, {
  useCallback, useState,
} from 'react';
import Form from '../../../../../Components/Form';

export default function Legacy() {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
  }, [data]);

  return (
    <Form
      id="legacyForm"
      data={data}
      config={{
        title: 'Pola niewykorzystawne, prawdopodobnie do usuniecia',
        stickyTitle: true,
        buttons: [
          {
            size: 'lg',
            color: 'success',
            className: 'mr-2',
            text: 'Zapisz',
            onClick: () => {
            },
          },
        ],
        defaultOnChange: onChange,
        formGroups: [
          {
            formElements: [
              {
                id: 'customerCategory',
                dataOldSk: 'customerCategory',
                label: 'Kategoria',
                type: 'radio',
                options: [
                  { value: 'customerCategory1', label: 'A' },
                  { value: 'customerCategory2', label: 'B' },
                  { value: 'customerCategory3', label: 'C' },
                ],
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      A, B, C - kiedyś miało być wykorzystywane do podzielenia kategorii firm aby ułatwić wyszukiwanie itp ale
                      {' '}
                      <br />
                      ostatecznie funkcjonalność nie jest użyta a w dokumentacji jest wprost napisane żeby tutaj zawsze ustawiać "A"
                    </>
                  ),
                },
              },
              {
                id: 'companySignature',
                dataOldSk: 'companySignature',
                label: 'Firmowy podpis',
                type: 'textarea',
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      Kiedyś miało być wykorzystywane w podpisach e-mail, do weryfikacji czy w ogóle któraś firma z tego korzysta;
                      obecnie nie jest uzupełniane
                    </>
                  ),
                },
              },
              {
                id: 'invoiceForBusinessStaff',
                dataOldSk: 'invoiceForBusinessStaff',
                label: 'Faktury dla współpracowników zatrudnionych jako działalność',
                type: 'boolean',
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      Niewykorzystywane w żadnej firme
                    </>
                  ),
                },
              },
              {
                id: 'invoiceNumberPrefix',
                dataOldSk: 'invoiceNumberPrefix',
                label: 'Początek numerów faktur',
                type: 'text',
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      Było wykorzystywane przy polu "Faktury dla współpracowników zatrudnionych jako d
                      ziałalność" obecnie niewykorzystywane w ogóle
                    </>
                  ),
                },
              },
              {
                id: 'benefitScope',
                dataOldSk: 'benefitScope',
                label: 'Zakres świadczeń',
                type: 'radio',
                options: [
                  { value: 'benefitScope1', label: 'Abonamentówka + jednorazowe' },
                  { value: 'benefitScope2', label: 'Abonamentówka tylko pracownik + jednorazow' },
                  { value: 'benefitScope3', label: 'Tylko jednorazowe' },
                ],
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      Kiedyś za pomocą tego były rozróżniane funkcjonalności, które mają firmy, obecnie tak na
                      prawdę wynika to z konfiguracji i pozostałych ustawień;
                      {' '}
                      <br />
                      instrukcja nie przewiduje innej opcji niż pierwsza więc domniemujemy, że to pole martwe. Obecnie niewykorzystywane.
                      {' '}
                      <br />
                      Do weryfikacji czy gdziekolwiek jest ustawiona inna opcja.
                    </>
                  ),
                },
              },
              {
                label: 'Wyłączenie możliwości płatności za świadczenia jednorazowe',
                id: 'benefitsInActive',
                dataOldSk: 'benefitsInActive',
                type: 'dateRange',
                onChange: onRangeChange,
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      prawdopodobnie nie jest wykorzystywane, do usunięcia
                      {' '}
                      <br />
                      Do weryfikacji czy gdziekolwiek jest używane.
                    </>
                  ),
                },
              },
              {
                id: 'showAcceptAgreement5',
                dataOldSk: 'showAcceptAgreement5',
                label: 'Wymagaj wprowadzenia emaila lub numeru telefonu',
                type: 'boolean',
                tooltip: {
                  type: 'legacy',
                  content: (
                    <>
                      Pole nie jest już wykorzystywane
                    </>
                  ),
                },
              },
            ],
          },
          {
            title: '  Konfiguracja OK System',
            tooltip: {
              type: 'legacy',
              content: (
                <>
                  Było wykorzysytwane przy starych klientach, obecnie nie jest.
                </>
              ),
            },
            formElements: [
              {
                id: 'maxVoucherQuantity',
                dataOldSk: 'maxVoucherQuantity',
                label: 'Maksymalna ilość karnetów które może kupić pracownik dla innych osób',
                type: 'number',
              },
              {
                id: 'maxVoucherChildrenQuantity',
                dataOldSk: 'maxVoucherChildrenQuantity',
                label: 'Maksymalna ilość karnetów które może kupić pracownik dla dzieci',
                type: 'number',
              },
              {
                id: 'okSystemStartDay',
                dataOldSk: 'okSystemStartDay',
                label: 'Dzień rozpoczęcia (dzień przełomu) korzystania z karnetu OK System (od 1 do 28)',
                type: 'number',
                props: {
                  min: 1,
                  max: 28,
                },
              },
              {
                id: 'okSystemPaymentDay',
                dataOldSk: 'okSystemPaymentDay',
                label: 'Dzień naliczania płatności za karnety OK System (od 1 do 28)',
                type: 'number',
                props: {
                  min: 1,
                  max: 28,
                },
              },
              {
                id: 'paymentDateOkSystemConfiguration',
                dataOldSk: 'paymentDateOkSystemConfiguration',
                label: 'Data płatności za dany miesiąc obowiązywania karnetu',
                type: 'radio',
                options: [
                  { value: 'paymentDateOkSystemConfiguration1', label: 'na bieżąco, z pierwszym dniem danego miesiąca' },
                  { value: 'paymentDateOkSystemConfiguration2', label: 'zaliczkowo, w miesiącu poprzednim z dniem (od 1 do 28)' },
                ],
              },
              {
                id: 'okSystemPaymentEffectiveDay',
                dataOldSk: 'okSystemPaymentEffectiveDay',
                type: 'number',
                depends: {
                  field: 'paymentDateOkSystemConfiguration',
                  value: 'paymentDateOkSystemConfiguration2',
                },
                props: {
                  min: 1,
                  max: 28,
                },
              },
              {
                id: 'okSystemDeactivationSensitive',
                dataOldSk: 'okSystemDeactivationSensitive',
                label: 'Wrażliwość karnetów na dzień przełomu dla zdarzenia "Dezaktywacja pracownika":',
                type: 'boolean',
              },
            ],
          },
          {
            tooltip: {
              type: 'legacy',
              content: (
                <>
                  Było wykorzysytwane przy starych klientach, obecnie nie jest.
                </>
              ),
            },
            title: 'Konfiguracja MultiSport',
            formElements: [
              {
                id: 'maxMultisportQuantity',
                dataOldSk: 'maxMultisportQuantity',
                label: 'Maksymalna ilość karnetów które może kupić pracownik dla innych osób',
                type: 'number',
              },
              {
                id: 'maxMultisportChildrenQuantity',
                dataOldSk: 'maxMultisportChildrenQuantity',
                label: 'Maksymalna ilość karnetów które może kupić pracownik dla dzieci',
                type: 'number',
              },
              {
                id: 'multisportStartDay',
                dataOldSk: 'multisportStartDay',
                label: 'Dzień rozpoczęcia (dzień przełomu) korzystania z karnetu MultiSport (od 1 do 28)',
                type: 'number',
                props: {
                  min: 1,
                  max: 28,
                },
              },
              {
                id: 'multisportPaymentDay',
                dataOldSk: 'multisportPaymentDay',
                label: 'Dzień naliczania płatności za karnety MultiSport (od 1 do 28)',
                type: 'number',
                props: {
                  min: 1,
                  max: 28,
                },
              },
              {
                id: 'paymentDateOkSystemConfiguration',
                dataOldSk: 'paymentDateOkSystemConfiguration',
                label: 'Data płatności za dany miesiąc obowiązywania karnetu',
                type: 'radio',
                options: [
                  { value: 'paymentDateOkSystemConfiguration1', label: 'na bieżąco, z pierwszym dniem danego miesiąca' },
                  { value: 'paymentDateOkSystemConfiguration2', label: 'zaliczkowo, w miesiącu poprzednim z dniem (od 1 do 28)' },
                ],
              },
              {
                id: 'multisportPaymentEffectiveDay',
                dataOldSk: 'multisportPaymentEffectiveDay',
                type: 'number',
                depends: {
                  field: 'paymentDateOkSystemConfiguration',
                  value: 'paymentDateOkSystemConfiguration2',
                },
                props: {
                  min: 1,
                  max: 28,
                },
              },
              {
                id: 'multisportDeactivationSensitive',
                dataOldSk: 'multisportDeactivationSensitive',
                label: 'Wrażliwość karnetów na dzień przełomu dla zdarzenia "Dezaktywacja pracownika":',
                type: 'boolean',
              },
            ],
          },
          {
            tooltip: {
              type: 'legacy',
              content: (
                <>
                  Nie jest wykorzystywane
                </>
              ),
            },
            title: 'Konfiguracja wspólna dla OK System i MultiSport',
            formElements: [
              {
                id: 'waitingRoom',
                dataOldSk: 'waitingRoom',
                label: 'Poczekalnia (karnety współfinansowane oraz finansowane przez pracownika)',
                type: 'boolean',
              },
            ],
          },
          {
            tooltip: {
              type: 'legacy',
              content: (
                <>
                  Nie jest wykorzystywane
                </>
              ),
            },
            title: 'Konfiguracja karty sportowej',
            formElements: [
              {
                id: 'dateShift',
                dataOldSk: 'dateShift',
                label: 'Przesunięcie daty P i R (w dniach)',
                type: 'number',
              },
            ],
          },
          {
            tooltip: {
              type: 'legacy',
              content: (
                <>
                  Nie jest wykorzystywane
                </>
              ),
            },
            title: 'Przeniesione z zakładki banki punktów',
            formElements: [
              {
                id: 'includeContractors',
                dataOldSk: 'includeContractors',
                label: 'Uwzględnij zleceniobiorców w raportach',
                type: 'boolean',
              },
              {
                id: 'includeContractWorkers',
                dataOldSk: 'includeContractWorkers',
                label: 'Uwzględnij pracowników kontraktowych w raportach',
                type: 'boolean',
              },
            ],
          },
        ],
      }}
    />
  );
}
