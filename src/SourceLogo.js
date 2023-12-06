import {useTheme} from 'react-native-paper';
import sz from './img/sz.svg';
import idsok from './img/idsok.svg';
import React from 'react';

export default function SourceLogo({dataSource, size}) {
  const theme = useTheme();
  const logoList = {
    sz: sz,
    idsok: idsok,
  };
  const Logo = logoList[dataSource];
  return <Logo width={size} color={theme.colors.primary} />;
}
