import Head from 'next/head';
import Grid from '../components/Grid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function explore({ visits = [] }) {
  return (
    <div>
      <Head>
        <title>Visits - Explore</title>
        <meta name='description' content='Visit' />
      </Head>
      <Grid visits={visits} />
    </div>
  );
}

export async function getServerSideProps() {
  const visits = await prisma.visit.findMany();
  return {
    props: { visits: JSON.parse(JSON.stringify(visits)) },
  };
}
