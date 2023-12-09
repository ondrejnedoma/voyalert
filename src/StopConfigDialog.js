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
            label="Notification at departure"
            status={stopConfig.notifyDeparture ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('notifyDeparture', !stopConfig.notifyDeparture)
            }
            disabled={loading || !options.isDepartureEnabled}
          />
          <Checkbox.Item
            label="Alarm at arrival"
            status={stopConfig.alarmArrival ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('alarmArrival', !stopConfig.notifyArrival)
            }
            disabled={loading || !options.isArrivalEnabled}
          />
          <Checkbox.Item
            label="Alarm at departure"
            status={stopConfig.alarmDeparture ? 'checked' : 'unchecked'}
            onPress={() =>
              onConfigSet('alarmDeparture', !stopConfig.notifyArrival)
            }
            disabled={loading || !options.isDepartureEnabled}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
