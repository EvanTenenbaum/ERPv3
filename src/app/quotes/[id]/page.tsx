import { notFound } from 'next/navigation';
import { getQuote } from '@/actions/quotes';
import QuoteDetails from '@/components/quotes/QuoteDetails';

interface QuotePageProps {
  params: {
    id: string;
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const quoteResponse = await getQuote(params.id);

  if (!quoteResponse.success || !quoteResponse.quote) {
    notFound();
  }

  return (
    <div className="px-4 py-4">
      <div className="text-sm text-gray-600 mb-2"><a href="/quotes" className="text-blue-700 hover:underline">Quotes</a> / <span className="text-gray-800">{params.id}</span></div>
      <h1 className="text-2xl font-semibold mb-4">Quote {params.id}</h1>
      <div className="container mx-auto">
        <QuoteDetails quote={quoteResponse.quote} />
      </div>
    </div>
  );
}
