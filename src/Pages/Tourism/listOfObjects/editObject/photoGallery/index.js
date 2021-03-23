import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Button, CardTitle, Form, Alert,
} from 'reactstrap';
import Gallery from 'react-photo-gallery';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import CustomDropzone from '../../../../../Components/FormElements/Dropzone';
import EditForm from './editForm';
import { restApiRequest, TOURISM_SERVICE } from '../../../../../utils/Api';
import __ from '../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../utils/Notifications';
import { tourismTourismObjectPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import FormTitle from '../../../../../Components/Form/FormTitle';
import RbsButton from '../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import ContentLoading from '../../../../../Components/Loading/contentLoading';
import SortablePhoto from './sortablePhoto';
import SelectablePhoto from './selectablePhoto';
import { getRandomId } from '../../../../Cms/Management/util';
import { getAnixeValue } from '../utils/anixeData';
import { uploadImageFromFile, uploadImageFromUrl } from './utils';

export default function PhotoGallery({ objectId }) {
  const [gallery, setGallery] = useState([]);
  const [anixeGallery, setAnixeGallery] = useState([]);
  const [files, setFiles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortableState, setSortableState] = useState(false);

  const closeForm = useCallback(() => {
    setEditIndex(null);
  }, [setEditIndex]);

  useEffect(() => {
    const turnOnSortableState = ({ code }) => {
      if (code === 'ControlLeft' || code === 'ControlRight') {
        setSortableState(true);
      }
    };
    const turnOffSortableState = ({ code }) => {
      if (code === 'ControlLeft' || code === 'ControlRight') {
        setSortableState(false);
      }
    };
    window.addEventListener('keydown', turnOnSortableState);
    window.addEventListener('keyup', turnOffSortableState);

    return () => {
      window.removeEventListener('keydown', turnOnSortableState);
      window.removeEventListener('keydown', turnOffSortableState);
    };
  }, [setSortableState]);

  useEffect(() => {
    setLoading(true);
    restApiRequest(
      TOURISM_SERVICE,
      `/tourism-objects/${objectId}`,
      'GET',
      {},
      {
        anixeData: {
          en: {
            gallery: mockGallery,
          },
        },
      },
    ).then((response) => {
      const ownGallery = response?.gallery || [];
      setGallery(ownGallery.map(({ path, ...item }) => ({
        src: path,
        width: 4,
        height: 3,
        ...item,
      })));
      const anixe = getAnixeValue(response?.anixeData || {}, 'gallery') || [];
      setAnixeGallery(anixe.map(({ url, path, ...item }) => ({
        src: url || path,
        width: 4,
        height: 3,
        ...item,
      })));
    })
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się pobrać galerii zdjęć'), 'error');
      })
      .finally(() => setLoading(false));
  }, [objectId]);

  const parseGalleryItem = (idx) => {
    const galleryItem = gallery.find((item) => item.id === idx);
    galleryItem.path = galleryItem.src || galleryItem.filePath;

    return galleryItem;
  };

  const submit = async (idx) => {
    try {
      setLoading(true);
      const method = 'PATCH';
      const path = `/tourism-objects/${objectId}`;
      const body = idx ? { gallery: parseGalleryItem(idx) } : {
        gallery: gallery.map(({
          alt, name, src, filePath,
        }, index) => ({
          alt, name, path: src || filePath, positions: index,
        })),
      };

      await restApiRequest(
        TOURISM_SERVICE,
        path,
        method,
        {
          body,
        },
        {
          gallery,
          anixeData: {
            gallery: anixeGallery,
          },
        },
      );
      dynamicNotification(__('Pomyślnie zapisano galerię'));
      setFiles([]);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać galerii'), 'error');
    }
    setLoading(false);
  };

  const selectAll = () => {
    setSelectedItems(gallery.map((el, key) => key));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const deleteSelected = () => {
    const deletedPhotos = [];
    setGallery(gallery.filter((item, index) => {
      if (selectedItems.includes(index) && item.tmpId) {
        deletedPhotos.push(item.tmpId);
      }
      return !selectedItems.includes(index);
    }));
    setFiles(files.filter(({ tmpId }) => !deletedPhotos.includes(tmpId)));
    setSelectedItems([]);
  };
  const copyFromAnixe = async () => {
    setLoading(true);
    const promises = anixeGallery.map((item) => uploadImageFromUrl(item.src, objectId));
    const images = await Promise.all(promises);
    const newGaleryImages = images.filter((el) => el !== null).map((image) => (
      {
        name: image?.name,
        src: image?.path,
        filePath: image?.path,
        height: 3,
        width: 4,
      }
    ));
    if (images.includes(null)) {
      dynamicNotification(__('Nie udało się przekopiować wszystkich zdjęć'), 'warning');
    }

    setGallery([...newGaleryImages]);
    setLoading(false);
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setGallery(arrayMove(gallery, oldIndex, newIndex));
    let newSelections = [...selectedItems];
    if (oldIndex > newIndex) {
      for (let i = oldIndex; i >= newIndex; i -= 1) {
        if (newSelections.includes(i)) {
          newSelections = newSelections.filter((el) => el !== i);
          newSelections.push(i + 1);
        }
      }
    } else if (oldIndex < newIndex) {
      for (let i = oldIndex; i <= newIndex; i += 1) {
        if (newSelections.includes(i)) {
          newSelections = newSelections.filter((el) => el !== i);
          newSelections.push(i - 1);
        }
      }
    }
    setSelectedItems(newSelections);
  };

  const deletePhoto = (index) => {
    const deletedPhotos = [];
    setGallery(gallery.filter((item, key) => {
      if ((key === index) && item.tmpId) {
        deletedPhotos.push(item.tmpId);
      }
      return key !== index;
    }));
    setFiles(files.filter(({ tmpId }) => !deletedPhotos.includes(tmpId)));
    if (selectedItems.includes(index)) {
      deselect(index);
    }
  };

  const select = (index) => {
    if (!selectedItems.includes(index)) {
      selectedItems.push(index);
      setSelectedItems([...selectedItems]);
    }
  };
  const deselect = (index) => setSelectedItems(selectedItems.filter((elIndex) => elIndex !== index));

  const clearFiles = () => {
    setFiles([]);
  };

  const onDrop = async (droppedFiles) => {
    droppedFiles.forEach((el) => {
      // eslint-disable-next-line no-param-reassign
      el.tmpId = getRandomId();
    });
    setLoading(true);
    const promises = droppedFiles.map((file) => uploadImageFromFile(file, objectId));
    const images = await Promise.all(promises);
    const newGaleryImages = images.filter((el) => el !== null).map((image) => (
      {
        name: image?.name,
        src: image?.path,
        filePath: image?.path,
        tmpId: image.tmpId,
        height: 3,
        width: 4,
      }
    ));
    if (images.includes(null)) {
      dynamicNotification(__('Nie udało się przekopiować wszystkich zdjęć'), 'warning');
    }
    setFiles(files.concat(droppedFiles));
    setGallery([...gallery, ...newGaleryImages]);
    setLoading(false);
    return null;
  };

  const updatePhotoData = (index, data) => {
    const photo = gallery[index] || {};
    const updatedPhoto = { ...photo, ...data };
    const updatedGallery = [...gallery];
    updatedGallery[index] = updatedPhoto;
    setGallery(updatedGallery);
  };

  let editItem = null;
  if (editIndex !== null) {
    editItem = gallery[editIndex];
  }

  return (
    <ContentLoading show={loading}>
      <Card>
        <Form onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        >
          <FormTitle
            title={__('GALERIA ZDJĘĆ')}
            stickyTitle
            buttons={[
              <RbsButton
                key="submit"
                data-t1="submit"
                size="lg"
                color="success"
                disabled={loading}
                permission={tourismTourismObjectPermissionWrite}
                type="submit"
              >
                {__('Zapisz')}
              </RbsButton>,
            ]}
          />
          <CardBody>
            <CardTitle className="my-3 ml-3">Galeria własna</CardTitle>
            {gallery.length ? (
              <Alert color="secondary">{__('Aby sortować przełącz się na tryb sortowania lub przytrzymaj przycisk CTRL')}</Alert>
            ) : null}
            <div className="col-sm-12 row">
              <Button
                data-t1="switchSortableState"
                outline
                color="primary"
                className="my-2"
                onClick={() => {
                  setSortableState(!sortableState);
                }}
              >
                {sortableState ? __('Przełącz na tryb zaznaczania') : __('Przełącz na tryb sortowania')}
              </Button>
              {!sortableState ? (
                <>
                  <Button
                    outline
                    data-t1="selectAll"
                    color="primary"
                    className="ml-2 my-2"
                    onClick={selectAll}
                    disabled={selectedItems.length === gallery.length}
                  >
                    {__('Zaznacz wszystko')}
                  </Button>
                  <Button
                    outline
                    data-t1="deselectAl"
                    color="primary"
                    disabled={Boolean(selectedItems.length === 0)}
                    className="ml-2 my-2"
                    onClick={deselectAll}
                  >
                    {__('Odznacz wszystko')}
                  </Button>
                  <Button
                    data-t1="deleteSelected"
                    disabled={selectedItems.length === 0}
                    outline
                    color="primary"
                    className="my-2 ml-2"
                    onClick={deleteSelected}
                  >
                    Usuń zaznaczone
                  </Button>
                </>
              ) : null}
            </div>
            <div style={{ display: sortableState ? 'block' : 'none' }}>
              <SortableGallery
                items={gallery}
                onSortEnd={onSortEnd}
                axis="xy"
              />
            </div>
            <div style={{ display: sortableState ? 'none' : 'block' }}>
              <Gallery
                photos={gallery}
                targetRowHeight={300}
                renderImage={
                    ({ index, ...props }) => (
                      <SelectablePhoto
                            // eslint-disable-next-line react/jsx-props-no-spreading
                        {...props}
                        markAsSelected={(value) => (value ? select(index) : deselect(index))}
                        selected={selectedItems.includes(index)}
                        openPopup={() => setEditIndex(index)}
                        deletePhoto={() => deletePhoto(index)}
                      />
                    )
                  }
              />
            </div>
            <CustomDropzone
              noCards
              key="custom_dropzone"
              files={files}
              onDrop={onDrop}
              clearFiles={clearFiles}
            />
          </CardBody>
          <CardBody>
            <CardTitle className="my-3 ml-3">Galeria ANIXE</CardTitle>
            <div className="col-sm-12">
              <Button
                data-t1="copyAnixe"
                outline
                color="primary"
                className="my-2"
                disabled={loading}
                onClick={() => getUserConfirmationPopup(
                  __(
                    'Czy chcesz skopiować wszystkie zdjęcia z galerii ANIXE do galerii własnej?'
                      + ' Spowoduje to nadpisanie obecnych zdjęć w galerii własnej.',
                  ),
                  (confirm) => confirm && copyFromAnixe(),
                  __('Kopiowanie danych z galerii ANIXE'),
                )}
              >
                Skopiuj do galerii własnej
              </Button>
            </div>
            <Gallery photos={anixeGallery} targetRowHeight={150} />
          </CardBody>
        </Form>
      </Card>
      {editItem ? <EditForm item={editItem} close={closeForm} isOpen onSave={(data) => updatePhotoData(editIndex, data)} /> : null}
    </ContentLoading>
  );
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Sortable = SortableElement((item) => <SortablePhoto {...item} />);
const SortableGallery = SortableContainer(({ items }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Gallery photos={items} targetRowHeight={300} renderImage={(props) => <Sortable {...props} />} />
));

PhotoGallery.propTypes = {
  objectId: PropTypes.string.isRequired,
};

const mockGallery = [
  {
    src: 'https://picsum.photos/id/1044/1000/600/',
    height: 3,
    width: 4,
  },
  {
    src: 'https://picsum.photos/id/164/1000/600/',
    height: 3,
    width: 4,
  },
  {
    src: 'https://picsum.photos/id/1040/1000/600/',
    height: 3,
    width: 4,
  },
];
