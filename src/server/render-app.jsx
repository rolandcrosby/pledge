import preact from 'preact';
import Helmet from 'preact-helmet';
import render from 'preact-render-to-string';
import { StyleSheetServer } from 'aphrodite';

import { STATIC_PATH, APP_CONTAINER_CLASSNAME } from '../shared/config';
import App from '../shared/app';

function renderApp(location, state) {
  const initialState = state || {};
  const {html, css} = StyleSheetServer.renderStatic(() => {
      return render(<App location={location} initialState={initialState} />);
  });
  const head = Helmet.rewind();
  return (
`<!DOCTYPE html>
<html>
  <head>
    ${head.title.toString()}
    <link rel="stylesheet" href="${STATIC_PATH}/css/reset.css">
    <style data-aphrodite>${css.content}</style>
    <script src="https://use.typekit.net/grs3gof.js"></script>
    <script>try{Typekit.load({ async: true });}catch(e){}</script>
    <meta charset="utf-8">
  </head>
  <body>
    <div class="${APP_CONTAINER_CLASSNAME}">${html}</div>
    <script>
      window.serverRenderedClassNames = ${JSON.stringify(css.renderedClassNames)};
    </script>
    <script src="${STATIC_PATH}/js/bundle.js"></script>
  </body>
</html>`
  )
}

export default renderApp;