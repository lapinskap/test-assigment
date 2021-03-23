import PropTypes from 'prop-types';
import React from 'react';

import DataTable from '../../../../../../Components/DataTable';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';

export default function AvailableBenefits({ data, onChange }) {
  return (
    <DataTable
      id="benefitsClusterListing"
      columns={columns(data, onChange)}
      data={mockData}
      filterable
      showPagination={false}
    />
  );
}

const columns = (data, onChange) => [
  {
    Header: 'Dodaj',
    accessor: 'id',
    Cell: (cellInfo) => (
      data.available_benefits ? (
        <div className="d-block w-100 text-center">
          <ToggleSwitch
            checked={data.available_benefits[cellInfo.row.id]}
            handleChange={((value) => {
              onChange(cellInfo.row.id, value);
            })}
          />
        </div>
      ) : null
    ),
  },
  {
    Header: 'Nazwa',
    accessor: 'name',
  },
  {
    Header: 'Link',
    accessor: 'link',
  },
];

const mockData = [
  {
    id: '1',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '2',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '3',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '4',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '5',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '6',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '7',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '8',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '9',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '10',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '11',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '12',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '13',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '14',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '15',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '16',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '17',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '18',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '19',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '20',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '21',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '22',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '23',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '24',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '25',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '26',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '27',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '28',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '29',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '30',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '31',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '32',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '33',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '34',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '35',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '36',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
  {
    id: '37',
    name: 'sport i rekreacja - Pływalnia Powiatowa w Rykach 1',
    link: 'universal-codes.html?bnid=284498610',
  },
  {
    id: '38',
    name: 'Kino Centrum - Przemyśl',
    link: 'universal-codes.html?bnid=235057247',
  },
  {
    id: '39',
    name: 'Ośrodek Narciarski Suche',
    link: 'universal-codes.html?bnid=656576575',
  },
  {
    id: '40',
    name: 'T&T Zielenic - Szkółka Narciarska',
    link: 'universal-codes.html?bnid=12343543',
  },
];

AvailableBenefits.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
