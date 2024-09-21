/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가
import dummyData from './dummyData.json'; // 더미 데이터를 불러옴
import {useNavigation} from '@react-navigation/native';

function Main_Map(): JSX.Element {
  const [showBtn, setShowBtn] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigation = useNavigation(); // Navigation 객체

  const handleLongPress = async (_event: any) => {
    setShowBtn(true);
  };

  const handleAddMarker = (_title: string) => {
    setShowBtn(false);
  };

  const saveToAsyncStorage = async (selectedDeparture, selectedDestination) => {
    try {
      const existingData = await AsyncStorage.getItem('callList');
      const callList = existingData ? JSON.parse(existingData) : [];
      const newEntry = {
        id: callList.length + 1,
        start_addr: selectedDeparture,
        end_addr: selectedDestination,
        call_state: 'REQ',
      };
      await AsyncStorage.setItem(
        'callList',
        JSON.stringify([...callList, newEntry]),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const selectRandomLocations = () => {
    setLoading(true); // 로딩 시작
    const shuffledLocations = [...dummyData.locations].sort(
      () => 0.5 - Math.random(),
    );
    const selectedDeparture = shuffledLocations[0];
    const selectedDestination = shuffledLocations[1];
    setDeparture(selectedDeparture);
    setDestination(selectedDestination);

    // AsyncStorage에 출발지/도착지 저장
    saveToAsyncStorage(selectedDeparture, selectedDestination);

    // 1초 후에 로딩 종료
    setTimeout(() => {
      setLoading(false); // 로딩 종료
    }, 1000); // 1초 지연
  };

  return (
    <SafeAreaView style={styles.container}>
      {/** 지도 */}
      <View style={[styles.container, {transform: [{scaleX: 1}, {scaleY: 2}]}]}>
        <Icon
          name="building"
          size={300}
          color={'#34db98'}
          onPress={() => setShowBtn(false)}
          onLongPress={handleLongPress}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          padding: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <TextInput
              style={styles.input}
              placeholder={'출발지'}
              value={departure}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder={'도착지'}
              value={destination}
              editable={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, {margin: 10, justifyContent: 'center'}]}
            onPress={selectRandomLocations}
            disabled={loading}>
            <Text style={styles.buttonText}>호출</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/** 로딩 스피너 */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>호출 중...</Text>
        </View>
      )}

      {/** 내 위치 */}
      <TouchableOpacity style={{position: 'absolute', bottom: 20, right: 20}}>
        <Icon name="crosshairs" size={40} color={'#3498db'} />
      </TouchableOpacity>

      {showBtn && (
        <View
          style={{
            position: 'absolute',
            top: hp(50),
            left: wp(50) - 75,
            height: 90,
            width: 150,
          }}>
          <TouchableOpacity
            style={[styles.button, {flex: 1, marginVertical: 1}]}
            onPress={() => handleAddMarker('출발지')}>
            <Text style={styles.buttonText}>출발지로 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {flex: 1}]}
            onPress={() => handleAddMarker('도착지')}>
            <Text style={styles.buttonText}>도착지로 등록</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: 'gray',
    marginVertical: 1,
    padding: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
});

export default Main_Map;
