import { useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'; // expo-status-barからインポート

export default function PokebunruiSettingScreen({ navigation }) {
    const [questionRange, setQuestionRange] = useState('');
    const [notSelected, setNotSelected] = useState(true);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>ぶんるいからポケモンを当てるクイズ</Text>
        <RNPickerSelect
          items={[
            { label: 'カントーまで', value: '151' },
            { label: 'ジョウトまで', value: '251' },
            { label: 'ホウエンまで', value: '386' },
            { label: 'シンオウまで', value: '493' },
            { label: 'イッシュまで', value: '649' },
            { label: 'カロスまで', value: '721' },
            { label: 'アローラまで', value: '807' },
            { label: 'ガラルまで', value: '898' },
            { label: 'ヒスイまで', value: '904' },
            { label: 'パルデアまで', value: '1025' },
          ]}
          placeholder={{ label: '出題範囲を選んでください', value: '' }}
          onValueChange={(value) => {
            setQuestionRange(value);
            if (value) {
              setNotSelected(false);
            }
          }}
        />
        <TouchableOpacity
          style={[styles.btn, notSelected && styles.btnDisabled]}
          onPress={() => navigation.navigate('Quiz', { questionRange })}
          disabled={notSelected}
        >
          <Text style={styles.btnText}>start</Text>
        </TouchableOpacity>
        <ExpoStatusBar style="auto" />
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      margin: 20,
      fontSize: 16,
      color: '#333',
    },
    questionWrapper: {
      marginVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    resultContainer: {
      width: 200,
      height: 100,
      margin: 10,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    img: {
      width: 70,
      height: 70,
      alignSelf: 'center',
      borderRadius: 35,
      borderWidth: 2,
      borderColor: '#ddd',
    },
    hintContainer: {
      width: 150,
      margin: 20,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    hintButton: {
      padding: 10,
      backgroundColor: '#007BFF',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    hintButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    input: {
      width: 200,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      margin: 5,
    },
    btn: {
      height: 50,
      backgroundColor: '#28a745',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      marginHorizontal: 5,
    },
    btnDisabled: {
      backgroundColor: '#ccc',
    },
    btnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
  