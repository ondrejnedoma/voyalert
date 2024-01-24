import React from 'react';
import {Linking, SafeAreaView, ScrollView, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

import OneCreditsItem from '../components/OneCreditsItem';
import ScreenTitle from '../components/ScreenTitle';
import {useTranslation} from 'react-i18next';
import AppBar from '../components/AppBar';

export default function CreditsScreen({navigation}) {
  const {t} = useTranslation();
  const creditsItems = [
    {
      name: 'Punch Deck - the Night Shift',
      link: 'https://www.youtube.com/watch?v=m1Whv2rAKsk',
      icon: 'music',
    },
    {
      name: 'react-navigation',
      link: 'https://reactnavigation.org/docs/getting-started/',
      icon: 'code-tags',
    },
    {
      name: 'react-native-paper',
      link: 'https://reactnativepaper.com/',
      icon: 'code-tags',
    },
    {
      name: 'expo-material3-theme',
      link: 'https://github.com/pchmn/expo-material3-theme',
      icon: 'code-tags',
    },
    {
      name: 'react-native-firebase',
      link: 'https://rnfirebase.io/',
      icon: 'code-tags',
    },
    {
      name: 'notifee',
      link: 'https://notifee.app/',
      icon: 'code-tags',
    },
    {
      name: 'async-storage',
      link: 'https://react-native-async-storage.github.io/async-storage/',
      icon: 'code-tags',
    },
    {
      name: 'Material Design Icons',
      link: 'https://pictogrammers.com/library/mdi/',
      icon: 'brush',
    },
    {
      name: 'react-native-vector-icons',
      link: 'https://github.com/oblador/react-native-vector-icons',
      icon: 'code-tags',
    },
    {
      name: 'react-native-svg',
      link: 'https://github.com/software-mansion/react-native-svg',
      icon: 'code-tags',
    },
    {
      name: 'react-native-svg-transformer',
      link: 'https://github.com/kristerkari/react-native-svg-transformer',
      icon: 'code-tags',
    },
    {
      name: 'react-native-navigation-bar-color',
      link: 'https://github.com/thebylito/react-native-navigation-bar-color',
      icon: 'code-tags',
    },
    {
      name: 'react-native-clipboard',
      link: 'https://github.com/react-native-clipboard/clipboard',
      icon: 'code-tags',
    },
    {
      name: 'date-fns',
      link: 'https://github.com/date-fns/date-fns',
      icon: 'code-tags',
    },
    {
      name: 'deepmerge',
      link: 'https://github.com/TehShrike/deepmerge',
      icon: 'code-tags',
    },
  ];
  const theme = useTheme();
  const appBarButtonsLeft = [
    {
      icon: 'arrow-left',
      onPress: navigation.goBack,
    },
  ];
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <AppBar buttonsLeft={appBarButtonsLeft} />
        <ScreenTitle>{t('credits.title')}</ScreenTitle>
        <Text
          style={{marginBottom: 16}}
          variant="bodySmall">
          {t('credits.creditsText')}
          <Text
            style={{
              textDecorationLine: 'underline',
              color: theme.colors.primary,
            }}
            variant="bodySmall"
            onPress={() =>
              Linking.openURL(
                'https://github.com/ondrejnedoma/voyalert/issues/new',
              )
            }>
            {t('credits.openIssue')}
          </Text>
          .
        </Text>
      </View>
      <ScrollView>
        {creditsItems.map(el => (
          <OneCreditsItem
            key={el.name}
            icon={el.icon}
            name={el.name}
            link={el.link}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
