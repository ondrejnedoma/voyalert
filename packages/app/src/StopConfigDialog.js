import React from 'react';
import {Checkbox, Dialog, Portal} from 'react-native-paper';

import apiSetConfigForStop from './api/ApiSetConfigForStop';
import {useTranslation} from 'react-i18next';

export default function StopConfigDialog({
  visible,
  onDismiss,
  dataSource,
  voyName,
  stopName,
  config,
  options,
  setShowErrorSnackbar,
  setErrorSnackbarText,
}) {
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [stopConfig, setStopConfig] = React.useState(config);
  React.useEffect(() => {
    setStopConfig(config);
  }, [config]);
  const onConfigSet = (field, value) => {
    setLoading(true);
    apiSetConfigForStop({
      dataSource,
      voyName,
      stop: stopName,
      field,
      value,
    }).then(data => {
      setLoading(false);
      if (data.ok) {
        let newStopConfig = {...stopConfig};
        newStopConfig[field] = value;
        setStopConfig(newStopConfig);
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}>
        <Dialog.Title>{stopName}</Dialog.Title>
        <Dialog.Content>
          <Checkbox.Item
            label={t('configRoute.notifyArrival')}
            status={stopConfig.notifyArrival ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('notifyArrival', !stopConfig.notifyArrival)
            }
            disabled={
              loading || !options.isArrivalEnabled || stopConfig.alarmArrival
            }
          />
          <Checkbox.Item
            labelStyle={{paddingHorizontal: 24}}
            label={t('configRoute.alarmArrival')}
            status={stopConfig.alarmArrival ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('alarmArrival', !stopConfig.alarmArrival)
            }
            disabled={
              loading || !options.isArrivalEnabled || !stopConfig.notifyArrival
            }
          />
          <Checkbox.Item
            label={t('configRoute.notifyDeparture')}
            status={stopConfig.notifyDeparture ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('notifyDeparture', !stopConfig.notifyDeparture)
            }
            disabled={
              loading ||
              !options.isDepartureEnabled ||
              stopConfig.alarmDeparture
            }
          />
          <Checkbox.Item
            labelStyle={{paddingHorizontal: 24}}
            label={t('configRoute.alarmDeparture')}
            status={stopConfig.alarmDeparture ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('alarmDeparture', !stopConfig.alarmDeparture)
            }
            disabled={
              loading ||
              !options.isDepartureEnabled ||
              !stopConfig.notifyDeparture
            }
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
