import React from "react";
import { target_images, non_target_images } from "../components/Image";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addData } from "../slices/ExcelSlice";

const SixgridPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagesState, setImages] = useState([]);
  const [trialNumber, setTrialNumber] = useState(4);
  const [tragetIndex, setTargetIndex] = useState();
  const [selectedImagesArray, setSelectedImagesArray] = useState([]);
  const [attempts, setAttempts] = useState(1);
  let start = new Date().getTime();

  useEffect(() => {
    let arr = [];
    const subscribe = async () => {
      let images = [];
      let indexForTarget = Math.floor(Math.random() * 17);
      let targetPhoto = target_images[indexForTarget];
      for (let k = 0; k < 36; k++) {
        // let index = Math.floor(Math.random() * 56);
        // images.push(non_target_images[index]);
        images.push(non_target_images[k]);
      }
      let targetIndex = Math.floor(Math.random() * 35);
      setTargetIndex(targetIndex);
      images[targetIndex] = targetPhoto;
      return images;
    };

    subscribe().then((images) => {
      arr.push(...images);
      setImages(arr);
    });
  }, []);

  function handleClickImage(image) {
    if (image?.category === "non-target") {
      setAttempts(attempts + 1);
      setSelectedImagesArray((selectedImagesArray) => [
        ...selectedImagesArray,
        image?.index,
      ]);
    } else if (image?.category === "target") {
      setSelectedImagesArray([]);
      const end = new Date().getTime();
      const TimeTaken = end - start;
      start = 0;
      const subscibe = async (array) => {
        let newArray = array;
        let indexForTarget = Math.floor(Math.random() * 10);
        newArray[tragetIndex] = target_images[indexForTarget];
        return newArray;
      };
      setAttempts(attempts + 1);
      dispatch(
        addData({
          trial: trialNumber,
          attempts: attempts,
          time: TimeTaken / 100,
        })
      );
      if (trialNumber === 13) {
        let newArray = [];
        subscibe(imagesState).then((data) => {
          shuffleArray(data).then((data) => {
            newArray.push(...data);
            setImages(newArray);
          });
        });
        navigate(`/thanks`);
      } else {
        let newArray = [];
        subscibe(imagesState).then((data) => {
          shuffleArray(data).then((data) => {
            data.map((d, k) => {
              if (d?.category === "target") {
                setTargetIndex(k);
              }
            });
            newArray.push(...data);
            setImages(newArray);
          });
        });
        setAttempts(1);
        setTrialNumber(trialNumber + 1);
      }
    }
  }

  async function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  return (
    <div className="container">
      <div className="headerText">Practice Trial 6x6 Grid</div>
      <div className="image-grid-six">
        {imagesState.map((image, key) => {
          return (
            <div
              className="grid-item"
              key={key}
              onClick={() => handleClickImage(image)}
            >
              <img
                src={image?.image}
                width="60px"
                height="60px"
                alt={image?.index}
                style={{
                  opacity:
                    selectedImagesArray.includes(image?.index) &&
                    image?.category === "non-target"
                      ? 0
                      : 1,
                }}
              />
            </div>
          );
          // }
        })}
      </div>
    </div>
  );
};

export default SixgridPage;
