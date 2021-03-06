import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  } from 'react-native';
import mStyles from '../../styles/main';
import Separator from '../../helpers/Separator';
import firebase from '../../firebase.js';
import Summary from '../summary/Summary';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#51602D',
    marginBottom: 15,
    textAlign: 'center',
  },
  percent: {
    color: '#51602D',
    fontSize: 30,
    marginBottom: 100,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  selectedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  selectedButton: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#9CB65E',
    borderColor: '#9CB65E',
    borderWidth: 0.2,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 80,
    marginLeft: 80,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  button: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#9CB65E',
    borderColor: '#393E46',
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 80,
    marginLeft: 80,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    padding: 4,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 40,
    fontSize: 23,
    textAlign: 'center',
    color: '#51602D',
  },
});

class Savings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      income: '',
      percent: '',
      savings: '',
    };
  }

  componentDidMount() {
    const user = this.props.user;
    firebase.database().ref(`users/${user.uid}`).child('income').on('value', (snapshot) => {
      const income = snapshot.val() || 0;
      this.setState(
        {
          income,
        }
      );
    });
  }

  handleSubmit() {
    const user = this.props.user;
    const { savings } = this.state;
    firebase.database().ref(`users/${user.uid}`).update(
      {
        savings,
      }
  );
    this.props.navigator.push({
      title: 'Summary',
      component: Summary,
      navigationBarHidden: 'false',
      passProps: { user },
    });
  }


  handleInputChange(input) {
    const { income } = this.state;
    const number = parseInt(input, 10);
    this.setState(
      {
        savings: number,
      }
    );

    const percent = Math.floor((number / income) * 100);
    this.setState(
      {
        percent,
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={mStyles.title}> Savings </Text>
        <Separator />

        <Text style={mStyles.intro}>
          Here you will enter the amount or % you want to save each month.
          It will be deducted from your available funds.

          This is a good idea because it forces you to set aside a specific
          amount for the future.
        </Text>

        <Text style={styles.text}>
          $ Amount
        </Text>

        <TextInput
          style={styles.input}
          autoFocus={true}
          keyboardType="numeric"
          onChangeText={input => this.handleInputChange(input)}
          placeholder="$"
        />

        <Text style={styles.text}>
          % of Monthly Income
        </Text>
        <Text style={styles.percent}>
          {this.state.percent} %
        </Text>

        <TouchableHighlight
          style={styles.button}
          underlayColor="#9CB65E"
          onPress={() => this.handleSubmit()}
        >
          <Text
            style={styles.buttonText}
          >
            Continue
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

Savings.propTypes = {
  user: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  push: PropTypes.func,
};

export default Savings;
