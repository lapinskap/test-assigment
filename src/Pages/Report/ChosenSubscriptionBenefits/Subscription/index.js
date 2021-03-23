import React from 'react';
import Report, { generateFakeReportData } from '../../../../Components/Report';

export default () => {
  const getResult = async () => generateFakeReportData(resultConfig);

  return (
    <Report
      isCompanyDepended
      companyDataFetch={() => {}}
      title="Raport wybranch świadczeń abonamentowych"
      submitMethod={getResult}
      resultConfig={resultConfig}
      groupsAsColumns
      formGroups={[
        {
          formElements: [
            {
              id: 'realizationDate',
              label: 'Świadczenia za okres',
              type: 'dateRange',
            },
            {
              id: 'benefitDateFrom',
              label: 'Świadczenia za okres',
              type: 'dateRange',
            },
            {
              id: 'organizationUnitSelectId',
              label: 'Jednostka organizacyjna',
              type: 'select',
              options: [
                { value: 'industry1', label: 'Test 1' },
              ],
            },
            {
              id: 'groupId',
              label: 'Grupy pracowników',
              type: 'checkbox',
              options: [
                { value: 'group1', label: 'Pracownicy' },
                { value: 'group2', label: 'Byli pracownicy' },
              ],
            },
          ],
        },
        {
          formElements: [
            {
              id: 'productCategoryId',
              label: 'Kategoria świadczenia',
              type: 'select',
              options: [
                { value: 'all', label: 'wszystkie' },
                { value: 'category1', label: 'Bank punktów' },
                { value: 'category2', label: 'Edukacja' },
                { value: 'category3', label: 'Gastronomia' },
              ],
            },
            {
              id: 'payerTypeSelect',
              label: 'Świadczenia płatne przez',
              type: 'select',
              options: [
                { value: 'all', label: 'wszystkie' },
                { value: 'type1', label: 'Pracodawca' },
                { value: 'type2', label: 'PRacownik' },
              ],
            },
            {
              id: 'rentableGroupIdSelect',
              label: 'Grupa dochodowości',
              type: 'select',
              options: [
                { value: 'all', label: 'wszystkie' },
                { value: 'group1', label: 'Grupa I' },
                { value: 'group2', label: 'Grupa II' },
              ],
            },
            {
              id: 'firstname',
              label: 'Imię',
              type: 'text',
            },
            {
              id: 'lastname',
              label: 'Nazwisko',
              type: 'text',
            },
            {
              id: 'fk_number',
              label: 'Numer FK',
              type: 'text',
            },
          ],
        },
      ]}
    />
  );
};

const resultConfig = [
  { accessor: 'field1', Header: 'Numer użytkownika' },
  { accessor: 'field2', Header: 'Imię' },
  { accessor: 'field3', Header: 'Nazwisko' },
  { accessor: 'field4', Header: 'Grupa' },
  { accessor: 'field5', Header: 'Grupa dochodowości' },
  { accessor: 'field6', Header: 'Jednostka organizacyjn' },
  { accessor: 'field7', Header: 'Mpk' },
  { accessor: 'field8', Header: 'Firma zatrudnienia' },
  { accessor: 'field9', Header: 'Nazwisko' },
  { accessor: 'field10', Header: 'Kategoria świadczenia' },
  { accessor: 'field11', Header: 'Dostawca' },
  { accessor: 'field12', Header: 'Obciążenie' },
  { accessor: 'field13', Header: 'Czy ubbruttowiony/zwolniony z opodatk.' },
  { accessor: 'field14', Header: 'Całkowity koszt świadczenia' },
  { accessor: 'field15', Header: 'Pracodawca' },
  { accessor: 'field16', Header: 'Pracownik' },
  { accessor: 'field17', Header: 'Data przystąpienia' },
  { accessor: 'field18', Header: 'Data rezygnacji' },
];
