import React from 'react';
import {Linking, SafeAreaView, ScrollView, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

import OneDonateItem from '../components/OneDonateItem';
import ScreenTitle from '../components/ScreenTitle';
import {useTranslation} from 'react-i18next';

export default function DonateScreen() {
  const {t} = useTranslation();
  const donateItems = [
    {
      icon: 'cash',
      address: '4671837053/0800',
      note: t('donate.items.bankAccountCz'),
    },
    {
      icon: 'cash',
      address: 'CZ74 0800 0000 0046 7183 7053',
      note: t('donate.items.bankAccountIBAN'),
    },
    {
      icon: 'bitcoin',
      address: 'bc1qzg0lp7n45s07x5h8m7fhyhy5jhy6l0dz7zrtx6',
      note: t('donate.items.btc'),
    },
    {
      icon: 'ethereum',
      address: '0x12b92910b52738000EF5d17409d54f067ABcca07',
      note: t('donate.items.eth'),
    },
    {
      icon: 'litecoin',
      address: 'ltc1q3q87evq5fjdtjydn827hac6cpq5wwa9cwtxe7c',
      note: t('donate.items.ltc'),
    },
  ];

  const theme = useTheme();
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenTitle>{t('donate.title')}</ScreenTitle>
      <ScrollView>
        <View style={{marginHorizontal: 24}}>
          <Text
            style={{marginBottom: 4}}
            variant="titleMedium">
            {t('donate.beforeDonate')}
          </Text>
          <Text
            style={{marginBottom: 24}}
            variant="bodySmall">
            {t('donate.donateTextPart1')}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: theme.colors.primary,
              }}
              variant="bodySmall"
              onPress={() =>
                Linking.openURL('https://github.com/ondrejnedoma/voyalert')
              }>
              {t('donate.openSource')}
            </Text>
            {t('donate.donateTextPart2')}
          </Text>
          <Text
            style={{marginBottom: 4}}
            variant="titleMedium">
            {t('donate.donationChannels')}
          </Text>
          <Text
            style={{marginBottom: 16}}
            variant="bodySmall">
            {t('donate.donationChannelsHint')}
          </Text>
        </View>
        {donateItems.map(el => (
          <OneDonateItem
            key={el.address}
            icon={el.icon}
            address={el.address}
            note={el.note}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
