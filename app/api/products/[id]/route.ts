import { NextRequest, NextResponse } from 'next/server'

const dummyProducts = [
  { id: '1', name: 'Dummy Product 1', price: 100, images: [{ url: '/images/logo.svg' }], description: 'This is a dummy product description.', slug: 'dummy-product-1', category: 'Electronics' },
  { id: '2', name: 'Dummy Product 2', price: 200, images: [{ url: '/images/logo.svg' }], description: 'This is another dummy product description.', slug: 'dummy-product-2', category: 'Books' },
  { id: '3', name: 'Dummy Product 3', price: 300, images: [{ url: '/images/logo.svg'}], description: 'Yet another dummy product description.', slug: 'dummy-product-3', category: 'Clothing' },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = dummyProducts.find(p => p.id === params.id || p.slug === params.id);

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = dummyProducts.findIndex(p => p.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  dummyProducts[index] = { ...dummyProducts[index], ...body };
  return NextResponse.json(dummyProducts[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = dummyProducts.findIndex(p => p.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  dummyProducts.splice(index, 1);
  return NextResponse.json({ success: true });
}