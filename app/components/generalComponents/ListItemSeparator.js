import { View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';

const ListItemSeparator = () => {
  return (
    <View style={{height: 1, backgroundColor: colors.secondary, width: '100%'}} />
  );
};

export default ListItemSeparator;
