import { writable } from "svelte/store";
type state_t = 'loading'|'authed'|'unauthed'|'error'
export const state = writable<state_t>('loading')
export const user = writable(undefined)
export const authpage = writable<'login'|'signup'>('login')

export const switchAuthPage = () => {
    authpage.update((a)=>a === "login" ? "signup" : "login")
}

export const login = async (email: string, password: string) => {
    const r = await fetch('http://localhost:8080/login/password', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const data = await r.json()
    if(data.auth){
        state.set('authed')
        user.set(data.user)
    }

    return data.ok
}

export const logout = async () => {
    const r = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    state.set('unauthed')
    user.set(undefined)
    const data = await r.json()
    return data.ok
}

export const signup = async (email: string, password: string) => {
    const r = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const data = await r.json()
    return data.ok
}


export const loadUser = async () => {
    const r = await fetch('http://localhost:8080/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const data = await r.json()
    if(data.auth){
        state.set('authed')
        user.set(data.user)
    }else{
        state.set('unauthed')
    }
    return data.ok
}
loadUser()