import { View } from 'react-native'
import { useTheme, Text } from 'react-native-paper';
import sz from './img/sz.svg'
import React from 'react'

export default function OneVoy({ dataSource, voyNumber }) {
  const theme = useTheme()
  const logoList = {
    sz: sz
  }
  const Logo = logoList[dataSource]
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Logo width={24} color={theme.colors.primary} />
      <Text style={{marginHorizontal: 8}} variant='titleLarge'>{voyNumber}</Text>
    </View>
  )
}