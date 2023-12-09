import {View} from 'react-native';
import {Checkbox, Dialog, Portal, Text} from 'react-native-paper';
import React from 'react';
import apiSetConfigForStop from './scripts/ApiSetConfigForStop';

export default function StopConfigDialog({
  visible,
  onDismiss,
  dataSource,
  voyNumber,
  stopName,
  config,
  options,
  setShowErrorSnackbar,
  setErrorSnackbarText,
}) {
  const [loading, setLoading] = React.useState(false);
  const [stopConfig, setStopConfig] = React.useState(config);
  const onConfigSet = (field, value) => {
    setLoading(true);
    apiSetConfigForStop({
      dataSource,
      voyNumber,
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
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{stopName}</Dialog.Title>
        <Dialog.Content>
          <Checkbox.Item
            label="Notification at arrival"
            status={stopConfig.notifyArrival ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('notifyArrival', !stopConfig.notifyArrival)
            }
            disabled={loading || !options.isArrivalEnabled}
          />
          <Checkbox.Item
            labelStyle={{paddingHorizontal: 16}}
            label="Alarm at arrival"
            status={stopConfig.alarmArrival ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('alarmArrival', !stopConfig.alarmArrival)
            }
            disabled={
              loading || !options.isArrivalEnabled || !stopConfig.notifyArrival
            }
          />
          <Checkbox.Item
            label="Notification at departure"
            status={stopConfig.notifyDeparture ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('notifyDeparture', !stopConfig.notifyDeparture)
            }
            disabled={loading || !options.isDepartureEnabled}
          />
          <Checkbox.Item
            labelStyle={{paddingHorizontal: 16}}
            label="Alarm at departure"
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
