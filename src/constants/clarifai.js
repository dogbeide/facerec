import Clarifai from 'clarifai';


export const app = new Clarifai.App({
    apiKey: 'f11e601129dc41af9444063232a81248'
});
  
export const particlesParams = {
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
