disclaimer: 
![I have no idea what I'm doing](https://cdn.glitch.com/3b4f0a8d-06f8-4988-bee6-540ffa857e4a%2Fb7e.jpg?1493571178903)

notes on weird stuff in this project:
- had to fork preact-helmet and preact-side-effect to make preact a peer dependency, because even when I made sure to use the same version of preact in all of them, webpack still included preact three times in the generated bundle

things you need:
- twilio account
  - phone number that can send and receive SMS
- firebase account
  - and a database