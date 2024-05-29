// SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { signOut } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const optionsData = [
  { id: '2', title: 'Privacy Policy' },
  { id: '3', title: 'Terms of Service' },
  { id: '4', title: 'Log Out' },
  // Add more options as needed
];

const privacyPolicyText = `
Draema Privacy Policy

Last Updated: 30 April 2024

1. Introduction:

Welcome to Draema! This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can manage your personal information.

2. Information We Collect:

- User-Provided Information: We collect information you provide when you use our app, including but not limited to your username, email address, profile picture, and content you create.

- AI-Generated Data: Our AI technology may process and analyze content you provide to generate personalized video content and recommendations.

3. How We Use Your Information:

We use the collected information for purposes including providing and improving our services, personalizing content, and ensuring the security of your account.

4. Sharing Your Information:

We do not sell your personal information. We may share information with third-party service providers to assist us in delivering our services. We will not share your content with others unless you choose to make it public.

5. Security:

We take reasonable measures to protect your personal information, but no method of transmission over the internet is completely secure. Please be aware of this when sharing information with us.

6. Your Choices:

You can manage your personal information and privacy settings within the app. You have the right to request access, correction, or deletion of your personal data.

7. Changes to This Policy:

We may update this Privacy Policy from time to time. We will notify you of any significant changes through the app or other means.
`;

// Terms of Service
const termsOfServiceText = `
Draema Terms of Service

Last Updated: 30 April 2024

1. Acceptance of Terms:

By using Draema, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.

2. User Content:

You retain ownership of the content you create using our app. By uploading content, you grant us a non-exclusive, royalty-free license to use, modify, and distribute the content for the purpose of providing our services.

3. Prohibited Conduct:

You agree not to engage in any conduct that violates these terms, including but not limited to uploading harmful content, impersonating others, or violating applicable laws.

4. AI-Generated Content:

Our app uses AI technology to generate content based on user input. You understand that AI-generated content is the result of automated processes, and we are not responsible for its accuracy or consequences.

5. Termination:

We reserve the right to terminate or suspend your account for violations of these terms or for any other reason.

6. Disclaimer of Warranties:

We provide the app "as is" without warranties of any kind. We disclaim any responsibility for the accuracy, completeness, or usefulness of the app's content.

7. Governing Law:

These terms are governed by the laws of [Your Jurisdiction]. Any disputes arising from or relating to these terms shall be resolved in the courts of [Your Jurisdiction].

8. Contact Us:

If you have any questions or concerns about these terms or our services, please contact us at [Your Contact Information].
`;

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOptionPress = (item) => {
    if (item.title === 'Privacy Policy' || item.title === 'Terms of Service') {
      setModalContent(item.title === 'Privacy Policy' ? privacyPolicyText : termsOfServiceText);
      setModalVisible(true);
    } else if (item.title === 'Log Out') {
      // Display confirmation dialog before logging out
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Log Out',
            onPress: () => handleLogOut(),
          },
        ],
        { cancelable: false }
      );
    } else {
      // Handle other options as needed
    }
  };
  const deleteData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Data associated with key '${key}' has been removed.`);
    } catch (error) {
      console.error('Error removing data from AsyncStorage:', error);
    }
  };
  const handleLogOut = async () => {
    try {
      await signOut();
      // Additional actions after successful logout, e.g., navigate to login screen
      deleteData('userdreamer');
      //navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionPress(item)}>
      <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <MaterialCommunityIcons name="arrow-left" size={30} color="white" />
        <Text style={styles.optionTex}>Profile</Text>
      </TouchableOpacity>

      {/* Options */}
      <FlatList data={optionsData} keyExtractor={(item) => item.id} renderItem={renderOption} />
      <Text style={styles.optionTe}>Version 1.0</Text>
      <Text style={styles.optionTe}>Version 2 is coming soon with more features including editing features</Text>

      {/* Modal for Privacy Policy and Terms of Service */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalText}>{modalContent}</Text>
          </ScrollView>
          <TouchableOpacity onPress={handleModalClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
    flexDirection: 'row',
  },
  optionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    color: 'white',
  },
  optionTex: {
    marginLeft: 20,
    fontSize: 25,
    color: 'white',
  },
  optionTe: {
    flex: 1,
    fontSize: 15,
    color: 'white',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalText: {
    fontSize: 16,
    color: 'white',
  },
  closeButton: {
    fontSize: 18,
    color: '#3498db',
    marginTop: 10,
  },
});

export default SettingsScreen;
