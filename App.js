import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import pokemonDataList from './src/Data/pokemon-data.json';
import {ForeignLanguageQuizScreen} from './src/Screens/ForeignLanguageQuizScreen';
import { ForeignLanguageQuizSettingScreen } from './src/Screens/ForeignLanguageQuizSettingScreen';
import HomeScreen from './src/Screens/HomeScreen';
import PokebunruiSettingScreen from './src/Screens/PokebunruiSettingScreen';


const Stack = createStackNavigator();

export default function App() {



  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="pokebunruiSetting" component={PokebunruiSettingScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="ForeignLanguageQuizSetting" component={ForeignLanguageQuizSettingScreen} />
        <Stack.Screen name="ForeignLanguageQuiz" component={ForeignLanguageQuizScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





function ResultScreen({navigation, route}) {
  const {totalScore} = route.params;
  return (
  <View style={styles.container}>
    <Text style={styles.text}>得点：{totalScore}</Text>
    <Button title='Home' onPress={() => navigation.navigate('Home')} />
    <StatusBar style="auto" />
  </View>
  );
}

  //idを指定すると分類を持ってくる関数
async function getPokebunrui(setPokebunrui, questionRange) {
  console.log(questionRange);

  function getRandomId(max){
    return Math.floor(Math.random()*max) + 1;
  }
  //とりあえずシンオウまでなので493としている
  const id = getRandomId(Number(questionRange) + 1);
  console.log(id)

  //地方の取得
  let region;
  id < 152 ? region = 'カントー':
  id < 252 ? region = 'ジョウト':
  id < 387 ? region = 'ホウエン': 
  id < 494 ? region = 'シンオウ':
  id < 650 ? region = 'イッシュ':
  id < 722 ? region = 'カロス':
  id < 808 ? region = 'アローラ':
  id < 899 ? region = 'ガラル':
  id < 905 ? region = 'ヒスイ': region = 'パルデア';

  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const response = await data.json();

    // ポケモン種族情報取得.
    const speciesUrl = response.species.url;
    const dataSpecies = await fetch(speciesUrl);
    const responseSpecies = await dataSpecies.json();

    // 分類
    const pokemon = pokemonDataList.find(pokemon => pokemon.id === String(id));

    console.log(pokemon);
    const genus = pokemon.species;


    console.log(genus);            


    //名前
    const names = responseSpecies.names.find((v) => v.language.name == "ja" || v.language.name === "ja-Hrkt");
    const name = names.name;

    console.log(name);
    
    //画像
    const imageUrl = response.sprites.front_default;
    console.log(imageUrl);


    //------------------ここまでぶんるい、ここからタイプ---------------

// タイプ.
    const responseTypes = response.types;
    console.log(responseTypes);
    const typesLength = responseTypes.length;
    let types = '';
    for (let i = 0; i < typesLength; i++) {
      console.log(responseTypes[i].type.url)
      const typeUrl = responseTypes[i].type.url;
      const responseTypeData = await fetch(typeUrl);
      const responseType = await responseTypeData.json();

      const responseTypeName = responseType.names;
      console.log(responseTypeName)

      const type = responseTypeName.find((v) => v.language.name === "ja" || v.language.name === "ja-Hrkt");
      if (i > 0) {
        types += '/';
      }
      types += type.name;
    }
    console.log(types)
    

      //別解を探してリストにしておく
    const correctAnswerList = [];
    for (let j=0; j<questionRange; j++) {
      if (pokemonDataList[j].species === genus) {
        correctAnswerList.push(pokemonDataList[j].name)
      }
    }
    console.log(correctAnswerList)
    setPokebunrui({ region, genus, name, imageUrl, types, correctAnswerList });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

function QuizScreen({navigation, route}) {
  const {questionRange} = route.params;
  const [pokebunrui, setPokebunrui] = useState({region:'', genus: '', name: '',imageUrl: '', types: '' , correctAnswerList:[]});
  const [quizCount, setQuizCount] = useState(1);

  useEffect(() => {
    getPokebunrui(setPokebunrui, questionRange);
  }, [questionRange]);


  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');
  const [hintButton, setHintButton] = useState('ヒント１を見る')

  //ヒントと得点
  const [totalScore, setTotalScore] = useState(0);
  const [thisScore, setThisScore] = useState(5);
  const [btnBackgroundColor, setBtnBackgroundColor] = useState('gray');

  const showHint = () => {
    if (thisScore > 0) {
      setThisScore(thisScore - 1);
    }

    if (!hint1)  {
      setHint1(pokebunrui.region);
      setHintButton('ヒント２を見る')
      
    }else if (!hint2){
      setHint2(pokebunrui.types);
      setHintButton('諦める');
      setBtnBackgroundColor('red');

    }else {
      setThisScore(0);
      showAnswer();
    }
  };

  const [inputText, setInputText] = useState('');
  const [trueOrFalse, setTrueOrFalse] = useState('');
  const [nextQuizDisabled, setNextQuizDisabled] = useState(true)


  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctAnswerDisplay, setCorrectAnswerDisplay] = useState('none')
  const [answerBtnDisabled, setAnswerBtnDisabled] = useState(true);
  const [nextQuizText, setNextQuizText] =useState('次の問題');

  const showAnswer = () => {
    const correctAnswers = pokebunrui.correctAnswerList.join('\n');
    setCorrectAnswer(correctAnswers);
    setCorrectAnswerDisplay('');
    setNextQuizDisabled(false);
    setAnswerBtnDisabled(true);
    setHint1(pokebunrui.region);
    setHint2(pokebunrui.types);
  }


  const checkAnswer = () => {
    if (pokebunrui.correctAnswerList.includes(inputText)) {
      setTrueOrFalse('正解！');
      showAnswer();
      setTotalScore(totalScore + thisScore);
    } else {
      setTrueOrFalse('不正解');
      if (thisScore > 0) {
        setThisScore(thisScore - 1);
      }
    }
  };

  useEffect(() => {
    setAnswerBtnDisabled(inputText.trim() === ''); // inputTextが空欄のときにボタンをdisabledにする
  }, [inputText]);

  const nextQuiz = () => {

    if (quizCount === 10) {
      navigation.navigate('Result', {totalScore});
    }else {
      getPokebunrui(setPokebunrui, questionRange);
      setCorrectAnswer('');
      setCorrectAnswerDisplay('none');
      setHint1('');
      setHint2('');
      setBtnBackgroundColor('gray');
      setInputText('');
      setTrueOrFalse('');
      setAnswerBtnDisabled(false);
      setNextQuizDisabled(true);
      setHintButton('ヒント１を見る');
      setThisScore(5);
      setQuizCount(quizCount + 1);
      setTrueOrFalse('');
      if (quizCount === 9) {
        setNextQuizText('次に進む');
      }
    }

  };

  return (
    <View style={styles.container}>
      <Text>{quizCount}問目</Text>
      <Text>このポケモンはなに？</Text>
      <Text>現在の得点：{totalScore}点</Text>
      <Text>正解すると{thisScore}点獲得</Text>
      <Text style={{ ...styles.TorF, color: trueOrFalse === '正解！' ? 'red' : 'blue' }}>{trueOrFalse}</Text>
      <Text style={styles.text}>ぶんるい：{pokebunrui.genus}</Text>
      <View style={styles.questionWrapper}>
        <View style={styles.resultContainer}>
          <View>
            <Text style={{display: correctAnswerDisplay}}>{`回答例：\n${correctAnswer}`}</Text>
          </View>
          <Image
            style={[styles.img, {display: correctAnswerDisplay}]}
            source={{ uri: pokebunrui.imageUrl}}
          />
        </View>
        
        <View style={styles.hintContainer}>
          <TouchableOpacity
            style={[styles.hintButton, {backgroundColor: btnBackgroundColor}]}
            onPress={showHint}
          >
            <Text style={styles.hintButtonText}>{hintButton}</Text>
          </TouchableOpacity>
          <Text>ヒント１：{hint1}</Text>
          <Text>ヒント２：{hint2}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder='ここに回答を入力'
          keyboardType='default'
        />
        
        <TouchableOpacity
          style={[styles.btn, answerBtnDisabled && styles.btnDisabled]}
          onPress={checkAnswer}
          disabled={answerBtnDisabled}
        >
          <Text style={styles.btnText}>回答</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, nextQuizDisabled && styles.btnDisabled]}
          onPress={nextQuiz}
          disabled={nextQuizDisabled}
        >
          <Text style={styles.btnText}>{nextQuizText}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
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
  text: {
    margin: 20,
    fontSize: 16,
    color: '#333',
  },
  TorF: {
    margin: 20,
    fontSize: 26,
    fontWeight: 'bold',
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
