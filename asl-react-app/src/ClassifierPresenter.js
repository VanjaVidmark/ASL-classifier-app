import ClassifierView from "./ClassifierView.js";
import React, { useRef, useEffect, useState } from "react";

export default
function Classifier(){
    const [frameToSend, setFrameToSend] = useState(null);
    const [predictedLetter, setPredictedLetter] = useState(null);
    const videoRef = useRef(null);

    function startVideoACB(){
        function streamVideoACB(stream){
            let video = videoRef.current;
                video.srcObject = stream;
                video.play();
                return video;
        }
        navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }})
        .then(streamVideoACB)
        .catch(err => { console.error(err) });
    }

    function captureFrameACB(){
        const intervalId = setInterval(() => {
            let video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL('image/png');
            setFrameToSend(frameData);
        }, 1000);

        return () => clearInterval(intervalId);
    }


    function processResponseACB(response){
        if (response.ok) {
            return response.json();
        } else {
            console.error('Failed to recieve predicted letter.');
        }
    }
    function readPredictionACB(data){
        if ('letter' in data) {
            console.log(data.letter)
            setPredictedLetter(data.letter)
        } else {
            throw new Error('Letter not found in response.');
        }
    }

    function sendFrameACB(){
        if (frameToSend !== null) {
            fetch('/api/send-frame', {
                method: 'POST',
                headers: 
                {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ frame: frameToSend }),
                })
                .then(processResponseACB)
                .then(readPredictionACB)
                .catch(err => { console.error(err) });
        }
    }

    useEffect(startVideoACB, []);
    useEffect(captureFrameACB, []);
    useEffect(sendFrameACB, [frameToSend]);

    return <ClassifierView video={videoRef} prediction={predictedLetter}/>
}