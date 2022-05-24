import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import TapRating from "react-native-ratings/dist/TapRating";
import { Modal } from "../Components/Modal";

type ReviewPageProps = {
}



export const ReviewPage = (props: ReviewPageProps) => {
  
  function ratingCompleted(rating: number) {
    setRatingValue(rating);
  }
  function submitReview(){
    console.log("Rating is: " + ratingValue)
    console.log("Feedback: " + openFeedback)
  }
	const [visible, setVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);
  const [openFeedback, setOpenFeedback] = useState('')
	return (
		<View style={styles.container}>
      <Text style={styles.title}>Your order has arrived!</Text>
      <Button title="Submit Review" onPress={ () => setVisible(true)} />
      <View style={styles.separator} />
      <Modal isVisible={visible}>
        <Modal.Container>
          <View style={styles.modal}>
            <Modal.Header title="Rate our service :)" />
            <Modal.Body>
            <TapRating
                count={5}
                reviews = {["1","2","3","4","5"]}
                showRating={true}
                size={40}
                onFinishRating={ratingCompleted}
              />
              <TextInput 
                style={styles.input}
                placeholder="Additional thoughts?.."
                onChangeText={feedback => setOpenFeedback(feedback)}
              />
            </Modal.Body>
            <Modal.Footer>
              <View style={styles.button}>
                <Button title="סיים" onPress={ () => {submitReview(); setVisible(false)}} />
              </View>
            </Modal.Footer>
          </View>
        </Modal.Container>
      </Modal>
    </View>
	);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    text: {
      fontSize: 16,
      fontWeight: "400",
      textAlign: "center",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
    input: {
      paddingTop: 10,
      borderColor: "grey",
      borderBottomWidth: 2,
    },
    button: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
    },
    modal: {
      width: "100%",
      height: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
  });



  