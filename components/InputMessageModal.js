import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, Card, CardItem, Item, Label, Input } from 'native-base';
import Modal from 'react-native-modal';

const InputMessageModal: () => React$Node = ({
  title,
  value,
  placeholder,
  onCancel,
  onConfirm,
  visible,
}) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(value);
  }, [value]);

  return (
    <Modal isVisible={visible}>
      <Card>
        <CardItem header>
          <Text>{title}</Text>
        </CardItem>
        <CardItem>
          <Item stackedLabel>
            <Label>{placeholder}</Label>
            <Input value={message} onChangeText={setMessage} />
          </Item>
        </CardItem>
        <CardItem footer style={styles.footer}>
          <Button transparent onPress={onCancel}>
            <Text>Cancel</Text>
          </Button>
          <Button
            transparent
            onPress={() => {
              onConfirm(message);
              setMessage('');
            }}>
            <Text>OK</Text>
          </Button>
        </CardItem>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'flex-end',
  },
});
export default InputMessageModal;
