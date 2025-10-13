import Button from '@/components/UI/button/Button';
import Layout from '@/components/layout/Layout';
import Illustrations from '@/images/illustrations';
import Routes from '@/services/routes';
export default function LivestreamEnd() {
  return (
    <div className="container flex flex-col items-center">
      <Illustrations.IllustrationHero className="max-w-sm md:my-0" />
      <h1 className="mb-10 text-3xl font-800">Livestream byl ukončen</h1>
      <div className="flex flex-wrap items-center gap-4">
        <Button href={Routes.homepage}>Odejít</Button>
      </div>
    </div>
  );
}
LivestreamEnd.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout hideFooter>{page}</Layout>;
};
