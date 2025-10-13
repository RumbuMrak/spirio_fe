import Button from '@/components/UI/button/Button';
import Layout from '@/components/layout/Layout';
import { storeCallRating } from '@/features/calls/api/calls';
import Illustrations from '@/images/illustrations';
import Routes from '@/services/routes';
import { Star } from '@phosphor-icons/react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
export default function CallEnd({ id, callId }: { id: string; callId: string }) {
  const [rating, setRating] = useState<number>(0); // Current selected rating
  const [hover, setHover] = useState<number | null>(0); // Hovered star
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClick = async (value: number) => {
    if (isDisabled) return;
    setRating(value);
    await storeCallRating(callId, value); 
    setIsDisabled(true);  
  };
  return (
    <div className="container flex flex-col items-center">
      <Illustrations.IllustrationHero className="max-w-sm md:my-0" />
      <h1 className="mb-6 text-3xl font-bold">Hovor byl ukončen</h1>
      <h1 className="mb-6 text-1xl font-bold">Jak se Vám sezení s průvodcem líbilo?</h1>
        <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
          key={star}
          onClick={() => !isDisabled && handleClick(star)}
          onMouseEnter={() => !isDisabled && setHover(star)}
          onMouseLeave={() => !isDisabled && setHover(rating)}
          weight={ "fill" }
          className={`w-8 h-8 transition-colors ${
            isDisabled ? "cursor-default" : "cursor-pointer"
          } ${
            (hover ?? rating) >= star
              ? "fill-[#ffbf00] stroke-[#ffc800]"
              : "stroke-[#ffbf00]"
          }`}
        />
        ))}
        </div>
        {isDisabled &&(
        <h1 className="mb-6 text-1xl font-bold">Děkujeme za hodnocení. I díky vám můžeme naše služby neustále zlepšovat.</h1>
        )}
      <div className="flex flex-wrap items-center gap-4">
        <Button href={Routes.homepage}>Odejít</Button>
      </div>
    </div>
  );
}
CallEnd.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout hideFooter>{page}</Layout>;
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  const callId = query.callId;
  if (id) {
    return {
      props: { id, callId },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: Routes.homepage,
      },
    };
  }
};
