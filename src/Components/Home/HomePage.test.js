import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from "../../store/store";
import matchMedia from '../../matchMedia';  // Important Import
import HomePage from './HomePage';

describe.only("HomePage Tests", () => {
    const component = <Provider store={store}><MemoryRouter initialEntries={['/']} ><HomePage /></MemoryRouter></Provider>
    it("gives correct search results", async() => {
        const document = render(component);
        const selectField = document.container.querySelector("#rc_select_TEST_OR_SSR");
        userEvent.type(selectField, "Veg Aroma");
        fireEvent.keyDown(selectField, {key: 'Enter', code: 'Enter', charCode: 13})
        const list = await screen.findAllByText(/cury leaves/i);
        expect(list.length).toBe(1);
    })
})
