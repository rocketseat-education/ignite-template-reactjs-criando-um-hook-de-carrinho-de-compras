import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import Header from '../../components/Header';

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock('../../hooks/useCart', () => {
  return {
    useCart: () => ({
      cart: [
        {
          amount: 2,
          id: 1,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          amount: 1,
          id: 2,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ],
    }),
  };
});

describe('Header Component', () => {
  it('should be able to render the amount of products added to cart', () => {
    const { getByTestId } = render(<Header />);

    const cartSizeCounter = getByTestId('cart-size');
    expect(cartSizeCounter).toHaveTextContent('2 itens');
  });
});
