import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import ScreenTitle from '../components/ScreenTitle';
import {useTranslation} from 'react-i18next';
import {RadioButton, Text} from 'react-native-paper';

import Cz from '../img/flag-cz.svg';
import En from '../img/flag-en.svg';

export default function StartScreen({navigation}) {
  const {t} = useTranslation();
  const [language, setLanguage] = React.useState('en');
  const [notificationType, setNotificationType] = React.useState();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <ScreenTitle>{t('start.welcome')}</ScreenTitle>
      </View>
      <ScrollView>
        <View style={{marginHorizontal: 24}}>
          <Text
            style={{marginBottom: 4}}
            variant="titleMedium">
            Step 1
          </Text>
          <Text
            style={{marginBottom: 4}}
            variant="bodySmall">
            {t('start.language')}
          </Text>
        </View>
        <RadioButton.Group
          onValueChange={newLanguage => setLanguage(newLanguage)}
          value={language}>
          <RadioButton.Item
            style={{paddingHorizontal: 24, flex: 1, flexGrow: 1}}
            position="leading"
            labelVariant="bodyLarge"
            label="Čeština"
            value="cz"
          />
          <RadioButton.Item
            style={{paddingHorizontal: 24}}
            position="leading"
            labelVariant="bodyLarge"
            label="English"
            value="en"
          />
        </RadioButton.Group>
        <View style={{marginHorizontal: 24, marginTop: 16}}>
          <Text
            style={{marginBottom: 4}}
            variant="titleMedium">
            Step 2
          </Text>
          <Text
            style={{marginBottom: 4}}
            variant="bodySmall">
            {t('start.notificationType')}
          </Text>
        </View>
        <RadioButton.Group
          onValueChange={newNotificationType =>
            setNotificationType(newNotificationType)
          }
          value={notificationType}>
          <RadioButton.Item
            style={{paddingHorizontal: 24}}
            position="leading"
            labelVariant="bodyLarge"
            label="Firebase"
            value="firebase"
          />
          <RadioButton.Item
            style={{paddingHorizontal: 24}}
            position="leading"
            labelVariant="bodyLarge"
            label="HTTP"
            value="http"
          />
        </RadioButton.Group>
      </ScrollView>
    </SafeAreaView>
  );
}
