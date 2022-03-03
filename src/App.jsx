import React, { useCallback, useReducer } from 'react';
import {
  BasicInfo,
  Grid,
  ProOptMain,
  ProductIntroImg,
  ProductIntroNotice,
  BuyerRecommendImg,
  ExposePeriod,
  ProductDelivery,
  ProductResistor,
  MileageEtc,
  Nav,
} from 'Components';

import {
  intialErrors,
  ErrorContext,
  errorReducer,
  categoriesActionGenerator,
  productIntroActionGenerator,
} from 'context/error';
import styles from './App.module.css';
import { debounce } from 'utils';

const App = () => {
  const [errors, errorsDispatch] = useReducer(errorReducer, intialErrors);

  const offErrorMessage = useCallback(
    debounce(() => {
      errorsDispatch(categoriesActionGenerator(false));
    }, 4000),
    []
  );

  const submitHandler = e => {
    e.preventDefault();
    const requestBody = {};
    const data = new FormData(e.target);

    const initObject = (obj, keys, index) => {
      const currentKey = keys[index];

      if (currentKey && !obj[currentKey]) {
        obj[currentKey] = {};
      }

      return currentKey && initObject(obj[currentKey], keys, ++index);
    };

    for (var [key, value] of data.entries()) {
      if (value.length === 0 && !value) continue;
      const [prefix, contents, rest] = key.split('-');

      initObject(requestBody, [prefix, contents, rest], 0);

      let jsonValue;

      try {
        jsonValue = JSON.parse(value);
      } catch (e) {
        jsonValue = value;
      }

      if (rest) requestBody[prefix][contents][rest] = jsonValue;
      else requestBody[prefix][contents] = jsonValue;
    }

    if (
      !requestBody?.basicInfo?.categories ||
      Object.keys(requestBody?.basicInfo?.categories).length === 0
    ) {
      errorsDispatch(categoriesActionGenerator(true));
      offErrorMessage();
      return;
    }

    console.log(requestBody);
    alert('결과가 저장되었습니다. 콘솔을 확인해주세요!');
  };

  return (
    <ErrorContext.Provider value={errors}>
      <Grid container>
        <Grid className={styles.menu} item>
          <Nav />
        </Grid>
        <Grid className={styles.gridContents} item size={10}>
          <main className={styles.main}>
            <form
              onSubmit={e => {
                submitHandler(e);
              }}
            >
              <ProductResistor />
              <Grid container center space={20}>
                <Grid item>
                  <ExposePeriod />
                </Grid>
                <Grid item>
                  <BasicInfo />
                </Grid>
                <Grid item>
                  <ProOptMain />
                </Grid>
                <Grid item>
                  <ProductIntroImg />
                </Grid>
                <Grid item>
                  <BuyerRecommendImg />
                </Grid>
                <Grid item>
                  <ProductIntroNotice />
                </Grid>
                <Grid item>
                  <ProductDelivery />
                </Grid>
                <Grid item>
                  <MileageEtc menuTitle="mileage" />
                </Grid>
                <Grid item>
                  <MileageEtc menuTitle="etc" />
                </Grid>
              </Grid>
            </form>
          </main>
        </Grid>
      </Grid>
    </ErrorContext.Provider>
  );
};

export default App;
