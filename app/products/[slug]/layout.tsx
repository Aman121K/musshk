import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, SITE_DEFAULT_DESCRIPTION } from '@/lib/site';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.musshk.com/api';
const UPLOADS_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'https://api.musshk.com/api').replace(/\/api\/?$/, '') || 'https://api.musshk.com';

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${UPLOADS_ORIGIN}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product' };

  const title = `${product.name} | ${SITE_NAME}`;
  const description =
    product.shortDescription ||
    product.description?.slice(0, 160)?.replace(/\s+/g, ' ') ||
    `${product.name} - Luxury inspired fragrance. Rs. ${product.price}. Free shipping across India.`;
  const image = product.images?.[0] ? getImageUrl(product.images[0]) : `${SITE_URL}/logo/musshk.png`;
  const url = `${SITE_URL}/products/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.shortDescription || product.description || '',
        image: (product.images || []).slice(0, 3).map((img: string) => getImageUrl(img)).filter(Boolean),
        url: `${SITE_URL}/products/${slug}`,
        brand: { '@type': 'Brand', name: SITE_NAME },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'INR',
          availability: product.soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          url: `${SITE_URL}/products/${slug}`,
        },
        ...(product.rating != null && { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount || 0 } }),
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
