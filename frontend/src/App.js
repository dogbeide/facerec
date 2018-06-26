import React, { Component } from 'react';
import Particles from 'react-particles-js';

import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register'
import { particlesParams } from './constants/particles';


class App extends Component {

  initialState = {
    boxes: [],
    imageUrl: '',
    input: '',
    isSignedIn: false,
    route: 'signin',
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: undefined
    }
  }

  constructor() {
    super();
    this.state = Object.assign({}, this.initialState);
  }

  loadUser = (user) => {
    this.setState({ user });
  }

  calcBox = (faceRegion) => {
    const vertices = faceRegion.region_info.bounding_box;
    const image = document.getElementById('image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: vertices.left_col * width,
      topRow: vertices.top_row * height,
      rightCol: width - (vertices.right_col * width),
      bottomRow: height - (vertices.bottom_row * height)
    }
  }

  displayFaceBoxes = (data) => {
    const faceRegions = data.outputs[0].data.regions;
    const boxes = faceRegions.map(faceRegion => this.calcBox(faceRegion));
    this.setState({ boxes });
  }

  onInputChange = (e) => {
    this.setState({ input: e.target.value })
  }

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    fetch('http://localhost:3000/image', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input,
        id: this.state.user.id
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.err) {
          return;
        }
        this.setState({
          user: {
            ...this.state.user,
            entries: res.entries
          }
        })
        this.displayFaceBoxes(res.data);
      })
      .catch(console.log)
  }

  onRouteChange = (route) => {
    this.setState({ route });

    if (route === 'signout') {
      this.setState(this.initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
  }

  router = () => {
    const { route } = this.state;
    switch (route) {
      case 'signin':
        return (
          <Signin
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )
      case 'home':
        const { user, imageUrl, boxes } = this.state;
        return (
          <div>
            <Rank
              name={user.name}
              entries={user.entries}
            />
            <ImageLinkForm
              onPictureSubmit={this.onPictureSubmit}
              onInputChange={this.onInputChange}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        )
      case 'register':
        return (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )
      default: return (
        <Signin
          loadUser={this.loadUser}
          onRouteChange={this.onRouteChange}
        />
      )

    }
  }

  render() {
    return (
      <div className="App">
        <Particles
          className="particles"
          params={particlesParams}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        <Logo />
        {this.router()}
      </div>
    );
  }
}

export default App;
