import React from 'react';
import { View, Text, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const Header = () => (
  <View style={globalStyles.header}>
    <Image
      source={{ uri: 'https://interactiveutopia.com/images/logo.jpg' }}
      style={globalStyles.logo}
    />
    <Text style={globalStyles.headerTitle}>Solar Power Estimate</Text>
  </View>
);

export default Header;
