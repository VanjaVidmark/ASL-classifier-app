import './classifier.css';

export default function ClassifierView(props) {
    return (
        <section className="classifier-view">
            <link rel="stylesheet" href="classifier.css"/>
            <h1 className="title">ASL Classifier</h1>
            <p className="explanation">Test the classifier by ...</p>
            <div className="camera-container">
                <video ref={props.video} className="video" style={{ transform: 'scaleX(-1)' }}></video>
                <p>{"Guessed letter: " + props.prediction}</p>
            </div>
        </section>
    );
};
