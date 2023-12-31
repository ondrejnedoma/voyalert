import React from 'react';
import {useTheme} from 'react-native-paper';

import idsok from './img/idsok.svg';
import sz from './img/sz.svg';

export default function SourceLogo({dataSource, size}) {
  const theme = useTheme();
  const logoList = {
    sz: sz,
    idsok: idsok,
  };
  const Logo = logoList[dataSource];
  return (
    <Logo
      width={size}
      height={size}
      color={theme.colors.primary}
    />
  );
}
