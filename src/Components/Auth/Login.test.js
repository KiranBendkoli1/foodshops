import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from '../../store/store';
import Login from './Login';

import matchMedia from '../../matchMedia';  // Important Import

describe("Login Test Cases", () => {
    const component = <Provider store={store}><ToastContainer /><MemoryRouter initialEntries={["/login"]}><Login /></MemoryRouter></Provider>;
    it.only('renders error on wrong email address ', async () => {
        render(component);
        const emailField = screen.getByPlaceholderText(/email adderss/i)
        const passwordField = screen.getByPlaceholderText(/password/i)
        userEvent.type(emailField, "kiran111@gmail.com")
        userEvent.type(passwordField, "password")
        userEvent.click(screen.getByText("LOGIN"))
        expect(await screen.findByText("User does not exist")).toBeInTheDocument();
    });

    it('renders error on wrong password entered', async () => {
        render(component);
        const emailField = screen.getByPlaceholderText(/email adderss/i)
        const passwordField = screen.getByPlaceholderText(/password/i)

        userEvent.type(emailField, "kiran1@gmail.com")
        userEvent.type(passwordField, "wrongpassword")
        userEvent.click(screen.getByText("LOGIN"))

        expect(await screen.findByText("You have entered wrong password")).toBeInTheDocument();
    });

    it('should render success', async () => {
        render(component);
        const emailField = screen.getByPlaceholderText(/email adderss/i);
        const passwordField = screen.getByPlaceholderText(/password/i);
        userEvent.type(emailField, "kiran1@gmail.com")
        userEvent.type(passwordField, "password")
        userEvent.click(screen.getByText("LOGIN"));
        expect(await screen.findByText(/user logged in successfully/i)).toBeInTheDocument();
    });
});

