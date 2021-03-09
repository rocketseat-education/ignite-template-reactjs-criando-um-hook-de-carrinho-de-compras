import AxiosMock from 'axios-mock-adapter';
import { waitFor, render, fireEvent } from '@testing-library/react';

import { api } from '../../services/api';
import Home from '../../pages/Home';
import { useCart } from '../../hooks/useCart';

const apiMock = new AxiosMock(api);
const mockedAddProduct = jest.fn();
const mockedUseCartHook = useCart as jest.Mock;

jest.mock('../../hooks/useCart');

describe('Home Page', () => {
  beforeAll(() => {
    apiMock.onGet('products').reply(200, [
      {
        id: 1,
        image:
          'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
        price: 179.9,
        title: 'Tênis de Caminhada Leve Confortável',
      },
      {
        id: 2,
        image:
          'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
        price: 139.9,
        title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
      },
      {
        id: 3,
        title: 'Tênis Adidas Duramo Lite 2.0',
        price: 219.9,
        image:
          'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis3.jpg',
      },
    ]);
  });

  beforeEach(() => {
    mockedUseCartHook.mockReturnValue({
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
      addProduct: mockedAddProduct,
    });
  });

  it('should be able to render each product quantity added to cart', async () => {
    const { getAllByTestId } = render(<Home />);

    await waitFor(() => getAllByTestId('cart-product-quantity'), {
      timeout: 200,
    });

    const [
      firstProductCartQuantity,
      secondProductCartQuantity,
      thirdProductCartQuantity,
    ] = getAllByTestId('cart-product-quantity');

    expect(firstProductCartQuantity).toHaveTextContent('2');
    expect(secondProductCartQuantity).toHaveTextContent('1');
    expect(thirdProductCartQuantity).toHaveTextContent('0');
  });

  it('should be able to add a product to cart', async () => {
    const { getAllByTestId, rerender } = render(<Home />);

    await waitFor(() => getAllByTestId('add-product-button'), {
      timeout: 200,
    });

    const [addFirstProduct] = getAllByTestId('add-product-button');

    fireEvent.click(addFirstProduct);

    expect(mockedAddProduct).toHaveBeenCalledWith(1);

    mockedUseCartHook.mockReturnValueOnce({
      cart: [
        {
          amount: 3,
          id: 1,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
      ],
    });

    rerender(<Home />);

    const [firstProductCartQuantity] = getAllByTestId('cart-product-quantity');

    expect(firstProductCartQuantity).toHaveTextContent('3');
  });
});
