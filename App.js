import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Container, Content } from 'native-base';
import { initAuthenticator } from './store/actions';
import ActionList from './components/ActionList';

const App: () => React$Node = () => {
  const initialized = useSelector(state => !!state.service.authenticator);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuthenticator());
  }, [dispatch]);

  return (
    <>
      <Container>
        <Content>
          {initialized && <ActionList />}
          {!initialized && <Text>loading...</Text>}
        </Content>
      </Container>
    </>
  );
};

export default App;
