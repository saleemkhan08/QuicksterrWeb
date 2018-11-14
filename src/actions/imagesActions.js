import { storageRef, firestore, database } from "../store";

export const OPEN_IMAGE_UPLOAD_DIALOG = "OPEN_IMAGE_UPLOAD_DIALOG";
export const CLOSE_IMAGE_UPLOAD_DIALOG = "CLOSE_IMAGE_UPLOAD_DIALOG";
export const COMMON_IMAGES = "images";
export const IMAGE_UPLOAD_STARTED = "IMAGE_UPLOAD_STARTED";
export const IMAGE_UPLOAD_SUCCESS = "IMAGE_UPLOAD_SUCCESS";
export const IMAGE_UPLOAD_ERROR = "IMAGE_UPLOAD_ERROR";
export const FETCH_IMAGES_BEGIN = "FETCH_IMAGES_BEGIN";
export const FETCH_IMAGES_SUCCESS = "FETCH_IMAGES_SUCCESS";
export const DELETE_IMAGE_BEGIN = "DELETE_IMAGE_BEGIN";
export const DELETE_IMAGE_SUCCESS = "DELETE_IMAGE_SUCCESS";
export const DELETE_IMAGE_ERROR = "DELETE_IMAGE_ERROR";
export const IMAGE_KEYWORDS_UPDATE_BEGIN = "IMAGE_KEYWORDS_UPDATE_BEGIN";
export const IMAGE_KEYWORDS_UPDATE_SUCCESS = "IMAGE_KEYWORDS_UPDATE_SUCCESS";
export const IMAGE_KEYWORDS_UPDATE_ERROR = "IMAGE_KEYWORDS_UPDATE_ERROR";
export const IMAGE_UPDATE_BEGIN = "IMAGE_UPDATE_BEGIN";
export const IMAGE_UPDATE_SUCCESS = "IMAGE_UPDATE_SUCCESS";
export const IMAGE_UPDATE_ERROR = "IMAGE_UPDATE_ERROR";

export const openImageUploadDialog = (keywords, refPath) => ({
  type: OPEN_IMAGE_UPLOAD_DIALOG,
  payload: { keywords, refPath }
});

export const closeImageUploadDialog = () => ({
  type: CLOSE_IMAGE_UPLOAD_DIALOG
});

export const uploadStarted = () => ({
  type: IMAGE_UPLOAD_STARTED
});

export const uploadSuccess = image => ({
  type: IMAGE_UPLOAD_SUCCESS,
  payload: image
});

export const uploadError = error => ({
  type: IMAGE_UPLOAD_ERROR,
  payload: error
});
export function fetchImages(ids) {
  console.log(ids);
  return dispatch => {
    dispatch(fetchImagesBegin());
    const refs = [];
    const images = [];
    if (ids) {
      for (let i = 0; i < ids.length; i++) {
        refs.push(
          firestore
            .collection(COMMON_IMAGES)
            .doc(ids[i])
            .get()
        );
      }
      Promise.all(refs).then(snapshotList => {
        snapshotList.forEach(snap => {
          const image = snap.data();
          if (image) {
            images.push(image);
          }
        });
        dispatch(fetchImagesSuccess(images));
      });
    } else {
      const query = firestore.collection(COMMON_IMAGES).orderBy("timeStamp");
      query.onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          images.push(doc.data());
        });
        dispatch(fetchImagesSuccess(images));
      });
    }
  };
}

export const fetchKeywords = str => {
  const searchStr = str ? str.toLowerCase() : str;
  return dispatch => {
    dispatch(fetchKeywordsBegin());
    database
      .ref("images")
      .orderByChild("keyword")
      .limitToFirst(50)
      .startAt(searchStr)
      .endAt(searchStr + "\uf8ff")
      .once("value")
      .then(snap => {
        const ids = {};
        const keywordObjectList = snap.val();
        const keywords = Object.keys(keywordObjectList);
        keywords.forEach(key => {
          const keyword = keywordObjectList[key];
          const imageKeys = Object.keys(keyword);
          imageKeys.forEach(imgKey => {
            if (imgKey !== "keyword") {
              ids[imgKey] = 1;
            }
          });
        });
        dispatch(fetchImages(Object.keys(ids)));
      })
      .catch(error => {
        dispatch(fetchKeywordsError(error));
      });
  };
};

export const fetchKeywordsBegin = () => ({
  type: FETCH_IMAGES_BEGIN
});
export const fetchKeywordsError = error => ({
  type: FETCH_IMAGES_SUCCESS,
  payload: error
});

export const editImageKeywords = image => {
  return dispatch => {
    dispatch(editImagesBegin());
    const imageRef = firestore.collection(COMMON_IMAGES).doc(image.id);
    imageRef
      .set(image)
      .then(() => {
        dispatch(editImagesSuccess());
      })
      .catch(error => {
        dispatch(editImagesError(error));
      });
  };
};

export const updateImageUrl = (ref, url) => {
  return dispatch => {
    dispatch(imageUpdateBegin());
    firestore
      .doc(ref)
      .update({ icon: url })
      .then(() => {
        dispatch(imageUpdateSuccess());
      })
      .catch(error => {
        dispatch(imageUpdateError(error));
      });
  };
};

export const imageUpdateBegin = () => ({
  type: IMAGE_UPDATE_BEGIN
});

export const imageUpdateSuccess = () => ({
  type: IMAGE_UPDATE_SUCCESS
});

export const imageUpdateError = error => ({
  type: IMAGE_UPDATE_ERROR,
  payload: error
});

export const editImagesBegin = () => ({
  type: IMAGE_KEYWORDS_UPDATE_BEGIN
});

export const editImagesSuccess = () => ({
  type: IMAGE_KEYWORDS_UPDATE_SUCCESS
});

export const editImagesError = error => ({
  type: IMAGE_KEYWORDS_UPDATE_ERROR,
  payload: error
});

/* Used state of crudlist instead of redux to show the loading status */
export const deleteImage = (image, index) => {
  return dispatch => {
    dispatch(deleteImageBegin());
    storageRef
      .child(COMMON_IMAGES)
      .child(image.id)
      .delete()
      .then(() => {
        firestore
          .collection(COMMON_IMAGES)
          .doc(image.id)
          .delete()
          .then(() => {
            dispatch(deleteImageSuccess(index));
            console.log("Deleted Image");
          });
      })
      .catch(error => {
        dispatch(deleteImageError(error));
      });
  };
};
export const deleteImageBegin = () => ({
  type: DELETE_IMAGE_BEGIN
});
export const deleteImageSuccess = index => ({
  type: DELETE_IMAGE_SUCCESS,
  payload: index
});
export const deleteImageError = () => ({
  type: DELETE_IMAGE_ERROR
});
export const fetchImagesBegin = () => ({
  type: FETCH_IMAGES_BEGIN
});
export const fetchImagesSuccess = images => ({
  type: FETCH_IMAGES_SUCCESS,
  payload: images
});
export const uploadImage = (imgFile, keywords) => {
  return dispatch => {
    const imgDbRef = firestore.collection(COMMON_IMAGES).doc();
    dispatch(uploadStarted());
    const imgStorageRef = storageRef.child(COMMON_IMAGES).child(imgDbRef.id);
    imgStorageRef
      .put(imgFile)
      .then(snap => {
        console.log("Image Uploaded", snap);
        imgStorageRef.getDownloadURL().then(url => {
          console.log("Image Url ", url);
          const uploadedImage = {
            id: imgDbRef.id,
            url: url,
            keywords: keywords,
            timeStamp: new Date().getTime() * -1
          };
          console.log("uploadedImage : ", uploadedImage);
          dispatch(uploadSuccess(uploadedImage));
          imgDbRef
            .set(uploadedImage)
            .then(() => {
              console.log("DB uploaded");
            })
            .catch(error => {
              console.log("DB upload error: ", error);
              dispatch(uploadError(error));
            });
        });
      })
      .catch(error => {
        console.log(error);
        dispatch(uploadError(error));
      });
  };
};
