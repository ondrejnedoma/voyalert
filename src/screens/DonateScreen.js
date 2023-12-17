import React from 'react';
import {Linking, SafeAreaView, ScrollView, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

import OneDonateItem from '../OneDonateItem';
import ScreenTitle from '../ScreenTitle';

export default function DonateScreen() {
  const donateItems = [
    {
      icon: 'cash',
      address: '4671837053/0800',
      note: 'Czech bank account number',
    },
    {
      icon: 'cash',
      address: 'CZ74 0800 0000 0046 7183 7053',
      note: 'IBAN (BIC: GIBACZPX)',
    },
    {
      icon: 'bitcoin',
      address: 'bc1qzg0lp7n45s07x5h8m7fhyhy5jhy6l0dz7zrtx6',
      note: 'BTC',
    },
    {
      icon: 'ethereum',
      address: '0x12b92910b52738000EF5d17409d54f067ABcca07',
      note: 'ETH and all EVM-compatible blockchains',
    },
    {
      icon: 'litecoin',
      address: 'ltc1q3q87evq5fjdtjydn827hac6cpq5wwa9cwtxe7c',
      note: 'LTC',
    },
  ];

  const theme = useTheme();
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenTitle>Donate to VoyAlert</ScreenTitle>
      <ScrollView>
        <View style={{marginHorizontal: 24}}>
          <Text
            style={{marginBottom: 4}}
            variant="titleMedium">
            Before you donate, read this:
          </Text>
          <Text
            style={{marginBottom: 24}}
            variant="bodySmall">
            The VoyAlert app and all of its components are completely{' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: theme.colors.primary,
              }}
              variant="bodySmall"
              onPress={() =>
                Linking.openURL('https://github.com/ondrejnedoma/voyalert')
              }>
              open-source
            </Text>
            . I am a high school student and my top priority for this app is for
            it to feel modern, snappy and easily usable, not to make millions
            from ads, in-app purchases or from making this a paid app like most
            big corporations would. In my opinion, donations are the least
            invasive form of monetization. If you like my work and can afford to
            donate, a donation would be greatly appreciated. The money received
            from these donations will be primarily used to keep the backend
            server running, pay for the yearly charge for a domain name and to
            cover any other expenses related to VoyAlert. Secondarily, coffee.
            ☕
          </Text>
          <Text
            style={{marginBottom: 4}}
            variant="titleMedium">
            Donation channels:
          </Text>
          <Text
            style={{marginBottom: 16}}
            variant="bodySmall">
            Click on any channel to copy its address/number
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
