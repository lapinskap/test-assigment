import React, { useState, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, FormGroup, Input, Label,
} from 'reactstrap';
import EditAttribute from './editAttributeOption';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { tourismTourismAttributePermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default function AttributeOptions({
  item, refreshData, deleteAttribute, objectAssign, assignedOptions, selectOption,
}) {
  const [options, setOptions] = useState([]);
  const [editedAttributeOptionId, setEditedAttributeOptionId] = useState(null);
  const closeForm = (refresh) => {
    setEditedAttributeOptionId(null);
    if (refresh) {
      refreshData();
    }
  };

  useEffect(() => {
    setOptions(item.options);
  }, [setOptions, item.options]);

  const deleteAttributeOption = async (id) => {
    try {
      setOptions(options.filter((el) => el.id !== id));
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-attribute-options/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto wartość atrybutu'));
    } catch (e) {
      refreshData();
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć wartości atrybutu'), 'error');
    }
  };

  let editedOptionItem = null;
  if (editedAttributeOptionId && editedAttributeOptionId !== -1) {
    editedOptionItem = options.find(({ id: elId }) => elId === editedAttributeOptionId);
  }
  const { name, persist: isProtected } = item;
  const hasOptions = Boolean(options.length > 0);
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      />
      <Card>
        <CardBody>
          {!objectAssign ? (
            <CardTitle>
              {name}
              {' '}
              {!isProtected ? (
                <RbsButton
                  permission={tourismTourismAttributePermissionWrite}
                  onClick={() => {
                    getUserConfirmationPopup(
                      __('Uwaga! Zmiana dotyczy wszystkich obiektów'),
                      (confirm) => confirm && deleteAttribute(item.id),
                      __('Czy na pewno chcesz usunąć atrybut?'),
                    );
                  }}
                  color="link"
                  title={hasOptions ? __('Nie można usunąc atrybutu który ma przypisane opcje') : __('Usuń')}
                  disabled={hasOptions}
                >
                  <i
                    className="lnr-trash"
                  />
                </RbsButton>
              ) : (
                <span className="opacity-5">
                  (
                  {__('systemowy')}
                  )
                </span>
              )}
            </CardTitle>
          ) : <CardTitle>{name}</CardTitle>}
          <div>
            <FormGroup className="col-sm-12 row" check>
              { options.map((option) => (
                <div key={option.id}>
                  {!objectAssign ? (
                    <Label className="col-sm-6 row" check>
                      <p className="col-sm-8">{option.label}</p>
                      {' '}
                      <RbsButton
                        permission={tourismTourismAttributePermissionWrite}
                        color="link"
                        onClick={() => {
                          setEditedAttributeOptionId(option.id);
                        }}
                      >
                        <i className="lnr-pencil" />
                      </RbsButton>
                      {' '}
                      {!option.persist ? (
                        <RbsButton
                          permission={tourismTourismAttributePermissionWrite}
                          onClick={() => {
                            getUserConfirmationPopup(
                              __('Uwaga! Zmiana dotyczy wszystkich obiektów'),
                              (confirm) => confirm && deleteAttributeOption(option.id),
                              __('Czy na pewno chcesz usunąć wartość atrybutu?'),
                            );
                          }}
                          color="link"
                        >
                          <i className="lnr-trash" />
                        </RbsButton>
                      ) : null}
                    </Label>
                  ) : (
                    <div className="ml-2">
                      <Input
                        onChange={(e) => selectOption(item.code, option.code, e.target.checked)}
                        type="checkbox"
                        name={`${option.code}`}
                        id={option.code}
                        checked={Boolean(assignedOptions[option.code])}
                      />
                      <Label for={option.code} check>{option.label}</Label>
                    </div>
                  )}
                </div>
              ))}
            </FormGroup>
          </div>
          <RbsButton
            permission={tourismTourismAttributePermissionWrite}
            onClick={() => setEditedAttributeOptionId(-1)}
            color="link"
            className="d-block btn-actions-pane-right"
          >
            <i className="pe-7s-plus pe-2x pe-va" />
            {' '}
            Dodaj nową wartość atrybutu
          </RbsButton>
        </CardBody>
      </Card>
      {editedAttributeOptionId ? (
        <EditAttribute
          attributeId={item.id}
          attributeName={item.name}
          attributeValueId={editedAttributeOptionId}
          close={closeForm}
          optionItem={editedOptionItem}
        />
      ) : null}
    </>
  );
}

AttributeOptions.propTypes = {
  deleteAttribute: PropTypes.func,
  selectOption: PropTypes.func,
  objectAssign: PropTypes.bool,
  refreshData: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assignedOptions: PropTypes.object,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    persist: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      persist: PropTypes.bool,
    })).isRequired,
  }).isRequired,
};

AttributeOptions.defaultProps = {
  deleteAttribute: () => {},
  selectOption: () => {},
  objectAssign: false,
  assignedOptions: {},
};
