import { NextResponse } from 'next/server';

const dummyProducts = [
  { id: '1', name: 'Dummy Product 1', price: 100, images: [{ url: '/images/logo.svg' }], description: 'This is a dummy product description.', slug: 'dummy-product-1', category: 'Electronics' },
  { id: '2', name: 'Dummy Product 2', price: 200, images: [{ url: '/images/logo.svg' }], description: 'This is another dummy product description.', slug: 'dummy-product-2', category: 'Books' },
  { id: '3', name: 'Dummy Product 3', price: 300, images: [{ url: '/images/logo.svg'}], description: 'Yet another dummy product description.', slug: 'dummy-product-3', category: 'Clothing' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedProducts = dummyProducts.slice(start, end);

  return NextResponse.json({
    items: paginatedProducts,
    pagination: {
      page,
      pageSize,
      total: dummyProducts.length,
      totalPages: Math.ceil(dummyProducts.length / pageSize),
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = { id: (dummyProducts.length + 1).toString(), ...body };
  dummyProducts.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}