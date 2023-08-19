import React, {FC, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Todo, fetchTodos} from './src/todosReducer';
import {Provider} from 'react-redux';
import store, {persistor, IRootState} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import NetInfo from '@react-native-community/netinfo';

export const App: FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const dispatch = useDispatch();
  const todos = useSelector<IRootState>(
    state => state.todoState.todos,
  ) as Todo[];

  useEffect(() => {
    const subscription = NetInfo.addEventListener(networkState => {
      if (networkState.isConnected) {
        dispatch(fetchTodos() as any);
      }
      setIsOffline(!networkState.isConnected);
    });
    return subscription;
  }, []);

  useEffect(() => {
    if (isOffline) {
      setTimeout(() => {
        setIsOffline(false);
      }, 2000);
    }
  }, [isOffline]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar />

      {isOffline && (
        <View style={styles.messageInfo}>
          <Text style={{color: 'orange'}}>
            You're offline, connect to network to get the latest todos
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Todos</Text>
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            style={styles.showAll}>
            <Text>{showAll ? 'Only Todos' : 'Show all'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{width: '100%'}}>
          {todos.length > 0 &&
            todos
              .filter(it => {
                return !showAll ? !it.completed : true;
              })
              .map((todo, index) => (
                <View
                  key={index}
                  style={[
                    styles.listItem,
                    {
                      borderRightWidth: todo.completed ? 3 : 0,
                      borderRightColor: todo.completed
                        ? 'lightgreen'
                        : 'rgba(0,0,0,0.1)',
                    },
                  ]}>
                  <Text style={styles.textId}>{todo.id}</Text>
                  <View
                    style={[
                      styles.content,
                      {
                        width: todo.completed ? '70%' : '87%',
                      },
                    ]}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      {todo.title}
                    </Text>
                    <Text>{todo.userId}</Text>
                  </View>
                  {todo.completed && <Text style={styles.completed}>DONE</Text>}
                </View>
              ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export const RootApp = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginTop: 40,
  },
  title: {
    width: '50%',
    padding: 4,
    fontSize: 24,
  },
  showAll: {
    padding: 10,
    borderRadius: 10,
  },
  listItem: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textId: {
    width: '10%',
    paddingHorizontal: 5,
  },
  completed: {
    width: '17%',
  },
  messageInfo: {
    position: 'absolute',
    padding: 10,
    borderRadius: 10,
    width: 300,
    bottom: 40,
    left: 150,
    marginLeft: -100,
    backgroundColor: 'black',
    elevation: 3,
  },
});
