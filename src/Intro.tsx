import {SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_LOGIN_COUNT_KEY = 'autoLoginCount';

async function getAutoLoginCount() {
  const count = await AsyncStorage.getItem(AUTO_LOGIN_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

async function incrementAutoLoginCount() {
  let count = await getAutoLoginCount();
  count++;
  await AsyncStorage.setItem(AUTO_LOGIN_COUNT_KEY, count.toString());
  return count;
}

async function resetAutoLoginCount() {
  await AsyncStorage.removeItem(AUTO_LOGIN_COUNT_KEY);
}

function Intro(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useFocusEffect(
    React.useCallback(() => {
      const checkAutoLogin = async () => {
        let userId = await AsyncStorage.getItem('userId');
        let isAutoLogin = userId ? true : false;

        if (isAutoLogin) {
          let count = await incrementAutoLoginCount();
          if (count >= 4) {
            // 3회 사용 후 자동 로그아웃
            await resetAutoLoginCount(); // 횟수 초기화
            navigation.push('Login', {showMessage: true}); // 로그인 화면으로 이동하며 메시지 표시
          } else {
            navigation.push('Main'); // 메인 화면으로 이동
          }
        } else {
          navigation.push('Login'); // 로그인 화면으로 이동
        }
      };

      const timeoutId = setTimeout(checkAutoLogin, 2000);
      return () => clearTimeout(timeoutId);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="taxi" size={100} color={'#3498db'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Intro;
