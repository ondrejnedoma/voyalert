import {View} from 'react-native';
import {IconButton} from 'react-native-paper';

export default function AppBar({children, buttonsLeft, buttonsRight}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        marginHorizontal: -18,
      }}>
      <View style={{flexDirection: 'row'}}>
        {buttonsLeft?.map(el => (
          <IconButton
            key={el.icon}
            icon={el.icon}
            size={24}
            onPress={el.onPress}
            disabled={el.disabled}
          />
        ))}
      </View>
      <View style={{flexDirection: 'row'}}>
        {buttonsRight?.map(el => (
          <IconButton
            key={el.icon}
            icon={el.icon}
            size={24}
            onPress={el.onPress}
            disabled={el.disabled}
          />
        ))}
        {children}
      </View>
    </View>
  );
}
