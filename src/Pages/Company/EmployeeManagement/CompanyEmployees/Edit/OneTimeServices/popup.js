import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import PopupComponent from '../../../../../../Components/Popup/popup';

export default function Popup({ isOpen, close }) {
  return (
    <>
      <PopupComponent id="oneTimeServiceEditInfo" isOpen={isOpen} toggle={close} unmountOnClose size="lg">
        <ModalHeader toggle={close}>Warunki edycji świadczeń jednorazowych</ModalHeader>
        <ModalBody>
          <div>
            <ul>
              <li>Typy świadczeń, które można usunąć:</li>
              <ul>
                <li>Wycieczki zagraniczne Travelplanet</li>
                <li>Turystyka zagraniczna</li>
                <li>Kolonie</li>
                <li>Bilety do kina</li>
                <li>Kody uniwersalne</li>
                <li>Karta MyBenefit</li>
                <li>Karty Plastikowe</li>
                <li>Dofinansowanie</li>
                <li>Turystyka</li>
                <li>Archiwalna</li>
              </ul>
              <li>Operacja usunięcia świadczenia jest nieodwracalna.</li>
              <li>
                Dla świadczeń typu kody uniwersalne anulacja jest możliwa tylko dla kodów, które nie
                zostały
                {' '}
                <br />
                {' '}
                wyświetlone użytkownikowi.
              </li>
              <li>Typy świadczeń, dla których można przepiąć produkt/dostawcę:</li>
              <ul>
                <li>Turystyka</li>
              </ul>
              <li>Zmniejszenie ceny świadczenia można wykonać dla:</li>
              <ul>
                <li>świadczenia turystycznego typu oferta własna</li>
                <li>firm, które nie mają zaznaczonej opcji "dwa składniki płacowe dla ZFŚS"</li>
                <li>świadczeń opłaconych nieratalnie</li>
                <li>
                  banków Ogólny ZFŚS i Zgromadzone punkty (naliczane co miesiąc) oraz płatności
                  online
                </li>
              </ul>
              <li>
                Podczas zmiany ceny świadczenia zmiana kwoty danej płatności na 0 anuluje tę płatność.
              </li>
            </ul>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={close}>
            Zamknij
          </Button>
        </ModalFooter>
      </PopupComponent>
    </>
  );
}

Popup.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
