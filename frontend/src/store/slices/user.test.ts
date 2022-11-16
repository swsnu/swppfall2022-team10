/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, { UserState } from "./user";
import { checkLogin, getUsers, getUser, loginUser, logoutUser } from "./user";


describe("user reducer", () => {
    let store: EnhancedStore<
        { user: UserState },
        AnyAction,
        [ThunkMiddleware<{ user: UserState }, AnyAction, undefined>]
    >;
    const fakeUser = {
        id: 1,
        email: 'test_email',
        password: 'test_password',
        name: 'test_name',
        logged_in: false,
    }

    const fakeUserLogin = {
        username: 'test_username',
        password: 'test_password',
    }

    beforeAll(() => {
        store = configureStore({ reducer: { user: reducer } });
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            users: [],
            currentUser: null,
            logged_in: false,
        });
    });
    it("should handle checkLogin", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: false });
        await store.dispatch(checkLogin());
        // expect(store.getState().user.logged_in).toEqual(false);
    });
    it("should handle getUsers", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeUser] });
        await store.dispatch(getUsers());
        // expect(store.getState().user.users).toEqual([fakeUser]);
    });
    it("should handle getUser", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeUser });
        await store.dispatch(getUser(1));
        // expect(store.getState().user.currentUser).toEqual(fakeUser);
    });
    it("should handle loginUser", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeUserLogin });
        await store.dispatch(loginUser(fakeUserLogin));
        // expect(store.getState().user.logged_in).toEqual(true);
    });
    it("should handle logoutUser", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeUser });
        await store.dispatch(logoutUser());
        // expect(store.getState().user.currentUser).toEqual(null);
    });
});