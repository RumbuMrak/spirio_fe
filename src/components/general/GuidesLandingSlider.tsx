import React from 'react';
import GuideCard from './GuideCard';
import useGuides from '@/hooks/data/useGuides';
import Spinner from '../UI/spinner/Spinner';
import Button from '../UI/button/Button';
import router from 'next/router';
import Routes from '@/services/routes';
import Illustrations from '@/images/illustrations';
type GuidesLandingSliderProps = {
  title: string;
  text?: string;
};
const GuidesLandingSlider = ({ title, text, ...props }: GuidesLandingSliderProps & React.HTMLAttributes<HTMLElement>) => {
  const { data: guides, guidesCount, isLoading } = useGuides();
const sortedGuides = [...(guides || [])].sort((a, b) => {
  const getRank = (status?: string) => {
    const s = status?.toLowerCase() ?? "";
    if (s.includes("online")) return 0;
    if (s.includes("busy")) return 1;
    return 2; 
  };
  return getRank(a.call_status) - getRank(b.call_status);
});
  const visibleGuides = sortedGuides?.slice(0,7);
  return (
    <section {...props}>
      {}
      <div className="mt-8 scroll-m-24 pb-12 lg:pb-20">
        {isLoading ? (
          <div className="container">
            <Spinner />
          </div>
        ) : (
           <div id="guides" className="container mt-16 xl:!max-w-7xl">
           <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {visibleGuides?.map((guide) => (
                <div key={guide.id}>
                  <GuideCard {...guide} />
                </div>
              ))}
            <Button
              onClick={() => { router.push(Routes['discover']); }}
              className="flex flex-col h-full items-center justify-center !rounded-lg p-4 text-center font-medium text-white hover:bg-gray-50"
            >
              <Illustrations.IllustrationHero className="h-25 w-25" />
              Další průvodci →
            </Button>
            </div>
          </div>
        )}
        {!isLoading && guidesCount === 0 && (
          <div className="container">Nenalezen žádný průvodce</div>
        )}
      </div>
    </section>
  );
};
export default GuidesLandingSlider;
