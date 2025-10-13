import Layout from '@/components/layout/Layout';
import PageTitle from '@/components/layout/PageTitle';
import React from 'react';
import Routes from '@/services/routes';
import Image from 'next/image';
import GuideCard from '@/components/general/GuideCard';
import { H2, H4 } from '@/components/UI/typography/Typography';
import Button from '@/components/UI/button/Button';
import PostCard from '@/components/general/PostCard';
import { GetServerSideProps } from 'next';
import usePosts, { PostsType, getPost } from '@/hooks/data/usePosts';
import { createCallLink, getImageUrl, guideName } from '@/services/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import useUser from '@/features/user/hooks/useUser';
export default function BlogDetail({ data }: { data: PostsType }) {
  const { user } = useUser();
  const { data: posts } = usePosts({ 'filter[guide_profile_id]': data.guideProfile.id, 'filter[not_id]': [data.id] });
  return (
    <>
      <section>
        <PageTitle breadcrumbs={[{ title: 'Dostupní průvodci', url: Routes.discover }, { title: data.title }]}>{data.title}</PageTitle>
        <div className="container mt-7 xl:max-w-7xl">
          <div className=" flex items-center justify-center gap-5">
            <div className="flex items-center gap-2 font-600">
              {data.guideProfile.avatar && (
                <Image
                  src={getImageUrl(data.guideProfile.avatar)}
                  width={24}
                  height={24}
                  alt={guideName(data.guideProfile)}
                  className="rounded-full object-cover"
                />
              )}
              {guideName(data.guideProfile)}
            </div>
            <span className="text-white/40">{format(data.created_at, 'd. MMMM y', { locale: cs })}</span>
          </div>
          {data.cover && (
            <div className="relative mt-11 aspect-video">
              <Image src={getImageUrl(data.cover)} alt={data.title} fill className="rounded-lg object-cover" />
            </div>
          )}
        </div>
      </section>
      <section id="article" className="container pb-10 pt-6 sm:pb-15">
        <article className="prose prose-invert mx-auto prose-img:rounded-lg" dangerouslySetInnerHTML={{ __html: data.content }}></article>
      </section>
      <section className="pb-11 sm:pb-16">
        <div className="container !px-0 sm:px-6 xl:max-w-7xl">
          <div className="flex flex-col items-center gap-x-18 gap-y-8 p-6 bg-gradient sm:rounded-xl sm:p-12 lg:flex-row lg:items-start">
            <GuideCard {...data.guideProfile} className="w-64" />
            <div>
              <H4 className="mb-3">O autorovi</H4>
              <p className="max-w-xl opacity-80 sm:text-xl">{data.guideProfile.description}</p>
              {(user?.role === 'customer' || user?.role === 'host') && (
                <div className="mt-7.5 flex w-full flex-wrap items-center gap-4 md:max-w-sm [&>*]:min-w-0 [&>*]:flex-1">
                  <Button href={{ pathname: Routes.call, query: { id: createCallLink(user!.id, data.guideProfile.id) } }} color="gradient">
                    Volej
                  </Button>
                  <Button color="gradient-dark">Rezervuj termín</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {posts?.length && (
        <section>
          <div className="container relative pb-24 xl:max-w-7xl">
            <H2 className="mb-8 sm:mb-14">Podobné články</H2>
            <div id="posts" className="flex flex-col gap-8">
              {posts?.map((post, index) => <PostCard key={index} size="lg" {...post} />)}
            </div>
            <Button href={{ pathname: Routes.discover, hash: 'posts' }} color="transparent-white" className="mt-8 md:absolute md:right-0 md:top-0 md:mt-0">
              Zobrazit všechny
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
BlogDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const cookies = req.cookies;
  const slug = query.slug as string;
  if (!cookies['user-id']) {
    return {
      redirect: {
        destination: Routes.registration,
        permanent: false,
      },
    };
  }
  try {
    const data = await getPost(slug);
    return {
      props: { slug, data },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
