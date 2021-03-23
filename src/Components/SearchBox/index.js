import React, {
  useState, useEffect, useContext, useRef, Fragment,
} from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loader as LoaderAnim } from 'react-loaders';
import RbsContext from '../../utils/RoleBasedSecurity/RbsContext';
import {
  findMenuItems, findCompanies, findEmployees, findProducts, findTourismObjects,
} from './filters';
import useHasPermission from '../../utils/hooks/security/useHasPermission';
import { companyCompanyPermissionRead } from '../../utils/RoleBasedSecurity/permissions';

export async function findData(inputText, setResult, filter) {
  if (inputText && inputText.length > 1) {
    try {
      const result = await filter(inputText);
      setResult(result);
    } catch (e) {
      console.error(e);
    }
  }
}

export default function SearchBox() {
  const [inputText, setInputText] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [tourismObjects, setTourismObjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const rbsContext = useContext(RbsContext);
  const dropdown = useRef(null);
  const hasCompanyReadPermission = useHasPermission(companyCompanyPermissionRead);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputText) {
        setIsSearching(true);
        setShowSuggestions(true);
        const newMenuItems = findMenuItems(inputText, rbsContext);
        setMenuItems(newMenuItems);
        const requests = [];
         if (hasCompanyReadPermission) {
          requests.push(findData(inputText, setCompanies, findCompanies));
          requests.push(findData(inputText, setProducts, findProducts));
          requests.push(findData(inputText, setTourismObjects, findTourismObjects));
        }
        Promise.all(requests).then(() => setIsSearching(false));
      } else {
        setShowSuggestions(false);
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [inputText, rbsContext, hasCompanyReadPermission]);

  const toggle = (e) => {
    setShowSuggestions(dropdown.current.contains(e.target));
  };
  const foundSuggestions = Boolean(menuItems.length || companies.length || employees.length || products.length || tourismObjects.length);
  const suggestions = [
    { scope: 'Firmy', elements: companies },
    { scope: 'Pracownicy', elements: employees },
    { scope: 'Produkty', elements: products },
    { scope: 'Obiekty turystyczne', elements: tourismObjects },
    { scope: 'Menu', elements: menuItems },
  ];

  return (
    <div ref={dropdown}>
      <Dropdown isOpen={Boolean(showSuggestions && foundSuggestions)} toggle={toggle}>
        <div className="search-wrapper active">
          <div className="input-holder">
            <input
              data-t1="searchBox"
              onFocus={() => setShowSuggestions(true)}
              value={inputText}
              type="text"
              className="search-input"
              placeholder="Wpisz czego szukasz..."
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="button" className="search-icon">
              {isSearching ? <LoaderAnim color="#545cd8" type="ball-clip-rotate" active /> : <span />}
            </button>
          </div>
        </div>
        <DropdownToggle color="primary" tag="span" />
        <DropdownMenu className="dropdown-menu-hover-primary" data-t1="searchBoxResult">
          {suggestions.map(({ scope, elements }) => (elements && elements.length ? (
            <Fragment key={scope}>
              <DropdownItem header>{scope}</DropdownItem>
              {elements.map(({ to, label }, itemKey) => (
                <Link
                  to={to}
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={itemKey}
                  className="text-decoration-none"
                  onClick={() => setShowSuggestions(false)}
                >
                  <DropdownItem>
                    {label}
                  </DropdownItem>
                </Link>
              ))}
            </Fragment>
          ) : null))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
