import { StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeScreen({ navigation }) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ポケモンクイズ</Text>
        <Text style={styles.subtitle}>クイズの種類を選んでください</Text>
        
        <TouchableOpacity style={styles.selectQuizBtn} onPress={() => navigation.navigate('pokebunruiSetting')}>
          <Text style={styles.selectQuizBtnText}>「ぶんるい」からポケモンを当てるクイズ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.selectQuizBtn} onPress={() => navigation.navigate('ForeignLanguageQuizSetting')}>
          <Text style={styles.selectQuizBtnText}>「外国語名」からポケモンを当てるクイズ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.selectQuizBtn} onPress={() => navigation.navigate('SilhouetteSetting')}>
          <Text style={styles.selectQuizBtnText}>シルエットからポケモンを当てるクイズ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.selectQuizBtn} onPress={() => alert('他のクイズはまだ実装されていません')}>
          <Text style={styles.selectQuizBtnText}>Coming soon...</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
      },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
      },
    selectQuizBtn: {
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
        marginVertical: 10,
        width: '80%',
      },
    selectQuizBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      },
  });