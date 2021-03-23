import React from 'react';
import AppMessagesList from './list';

const getUrlToForm = (id) => `/notification/app-messages/${id}`;

export default function List() {
  return (
    <AppMessagesList
      companyScope={false}
      getUrlToForm={getUrlToForm}
      breadcrumbs={[
        { title: 'Powiadomienia', link: '/notification' },
      ]}
    />
  );
}
