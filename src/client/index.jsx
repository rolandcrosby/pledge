import preact from 'preact';
import { APP_CONTAINER_SELECTOR } from '../shared/config';
import App from '../shared/app';
import {StyleSheet} from 'aphrodite/no-important';

StyleSheet.rehydrate(window.serverRenderedClassNames);
const appElement = document.querySelector(APP_CONTAINER_SELECTOR);
preact.render(<App />, appElement, appElement.firstElementChild);