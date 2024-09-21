import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {
  useNavigation,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({
  route,
}: {
  route: RouteProp<ParamListBase, 'Login'>;
}): JSX.Element {
  console.log('-- Login()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [disable, setDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (route.params?.showMessage) {
      setErrorMessage('재인증이 필요합니다.');
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('autoLoginCount');
    }
  }, [route.params?.showMessage]);

  const onIdChange = (newId: string) => {
    newId ? setDisable(false) : setDisable(true);
    setUserId(newId);
    setErrorMessage('');
  };

  const onPwChange = (newPw: string) => {
    newPw ? setDisable(false) : setDisable(true);
    setUserPw(newPw);
    setErrorMessage('');
  };

  const gotoRegister = () => {
    navigation.push('Register');
  };

  const gotoMain = async () => {
    if (countdown > 0) {
      setErrorMessage(`${countdown}초 후 로그인 가능합니다.`);
      return;
    }

    // 아이디와 패스워드가 모두 입력되지 않았을 경우
    if (!userId || !userPw) {
      const newAttempts = failedAttempts + 1; // 실패 횟수 증가
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setCountdown(10);
        setDisable(true);
        setErrorMessage('10초 후 로그인 가능합니다.');

        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setDisable(false);
              clearInterval(timer);
              return 0;
            }
            setErrorMessage(`${prev - 1}초 후 로그인 가능합니다.`);
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMessage('유효하지 않은 접근입니다.');
      }
      setUserId('');
      setUserPw('');
      return;
    }

    // 임의의 아이디와 비밀번호
    const validUserId = '123';
    const validUserPw = '123';

    // 로그인 성공 여부 결정
    if (userId === validUserId && userPw === validUserPw) {
      await AsyncStorage.setItem('userId', userId);
      let autoLoginCount = await AsyncStorage.getItem('autoLoginCount');
      autoLoginCount = autoLoginCount ? parseInt(autoLoginCount) + 1 : 1;
      await AsyncStorage.setItem('autoLoginCount', autoLoginCount.toString());
      navigation.push('Main');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setCountdown(10);
        setDisable(true);
        setErrorMessage('10초 후 로그인 가능합니다.');

        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setDisable(false);
              clearInterval(timer);
              return 0;
            }
            setErrorMessage(`${prev - 1}초 후 로그인 가능합니다.`);
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMessage('아이디와 패스워드를 다시 확인해주세요.');
      }
      setUserId('');
      setUserPw('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Icon name="taxi" size={80} color={'#3498db'} />
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={'아이디'}
          value={userId}
          onChangeText={onIdChange}
        />
        <TextInput
          style={styles.input}
          placeholder={'패스워드'}
          secureTextEntry={true}
          value={userPw}
          onChangeText={onPwChange}
        />
        {/* 에러 메시지 표시 */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={disable ? styles.buttonDisable : styles.button}
          disabled={disable}
          onPress={gotoMain}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {marginTop: 5}]}
          onPress={gotoRegister}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
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
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisable: {
    width: '70%',
    backgroundColor: 'gray',
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
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;
