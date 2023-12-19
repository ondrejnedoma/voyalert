import React from 'react';
import {Linking, SafeAreaView, ScrollView} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

import OneCreditsItem from '../OneCreditsItem';
import ScreenTitle from '../ScreenTitle';

export default function CreditsScreen() {
  const creditsItems = [
    {
      name: 'Punch Deck - the Night Shift',
      link: 'https://www.youtube.com/watch?v=m1Whv2rAKsk',
      note: 'Alarm song',
      icon: 'music',
    },
    {
      name: 'Nikiforos Kafetsios',
      link: 'mailto:nikiforoskafetsios@gmail.com',
      note: 'Notification sound',
      icon: 'bell',
    },
    {
      name: 'react-navigation',
      link: 'https://reactnavigation.org/docs/getting-started/',
      note: 'Navigation library',
      icon: 'code-tags',
    },
    {
      name: 'react-native-paper',
      link: 'https://reactnativepaper.com/',
      note: 'Material 3 UI library',
      icon: 'code-tags',
    },
    {
      name: 'expo-material3-theme',
      link: 'https://github.com/pchmn/expo-material3-theme',
      note: 'Material 3 dynamic theme color library',
      icon: 'code-tags',
    },
    {
      name: 'react-native-firebase',
      link: 'https://rnfirebase.io/',
      note: 'Firebase library',
      icon: 'code-tags',
    },
    {
      name: 'notifee',
      link: 'https://notifee.app/',
      note: 'Notification library',
      icon: 'code-tags',
    },
    {
      name: 'async-storage',
      link: 'https://react-native-async-storage.github.io/async-storage/',
      note: 'Local storage library',
      icon: 'code-tags',
    },
    {
      name: 'Material Design Icons',
      link: 'https://pictogrammers.com/library/mdi/',
      note: 'Icons',
      icon: 'brush',
    },
    {
      name: 'react-native-vector-icons',
      link: 'https://github.com/oblador/react-native-vector-icons',
      note: 'Icon library',
      icon: 'code-tags',
    },
    {
      name: 'react-native-svg',
      link: 'https://github.com/software-mansion/react-native-svg',
      note: 'SVG library',
      icon: 'code-tags',
    },
    {
      name: 'react-native-svg-transformer',
      link: 'https://github.com/kristerkari/react-native-svg-transformer',
      note: 'SVG transformer library',
      icon: 'code-tags',
    },
    {
      name: 'react-native-navigation-bar-color',
      link: 'https://github.com/thebylito/react-native-navigation-bar-color',
      note: 'Navbar color library',
      icon: 'code-tags',
    },
    {
      name: 'react-native-clipboard',
      link: 'https://github.com/react-native-clipboard/clipboard',
      note: 'Clipboard library',
      icon: 'code-tags',
    },
    {
      name: 'date-fns',
      link: 'https://github.com/date-fns/date-fns',
      note: 'Date functions library',
      icon: 'code-tags',
    },
    {
      name: 'deepmerge',
      link: 'https://github.com/TehShrike/deepmerge',
      note: 'Object merge library',
      icon: 'code-tags',
    }
  ];
  const theme = useTheme();
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenTitle>Credits</ScreenTitle>
      <Text
        style={{marginHorizontal: 24, marginBottom: 16}}
        variant="bodySmall">
        If you wish to be credited too,{' '}
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
          open an issue on GitHub
        </Text>
        .
      </Text>
      <ScrollView>
        {creditsItems.map(el => (
          <OneCreditsItem
            key={el.name}
            icon={el.icon}
            name={el.name}
            link={el.link}
            note={el.note}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
