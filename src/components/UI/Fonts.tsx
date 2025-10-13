import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
const poppins = Poppins({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });
const avenier = localFont({
  src: [
    {
      path: '../../assets/fonts/Avenir Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Avenir Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Avenir Book.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Avenir Heavy.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Avenir Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-avenier',
});
const Fonts = () => {
  return {
    poppins,
    avenier,
  };
};
export default Fonts;
