import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "../../store/store";
import Signup from './Signup';

import matchMedia from '../../matchMedia';  // Important Import

describe("SignUp Test Cases", () => {
    const component = <Provider store={store}><ToastContainer /><MemoryRouter initialEntries={["/signup"]}><Signup /></MemoryRouter></Provider>;
    it("redirects to user registration", () => {
        render(component);
        userEvent.click(screen.getByText("To find best foodshops near you"));
        expect(screen.getByText("SignUp Page for User")).toBeInTheDocument();
    })
    it('redirects to the shop owner registration page', () => {
        render(component);
        userEvent.click(screen.getByText("To list your foodshop here"));
        expect(screen.getByText("SignUp Page for FoodShop Owner")).toBeInTheDocument();
    })
    it('shows error after submitting without entering values', async () => {
        render(component);
        userEvent.click(screen.getByText("To list your foodshop here"));
        userEvent.click(screen.getByText("SIGNUP"));
        expect(await screen.findByText('Please input your name!')).toBeInTheDocument();
    })
    it('register new user', async () => {
        render(component);
        userEvent.click(screen.getByText("To list your foodshop here"));  
        userEvent.type(screen.getByPlaceholderText('name'), "Testing Library");
        userEvent.type(screen.getByPlaceholderText('email'), "react@newtesting.com");
        userEvent.type(screen.getByPlaceholderText('contact'), "1253355655");
        userEvent.type(screen.getByPlaceholderText('password'), "my password");
        userEvent.click(screen.getByText("SIGNUP"));
        expect(await screen.findByText(/User Created Successfully/i)).toBeInTheDocument();
    });
});