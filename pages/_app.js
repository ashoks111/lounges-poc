import GlobalStyle from '../components/shared/GlobalStyle/GlobalStyle';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return(
    <>
    <GlobalStyle />
    <Component {...pageProps} />
    </>
  )
   
}

export default MyApp
