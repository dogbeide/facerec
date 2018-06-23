import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const app = new Clarifai.App({
  apiKey: 'f11e601129dc41af9444063232a81248'
});

const particlesParams = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      },
      distance: 130
    },
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 800
      }
    },
    move: {
      enable: true,
      speed: 5
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  calcFaceLoc = (data) => {
    const foundFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('image');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: foundFace.left_col * width,
      topRow: foundFace.top_row * height,
      rightCol: width - (foundFace.right_col * width),
      bottomRow: height - (foundFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box });
  }

  onInputChange = (e) => {
    this.setState({ input: e.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      ).then((response) => {
          const box = this.calcFaceLoc(response);
          this.displayFaceBox(box);
        })
        .catch(err => {
          console.log(err);
        })
  }

  render() {
    return (
      <div className="App">
        <Particles
          className="particles"
          params={particlesParams}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onButtonSubmit={this.onButtonSubmit}
          onInputChange={this.onInputChange}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
