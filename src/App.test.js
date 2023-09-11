import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

import matchMedia from './matchMedia';  // Important Import

describe.skip("App", () => {
    const component = <Provider store={store}><App /></Provider>
    test('should render title Food Places ', () => {
        render(component);
        const linkElement = screen.getByText(/Food Places/i);
        expect(linkElement).toBeInTheDocument();
    });
})

