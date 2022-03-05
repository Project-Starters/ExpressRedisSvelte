<script>
import AuthGuard from "$lib/components/AuthGuard.svelte";
import { logout, user } from "$lib/stores/auth";
</script>
<AuthGuard>
	<section slot="authed">
		<h1>
			Website
		</h1>
		<div>
			{$user.email}
		</div>
		<button on:click={logout}>
			Log Out
		</button>
	</section>
</AuthGuard>
