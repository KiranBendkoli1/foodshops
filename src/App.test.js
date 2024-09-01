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

// describe.skip("Login Test Cases", () => {
//     const component = <Provider store={store}><ToastContainer /><MemoryRouter initialEntries={["/login"]}><Login /></MemoryRouter></Provider>;
//     it('renders error on wrong email address ', async () => {
//         render(component);
//         const emailField = screen.getByPlaceholderText(/email adderss/i)
//         const passwordField = screen.getByPlaceholderText(/password/i)
//         userEvent.type(emailField, "kiran111@gmail.com")
//         userEvent.type(passwordField, "password")
//         userEvent.click(screen.getByText("LOGIN"))
//         expect(await screen.findByText("User does not exist")).toBeInTheDocument();
//     });

//     it('renders error on wrong password entered', async () => {
//         render(component);
//         const emailField = screen.getByPlaceholderText(/email adderss/i)
//         const passwordField = screen.getByPlaceholderText(/password/i)

//         userEvent.type(emailField, "kiran1@gmail.com")
//         userEvent.type(passwordField, "wrongpassword")
//         userEvent.click(screen.getByText("LOGIN"))

//         expect(await screen.findByText("You have entered wrong password")).toBeInTheDocument();
//     });

//     it('should render success', async () => {
//         render(component);
//         const emailField = screen.getByPlaceholderText(/email adderss/i);
//         const passwordField = screen.getByPlaceholderText(/password/i);
//         userEvent.type(emailField, "kiran1@gmail.com")
//         userEvent.type(passwordField, "password")
//         userEvent.click(screen.getByText("LOGIN"));
//         expect(await screen.findByText(/user logged in successfully/i)).toBeInTheDocument();
//     });
// });

// describe("SignUp Test Cases", () => {
//     const component = <Provider store={store}><ToastContainer /><MemoryRouter initialEntries={["/signup"]}><Signup /></MemoryRouter></Provider>;
//     it("redirects to user registration", () => {
//         render(component);
//         userEvent.click(screen.getByText("To find best foodshops near you"));
//         expect(screen.getByText("SignUp Page for User")).toBeInTheDocument();
//     })
//     it('redirects to the shop owner registration page', () => {
//         render(component);
//         userEvent.click(screen.getByText("To list your foodshop here"));
//         expect(screen.getByText("SignUp Page for FoodShop Owner")).toBeInTheDocument();
//     })
//     it('shows error after submitting without entering values', async () => {
//         render(component);
//         userEvent.click(screen.getByText("To list your foodshop here"));
//         userEvent.click(screen.getByText("SIGNUP"));
//         expect(await screen.findByText('Please input your name!')).toBeInTheDocument();
//     })
//     it.only('register new user', async () => {
//         render(component);
//         userEvent.click(screen.getByText("To list your foodshop here"));
//         userEvent.type(screen.getByPlaceholderText('name'), "React Testing");
//         userEvent.type(screen.getByPlaceholderText('email'), "react@testing.com");
//         userEvent.type(screen.getByPlaceholderText('contact'), "1253355655");
//         userEvent.type(screen.getByPlaceholderText('password'), "my password");
//         userEvent.click(screen.getByText("SIGNUP"));
//         expect(await screen.findByText("User Created Successfully")).toBeInTheDocument();
//     })
// });
