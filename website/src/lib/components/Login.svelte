<script>
    import { login, switchAuthPage } from "$lib/stores/auth";

    let email = "";
    let password = "";

    const onClick = async () => {
        login(email, password);
    };
</script>

<div class="wrapper">
    <input bind:value={email} />
    <input bind:value={password} type="password" />
    <button on:click={onClick}> Login </button>
    <a on:click={switchAuthPage}>Signup</a>

</div>

<style lang="scss">
    .wrapper{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 5%;
        background-color: rgb(236, 236, 236);
        box-shadow: 3px 3px rgb(189, 189, 189);
    }
    input{
        display: block;
        margin-top: 20px;
        padding: 5px;
        font-size: 24px;
    }
    button{
        margin-top: 20px;
        padding: 5px;
        font-size: 24px;
        background-color: white;
        border: 0;
        box-shadow: 3px 3px rgb(189, 189, 189);
        &:hover{
            background-color: rgb(216, 216, 216);
            box-shadow: 3px 3px rgb(138, 138, 138);
        }
    }
    a{
        color: blue;
        text-decoration: underline;
        cursor: pointer;
        float: right;
        padding-top: 30px;
    }
</style>