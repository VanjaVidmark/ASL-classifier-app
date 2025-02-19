export default function ClassifierView(props) {
    return (
        <section className="classifier-view">
            <h1 className="title">ASL Classifier</h1>
            <p className="explanation">Test the classifier by ...</p>
            <div className="camera-container">
                <video ref={props.video} className="video"></video>
                <p className="guessed-text">{"Guessed letter: " + props.prediction}</p>
            </div>
        </section>
    );
};
