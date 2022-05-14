import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  // TESTE
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Button as ButtonRN,
  Keyboard,
} from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

import { FeedbackType } from "../Widget";
import { ScreenshotButton } from "../ScreenshotButton";
import { Button } from "../Button";

import { styles } from "./styles";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";
import { api } from "../../libs/api";

const KeyboardAvoidingComponent = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles2.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles2.inner}>
          <Text style={styles2.header}>Header  Header</Text>
          <TextInput placeholder="Username" style={styles2.textInput} />
          <View style={styles2.btnContainer}>
            <ButtonRN title="Submit" onPress={() => null} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: Props) {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: "jpg",
      quality: 0.8,
    })
      .then((uri) => setScreenshot(uri))
      .catch((error) => console.log(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    const screenshotBase64 =
      screenshot &&
      (await FileSystem.readAsStringAsync(screenshot, { encoding: "base64" }));

    try {
      await api.post("feedbacks", {
        type: feedbackType,
        comment,
        screenshot: `data:image/png;base64,${screenshotBase64}`,
      });

      onFeedbackSent();
    } catch (error) {
      console.log(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft size={24} color={theme.colors.text_secondary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />

          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />

        <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
      </View>
    </View>
  );
}
