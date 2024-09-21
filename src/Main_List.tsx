/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가
import {useNavigation} from '@react-navigation/native'; // Navigation 추가

function Main_List(): JSX.Element {
  const [callList, setCallList] = useState([]); // 호출 리스트 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigation = useNavigation();

  useEffect(() => {
    const loadCallList = async () => {
      try {
        const storedCallList = await AsyncStorage.getItem('callList');
        if (storedCallList) {
          setCallList(JSON.parse(storedCallList));
        }
      } catch (error) {
        console.error(error);
      }
    };

    // 화면이 포커스 될 때마다 AsyncStorage에서 데이터를 불러옴
    const unsubscribe = navigation.addListener('focus', loadCallList);

    return unsubscribe;
  }, [navigation]);

  // 상태를 주기적으로 변경 (REQ <-> RES)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCallList(prevList =>
        prevList.map(item =>
          item.call_state === 'REQ' ? {...item, call_state: 'RES'} : item,
        ),
      );
    }, 1000); // 1초마다 상태 변경

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  const requestCallList = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false); // 로딩 상태 해제
    }, 1000); // 1초 후 로딩 상태 해제
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.headerText, {width: wp(80)}]}>
          출발지 / 도착지
        </Text>
        <Text style={[styles.headerText, {width: wp(20)}]}>상태</Text>
      </View>
    );
  };

  const ListItem = ({item}: {item: any}) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 5, width: wp(100)}}>
        <View style={{width: wp(80)}}>
          <Text style={styles.textForm}>{item.start_addr}</Text>
          <Text style={[styles.textForm, {borderTopWidth: 0}]}>
            {item.end_addr}
          </Text>
        </View>
        <View
          style={{
            width: wp(20),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{item.call_state}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{flex: 1}}
        data={callList}
        ListHeaderComponent={Header}
        renderItem={ListItem}
        keyExtractor={(item: any) => item.id.toString()} // key를 id로 설정
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={requestCallList} />
        }
      />

      <Modal transparent={true} visible={loading}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="spinner" size={50} color={'#3498db'} />
          <Text style={{color: 'black'}}>Loading...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 5,
    backgroundColor: '#3498db',
    color: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  textForm: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3498db',
    height: hp(5),
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default Main_List;
