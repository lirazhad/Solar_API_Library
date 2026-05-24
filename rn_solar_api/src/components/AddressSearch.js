import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const AddressSearch = ({ onSearch }) => {
  const [address, setAddress] = useState('');

  return (
    <View style={globalStyles.addressContainer}>
      <TextInput
        style={globalStyles.addressInput}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Get Solar Data" onPress={() => onSearch(address)} />
    </View>
  );
};

export default AddressSearch;
