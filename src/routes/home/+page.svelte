<script lang="ts">
	export let data;
</script>

<h1>Home</h1>
{#if data}
	{#each data.routes as item}
		<h2>{item.route_name}</h2>
	{/each}
{:else}
	<p>No data available.</p>
{/if}
