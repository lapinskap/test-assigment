import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Button, CardHeader,
  CustomInput, Label,
} from 'reactstrap';
import usePermissions from '../../../../../../utils/hooks/permissions/useRolePermissions';
import DefaultTooltip from '../../../../../../Components/Tooltips/defaultTooltip';
import __ from '../../../../../../utils/Translations';
import arrayUnique from '../../../../../../utils/jsHelpers/arrayUnique';
import { getUserConfirmationPopup } from '../../../../../../Components/UserConfirmationPopup';

const PERMISSIONS_ROLE_SCOPE_SEPARATOR = ':';

const Permissions = ({ selectedPermissions, updateFormData, role }) => {
  const [dependencyMap, setDependencyMap] = useState({});
  const wrapper = useRef();
  const permissions = usePermissions(role);

  useEffect(() => {
    const newDependencyMap = {};
    permissions.forEach(({ code, scope, require }) => {
      if (require) {
        require.forEach((el) => {
          if (!newDependencyMap[el]) {
            newDependencyMap[el] = [];
          }
          newDependencyMap[el].push(`${scope}${PERMISSIONS_ROLE_SCOPE_SEPARATOR}${code}`);
        });
      }
    });
    setDependencyMap(newDependencyMap);
  }, [permissions]);

  const selectedPermissionsStrings = selectedPermissions
    .map(({ scope, code }) => `${scope}${PERMISSIONS_ROLE_SCOPE_SEPARATOR}${code}`);

  const onChange = (field, selected) => {
    let newPermissions = [...selectedPermissionsStrings];
    let additionalChanges;
    if (selected) {
      const requirements = getRequirements(field, permissions);
      newPermissions = [...newPermissions, field, ...requirements];
      additionalChanges = newPermissions.filter((el) => el !== field && !selectedPermissionsStrings.includes(el));
    } else {
      const dependencies = getDependencies(field, dependencyMap);
      newPermissions = newPermissions.filter((el) => el !== field && !dependencies.includes(el));
      additionalChanges = selectedPermissionsStrings.filter((el) => el !== field && !newPermissions.includes(el));
    }
    updateDataWithConfirmation(newPermissions, selected, additionalChanges);
  };

  const updateDataWithConfirmation = useCallback((newPermissions, select, additionalChanges = []) => {
    const execute = () => updateFormData(
      'permissions',
      newPermissions.filter(arrayUnique).map((el) => {
        const [scope, code] = splitPermissionString(el);
        return { scope, code };
      }),
    );
    if (additionalChanges.length > 0) {
      getUserConfirmationPopup(
        (
          <div>
            <div>{`${select ? __('Wraz z tą zmianą zostaną zaznaczone') : __('Wraz z tą zmianą zostaną odznaczone')}: `}</div>
            <ul>
              {additionalChanges.map((el) => {
                const permission = permissions.find(({ scope: elScope, code: elCode }) => `${elScope}:${elCode}` === el);
                return <li key={el}>{permission?.label || el}</li>;
              })}
            </ul>
          </div>
        ),
        (confirm) => confirm && execute(),
        __('Czy jesteś pewien?'),
      );
    } else {
      execute();
    }
  }, [updateFormData, permissions]);

  const selectAll = () => updateFormData('permissions', permissions
    .filter(({ type, scope }) => type !== 'radio')
    .map(({ scope: elScope, code: elCode }) => ({ scope: elScope, code: elCode })));

  const selectAllInScope = (scope) => {
    const toSelect = [];
    const additionalChanges = [];
    permissions.forEach(({ scope: elScope, code: elCode }) => {
      if (scope === elScope) {
        const field = `${elScope}${PERMISSIONS_ROLE_SCOPE_SEPARATOR}${elCode}`;
        toSelect.push(field);
        const requirements = getRequirements(field, permissions);
        requirements.forEach((el) => {
          const [requirementScope] = splitPermissionString(el);
          if (requirementScope !== scope && !selectedPermissionsStrings.includes(el)) {
            toSelect.push(el);
            if (!additionalChanges.includes(el)) {
              additionalChanges.push(el);
            }
          }
        });
      }
    });
    const newPermissions = [...selectedPermissionsStrings, ...toSelect];
    updateDataWithConfirmation(newPermissions, true, additionalChanges);
  };
  const deselectAllInScope = (scope) => {
    const toDeselectScopeFields = selectedPermissionsStrings.filter((el) => el.startsWith(`${scope}${PERMISSIONS_ROLE_SCOPE_SEPARATOR}`));
    let newPermissions = selectedPermissionsStrings.filter((el) => !toDeselectScopeFields.includes(el));
    const additionalChanges = [];
    toDeselectScopeFields.forEach((field) => {
      const dependencies = getDependencies(field, dependencyMap);
      dependencies.forEach((el) => {
        if (newPermissions.includes(el)) {
          newPermissions = newPermissions.filter((permission) => permission !== el);
          if (!additionalChanges.includes(el)) {
            additionalChanges.push(el);
          }
        }
      });
    });
    updateDataWithConfirmation(newPermissions, false, additionalChanges);
  };

  const deselectAll = () => updateFormData('permissions', []);

  const onChangeRadio = (scope, selected) => {
    let newPermissions = [...selectedPermissionsStrings];
    newPermissions = newPermissions.filter((el) => {
      const [elScope] = splitPermissionString(el);
      return elScope !== scope;
    });
    newPermissions.push(selected);

    updateFormData(
      'permissions',
      newPermissions.map((el) => {
        const [elScope, code] = splitPermissionString(el);
        return { scope: elScope, code };
      }),
    );
  };

  let requiredOptions = [];
  selectedPermissionsStrings.forEach((el) => {
    requiredOptions = getRequirements(el, permissions, requiredOptions);
  });
  const groups = [];
  permissions.forEach(({
    groupLabel, label, code, scope, type, require = [],
  }) => {
    let group = groups.find(({ scope: groupScope }) => groupScope === scope);
    if (!group) {
      group = {
        scope,
        label: groupLabel,
        type: type === 'radio' ? 'radio' : 'checkbox',
        options: [],
      };
      groups.push(group);
    }
    const value = `${scope}${PERMISSIONS_ROLE_SCOPE_SEPARATOR}${code}`;
    const requiredPermissions = require?.length
      ? permissions.filter(({ scope: elScope, code: elCode }) => require.includes(`${elScope}:${elCode}`)) : [];

    group.options.push({
      require,
      label: require.length ? (
        <>
          {label}
          {' '}
          <DefaultTooltip
            id={`${scope}_${code}`.replace(':', '_')}
            content={(
              <>
                {__('Wymagane zależności')}
                :
                <ul>
                  {require.map((el) => {
                    const permission = requiredPermissions.find(({ scope: elScope, code: elCode }) => `${elScope}:${elCode}` === el);
                    return <li key={el}>{permission?.label || el}</li>;
                  })}
                </ul>
              </>
                        )}
          />
          {' '}
        </>
      ) : label,
      value,
      isRequired: requiredOptions.includes(value),
    });
  });
  if (!groups.length) {
    return null;
  }
  const wrapperWidth = wrapper?.current?.offsetWidth;
  return (
    <div>
      <CardHeader>
        <div className="">
          {__('Uprawnienia')}
        </div>
        <div className="btn-actions-pane-right">
          <Button
            data-t1="selectAll"
            outline
            className="mr-1"
            onClick={() => selectAll()}
          >
            {__('Zaznacz wszystko')}
          </Button>
          <Button
            data-t1="deselectAll"
            outline
            onClick={() => deselectAll()}
          >
            {__('Odznacz wszystko')}
          </Button>
        </div>
      </CardHeader>
      <div ref={wrapper} className="mt-2 permissions-flexbox" style={{ height: `${(20000 * permissions.length / wrapperWidth)}px` }}>
        {groups.map(({
          label, type, options, scope,
        }) => (
          <div className="m-2" key={scope} data-t1={scope}>
            <Label>
              <strong>
                {label}
                :
              </strong>
            </Label>
            { type !== 'radio' ? (
              <div>
                <Button
                  data-t1="selectAll"
                  outline
                  size="sm"
                  className="mr-1 mb-1"
                  onClick={() => selectAllInScope(scope)}
                >
                  {__('Zaznacz wszystko')}
                </Button>
                <Button
                  data-t1="deselectAll"
                  outline
                  size="sm"
                  className="mr-1 mb-1"
                  onClick={() => deselectAllInScope(scope)}
                >
                  {__('Odznacz wszystko')}
                </Button>
              </div>
            ) : null}
            {options.map(({
              value: optionValue, label: optionLabel, isRequired,
            }) => (
              <CustomInput
                key={optionValue}
                checked={selectedPermissionsStrings.includes(optionValue)}
                inline={false}
                type={type}
                id={optionValue}
                onChange={(e) => (type === 'radio'
                  ? onChangeRadio(scope, e.target.value)
                  : onChange(e.target.value, e.target.checked))}
                value={optionValue}
                name={type === 'radio' ? scope : optionValue}
                label={isRequired ? (
                  <span className="text-danger">
                    {optionLabel}
                  </span>
                ) : optionLabel}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const splitPermissionString = (item) => item.split(/:(.+)/);

function getRequirements(field, permissions, dataHolder = []) {
  const [scope, code] = splitPermissionString(field);
  let result = [...dataHolder];
  const permission = permissions.find(({ code: elCode, scope: elScope }) => elCode === code && elScope === scope);
  if (permission && permission.require) {
    permission.require.forEach((el) => {
      if (!result.includes(el)) {
        result.push(el);
        result = getRequirements(el, permissions, result);
      }
    });
  }
  return result;
}

function getDependencies(field, dependencyMap, dataHolder = []) {
  let result = [...dataHolder];
  if (dependencyMap[field]) {
    dependencyMap[field].forEach((el) => {
      if (!result.includes(el)) {
        result.push(el);
        result = getDependencies(el, dependencyMap, result);
      }
    });
  }

  return result;
}

Permissions.propTypes = {
  selectedPermissions: PropTypes.arrayOf(PropTypes.shape({
    scope: PropTypes.string,
    code: PropTypes.string,
  })).isRequired,
  updateFormData: PropTypes.func.isRequired,
  role: PropTypes.oneOf(['omb', 'ahr']).isRequired,
};

export default Permissions;
