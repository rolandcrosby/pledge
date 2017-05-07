import preact from 'preact';
import Helmet from 'preact-helmet';
import { StyleSheet, css } from 'aphrodite/no-important';
import GalaGraphic from '../components/gala-graphic'

const style = StyleSheet.create({
  Display: {
    display: 'flex',
    flexDirection: 'column',
    fontVariantNumeric: 'lining-nums',
    width: '100%',
    height: '100%',
    margin: '0',
    padding: '0',
    transitionProperty: 'background, color',
    transitionDuration: '1s',
    transitionTimingFunction: 'linear'
  },
  Display__dark: {
    background: '#2f0b30',
    color: '#a3dc29'
  },
  Display__light: {
    background: '#f9f8e5',
    color: '#2f0b30'
  },
  Display_main: {
    flex: '1',
    display: 'flex',
    alignItems: 'center'
  },
  CallToAction: {
    width: '100%',
    alignSelf: 'flex-end',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.1em',
    fontSize: '36px',
    textAlign: 'center',
    padding: '20px'
  }
})

export default (props) => {
  const classes = [
    style.Display,
    props.theme === 'light' ? style.Display__light : style.Display__dark
  ];
  
  return <div className={css(classes)}>
    <Helmet title="Home Screen" />
    <div className={css(style.Display_main)}>
      <GalaGraphic />
    </div>
    <footer className={css(style.CallToAction)}>
      Text your pledge to 347-690-7757
    </footer>
  </div>;
}