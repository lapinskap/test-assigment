export const rootBreadcrumb = { title: 'Firma', link: '/company' };
export const getCompanyBaseBreadcrumbs = (companyId, companyName) => [rootBreadcrumb, { title: 'Lista firm', link: '/company/list' },
  { title: `Zarządzanie firmą ${companyName} (${companyId})`, link: `/company/edit/${companyId}` },
];
