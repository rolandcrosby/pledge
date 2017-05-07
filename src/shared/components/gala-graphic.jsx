import preact from 'preact';
import { StyleSheet, css } from 'aphrodite/no-important';

const SVG_URL = 'https://cdn.glitch.com/3b4f0a8d-06f8-4988-bee6-540ffa857e4a%2Fgala-transparent.svg?1494187138792';

const style = StyleSheet.create({
  GalaGraphic: {
    width: '100%',
  },
  GalaGraphic_image: {
    display: 'block',
    margin: '0 auto'
  }
})

export default () =>
  <div className={css(style.GalaGraphic)}>
    <img className={css(style.GalaGraphic_image)} src={SVG_URL} />
  </div>