import React from 'react';
import GuideCard from './GuideCard';
import useGuides from '@/hooks/data/useGuides';
import Spinner from '../UI/spinner/Spinner';
type GuidesCategorySliderProps = {
  title: string;
  text?: string;
  specialization?: string;
  technique?: string[];
};
const GuidesCategorySlider = ({ title, text, specialization, technique, ...props }: GuidesCategorySliderProps & React.HTMLAttributes<HTMLElement>) => {
 const { data: guides, guidesCount, isLoading } = useGuides();
const gus = guides?.filter((guide) => {
  if (technique) {
    return guide.techniques.some((t) => technique.includes(t.title) );
  }
  return true;
}) || [];
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
           <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {gus?.map((guide) => (
              <div key={guide.id}>
                <GuideCard {...guide} />
              </div>
            ))}
            </div>
        </div>
      )}
      {guidesCount === 0 && !isLoading && <div className="container">Nenalezen žádný průvodce</div>}
    </div>
  </section>
);
};
export default GuidesCategorySlider;
