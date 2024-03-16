import joblib
import cv2
import mediapipe as mp
import numpy as np
import base64

KNN_model = joblib.load('KNN_model.joblib')
PCA_model = joblib.load('PCA_model.joblib')

def base64_to_cv2(base64_string):
    """
    Transforms an base 64 png to binary cv2 image 

    """
    encoded_data = base64_string.split(',')[1]
    binary_data = base64.b64decode(encoded_data)
    np_array = np.frombuffer(binary_data, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    return image


def img_to_landmarks(image):
    """
    Transforms an image to landmarks. Landmarks are the 21*3=63 coordinates of a mediapipe hand. 

    Parameters:
    image: A binary cv2 image. 

    Returns:
    A 1D np array contaning all 63 features. 
    """
    mp_hands = mp.solutions.hands
    result = []
    with mp_hands.Hands(
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.5) as hands:
        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

        if not results.multi_hand_landmarks:
            return np.array([])
        for i in range(len(results.multi_hand_landmarks[0].landmark)):
            x = results.multi_hand_landmarks[0].landmark[i].x
            y = results.multi_hand_landmarks[0].landmark[i].y
            z = results.multi_hand_landmarks[0].landmark[i].z
            result.append((x, y, z))

    return np.concatenate(np.array(result), axis=0)

def make_prediction(image, model):
    """
    Main function to make prediction.
    
    Parameters:
    image: base 64 png
    model (string): name of model that should be used. Possible models: "KNN_model",  

    Returns:
    A string containing the most likely letter on the input pucture, or null if no hand was detected on the image
    """
    image = base64_to_cv2(image)
    landmarks = img_to_landmarks(image)
    if model == "KNN_model":
        if landmarks.size == 63:
            landmarks_pca = PCA_model.transform(landmarks.reshape(1, -1))
            result = KNN_model.predict(landmarks_pca)
            return result[0]


