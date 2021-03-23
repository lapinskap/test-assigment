import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Form from '../../../Components/Form/index';
import __ from '../../../utils/Translations';
import {
  ACCEPTANCE_TYPE_AUTO, ACCEPTANCE_TYPE_MANUAL, PRODUCT_TYPE_BENEFIT, PRODUCT_TYPE_VOUCHER,
} from './consts';
import {
  catalogProductAttachmentPermissionRead,
  catalogProductPermissionWrite,
} from '../../../utils/RoleBasedSecurity/permissions';
import ProductAttachments from './ProductAttachments';
import { dynamicNotification } from '../../../utils/Notifications';
import { fetchAttachments } from './ProductAttachments/utils';
import useHasPermission from '../../../utils/hooks/security/useHasPermission';

export default function RulesOfRealization({
  data, setData, next, title,
}) {
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const hasAccessToReadAttachment = useHasPermission(catalogProductAttachmentPermissionRead);
  const productId = data.id;
  const { attachments } = data;
  const needToFetchAttachments = !Array.isArray(attachments);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  const reloadAttachments = async (id) => {
    try {
      setLoadingAttachments(true);
      onChange('attachments', await fetchAttachments(id));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się pobrać aktualnej listy załączników.'), 'error');
    }
    setLoadingAttachments(false);
  };

  useEffect(() => {
    if (hasAccessToReadAttachment && needToFetchAttachments) {
      reloadAttachments(productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, hasAccessToReadAttachment, needToFetchAttachments]);

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Form
          id="step3Form"
          data={data}
          config={{
            stickyTitle: false,
            noCards: true,
            defaultOnChange: onChange,
            groupsAsColumns: true,
            onSubmit: next,
            title,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                id: 'step3FormSubmit',
                permission: catalogProductPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    type: 'wysiwyg',
                    id: 'description',
                    label: 'Opis:',
                    translatable: data.id ? {
                      code: `catalog-management:product:${data.id}:description`,
                      isCms: true,
                    } : null,

                  },
                  {
                    type: 'wysiwyg',
                    id: 'rulesOfUse',
                    label: 'Zasady realizacji:',
                    translatable: data.id ? {
                      code: `catalog-management:product:${data.id}:rulesOfUse`,
                      isCms: true,
                    } : null,

                  },
                  {
                    type: 'wysiwyg',
                    id: 'messageAfterPurchase',
                    label: 'Informacja zwrotna po zakupie:',
                    translatable: data.id ? {
                      code: `catalog-management:product:${data.id}:messageAfterPurchase`,
                      isCms: true,
                    } : null,
                  },
                  {
                    component: <ProductAttachments
                      productId={productId}
                      key="productAttachments"
                      hasAccessToReadAttachment={hasAccessToReadAttachment}
                      attachments={attachments || []}
                      setAttachments={(attachmentsData) => onChange('attachments', attachmentsData)}
                      loadingAttachments={loadingAttachments}
                    />,
                  },
                ],
              },
              {
                formElements: [
                  {
                    type: 'wysiwyg',
                    id: 'supplierName',
                    label: 'Nazwa podmiotu realizującego usługę:',
                  },
                  {
                    type: 'wysiwyg',
                    id: 'supplierDescription',
                    label: 'Opis podmiotu realizującego usługę - wartość podstawiana w "Odstąpienie od umowy":',
                  },
                  {
                    type: 'wysiwyg',
                    id: 'supplierRegulations',
                    label: 'Regulamin podmiotu realizującego usługę:',
                  },
                  {
                    type: 'radio',
                    label: 'Rodzaj produktu:',
                    id: 'mbBenefitType',
                    options: [
                      { value: PRODUCT_TYPE_VOUCHER, label: __('Bon') },
                      { value: PRODUCT_TYPE_BENEFIT, label: __('Świadczenie') },
                    ],
                    validation: ['required'],
                  },
                  {
                    type: 'boolean',
                    isCheckbox: true,
                    id: 'withdrawAllowed',
                    label: 'Możliwość odstąpienia od umowy',
                    props: {
                      disabled: data.mbBenefitType === PRODUCT_TYPE_VOUCHER,
                    },
                    tooltip: data.mbBenefitType === PRODUCT_TYPE_VOUCHER ? { content: 'Dla produktów typu bon nie przysługuje odstąpienie od umowy.' }
                      : null,
                  },
                  {
                    type: 'boolean',
                    isCheckbox: true,
                    id: 'enabledSmsAcceptanceOption',
                    label: 'Opcja akceptacji kodu przez SMS',
                  },
                  {
                    type: 'radio',
                    label: 'Akceptacja w Panelu Dostawcy:',
                    id: 'acceptanceType',
                    options: [
                      { value: ACCEPTANCE_TYPE_AUTO, label: 'automatyczna' },
                      { value: ACCEPTANCE_TYPE_MANUAL, label: 'ręczna' },
                    ],
                  },
                ],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

RulesOfRealization.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  next: PropTypes.func,
  setData: PropTypes.func.isRequired,
  title: PropTypes.string,
};

RulesOfRealization.defaultProps = {
  next: () => {},
  title: null,
};
