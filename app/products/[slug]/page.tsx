'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getApiUrl, getImageUrl } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import { useToast } from '@/hooks/useToast';
import { openCartDrawer } from '@/components/CartDrawer';

interface Product {
  _id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  soldOut: boolean;
  rating: number;
  reviewCount: number;
  notes?: string[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  otherNotes?: string[];
  sizes?: Array<{ size: string; price: number; stock: number }>;
  category?: string;
  tags?: string[];
  bulletPoints?: string[];
  stock?: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(getApiUrl(`products/${params.slug}`));
      const data = await response.json();
      setProduct(data);
      setSelectedImageIndex(0);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0].size);
      }

      // Fetch related products
      const relatedResponse = await fetch(getApiUrl(`products?category=${data.category}&limit=4`));
      const relatedData = await relatedResponse.json();
      setRelatedProducts(relatedData.products?.filter((p: Product) => p._id !== data._id) || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const sessionId = getSessionId();

      const sizeData = product.sizes?.find(s => s.size === selectedSize);
      const price = sizeData?.price || product.price;

      const response = await fetch(getApiUrl(`cart/${sessionId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          size: selectedSize || '100 ml',
          price: price,
          quantity: quantity,
          image: product.images[0] || '',
        }),
      });

      if (response.ok) {
        showToast(`Added ${quantity} item(s) to cart!`, 'success');
        window.dispatchEvent(new Event('cartUpdated'));
        openCartDrawer();
      } else {
        showToast('Failed to add product to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add product to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const sizeData = product.sizes?.find(s => s.size === selectedSize);
  const displayPrice = sizeData?.price || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images: main image + row of all thumbnails (click to set main) */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[selectedImageIndex])}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="#f3f4f6" width="400" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="48">✨</text></svg>');
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300">
                <span className="text-6xl">✨</span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                    selectedImageIndex === index ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#f3f4f6" width="80" height="80"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="24">✨</text></svg>');
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.reviewCount} reviews</span>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">Rs. {displayPrice.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > displayPrice && (
                <span className="text-lg text-gray-500 line-through">
                  Rs. {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.sizes && product.sizes.length > 0 && (
              <p className="text-sm text-gray-500">Unit price / {selectedSize}</p>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setSelectedSize(size.size)}
                    className={`px-4 py-2 border rounded-md transition ${selectedSize === size.size
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-primary-300'
                      }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.shortDescription && (
            <div>
              <h3 className="font-semibold mb-2">Quick Overview</h3>
              <p className="text-gray-600">{product.shortDescription}</p>
            </div>
          )}
          {/* All fragrance notes from admin (Top, Heart, Base, Other or legacy notes) */}
          {(product.topNotes?.length || product.heartNotes?.length || product.baseNotes?.length || product.otherNotes?.length || (product.notes?.length ?? 0)) > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Fragrance Notes</h3>
              <div className="space-y-3 text-gray-700">
                {product.topNotes && product.topNotes.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900">Top notes:</span>
                    <p className="mt-0.5">{product.topNotes.join(', ')}</p>
                  </div>
                )}
                {product.heartNotes && product.heartNotes.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900">Heart notes:</span>
                    <p className="mt-0.5">{product.heartNotes.join(', ')}</p>
                  </div>
                )}
                {product.baseNotes && product.baseNotes.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900">Base notes:</span>
                    <p className="mt-0.5">{product.baseNotes.join(', ')}</p>
                  </div>
                )}
                {product.otherNotes && product.otherNotes.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900">Other notes:</span>
                    <p className="mt-0.5">{product.otherNotes.join(', ')}</p>
                  </div>
                )}
                {(!product.topNotes?.length && !product.heartNotes?.length && !product.baseNotes?.length && !product.otherNotes?.length) && product.notes && product.notes.length > 0 && (
                  <p>{product.notes.join(' | ')}</p>
                )}
              </div>
            </div>
          )}

          {/* Bullet points (full details from admin) */}
          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Key features</h3>
              <ul className="space-y-2">
                {product.bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-primary-600 mt-1 shrink-0">•</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.soldOut}
            className={`w-full py-3 rounded-md font-semibold text-lg transition ${product.soldOut
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
          >
            {product.soldOut ? 'Sold Out' : 'Add to cart'}
          </button>

          <div className="mt-8 space-y-6">


            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>



            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Product Code</p>
                <p className="font-semibold">{product.code}</p>
              </div>
              {product.category && (
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">{product.category}</p>
                </div>
              )}
              {product.stock !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Stock Available</p>
                  <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
}

