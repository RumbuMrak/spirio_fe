import { useState } from 'react';
import { useRouter } from 'next/router';
import Routes from '@/services/routes';
import Button from '@/components/UI/button/Button';
import Subscriptions from './user/subscriptions';
import Layout from '@/components/layout/Layout';
import Spinner from '@/components/UI/spinner/Spinner';
const AccessOptionsPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto p-6">
      <>
 {loading && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-opacity-80 text-center">
    <Spinner className="mb-4 h-8 w-8 animate-spin bg-primary-500" />
    <p className="text-lg font-medium text-gray-700">Přesměrovávám na platební bránu...</p>
  </div>
)}
    {!loading && (
      <>
        <p className="mx-auto mb-6 max-w-sm text-center text-lg">
          Pro zahájení hovoru si prosím vyber předplatné nebo se zaregistruj.
        </p>
           <p className="mx-auto mb-6 max-w-sm text-center text-sm">
                  Po výběru předplatného budeš moci okamžitě začít využívat naše služby.
        </p>
        <Subscriptions fromModal={true}        
        loading={loading} 
        setLoading={setLoading} />
          {}
        <div className="flex items-center justify-center gap-2 my-6">
          <hr className="flex-grow border-t" />
          <span className="text-gray-400 text-sm">NEBO</span>
          <hr className="flex-grow border-t" />
        </div>
        <div className="flex items-center justify-between gap-4 [&>button]:flex-1">
          <Button onClick={() => router.push(Routes.discover)} disabled={loading} color="transparent-white">
            Odejít
          </Button>
          <Button onClick={() => router.push(Routes.registration)} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? 'Načítání...' : 'Registrovat se'}
          </Button>
        </div>
      </>
)}
    </>
    </div>
  );
};
AccessOptionsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      {page}
    </Layout>
  );
};
export default AccessOptionsPage;
