<script>
    import Login from "$lib/components/Login.svelte";
    import Signup from "$lib/components/Signup.svelte";
    import { authpage, state } from "$lib/stores/auth";
</script>

{#if $state === "loading"}
    <slot name="loading">Loading...</slot>
{:else if $state === "unauthed"}
    {#if $authpage === "login"}
        <Login />
    {:else}
        <Signup/>
    {/if}
{:else if $state === "error"}
    <h1>Auth Error</h1>
{:else if $state === "authed"}
    <slot name="authed" />
{/if}
