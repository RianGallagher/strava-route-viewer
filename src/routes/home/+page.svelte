<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<h1>Home</h1>
{#if data}
	<div class="routes">
		<div class="filters">
			<form method="POST" use:enhance>
				<div>
					<label for="elevation_gain_lower">Lower elevation gain</label>
					<input
						type="number"
						id="elevation_gain_lower"
						step="100"
						min="0"
						name="elevation_gain_lower"
						placeholder="Lower elevation gain"
					/>

					<label for="elevation_gain_upper">Upper elevation gain</label>
					<input
						type="number"
						id="elevation_gain_upper"
						step="100"
						min="0"
						name="elevation_gain_upper"
						placeholder="Lower elevation gain"
					/>
				</div>

				<div>
					<label for="distance_lower">Lower distance</label>
					<input
						type="number"
						id="distance_lower"
						name="distance_lower"
						min="0"
						placeholder="Lower distance"
					/>

					<label for="distance_upper">Upper distance</label>
					<input
						type="number"
						id="distance_upper"
						name="distance_upper"
						min="0"
						placeholder="Upper distance"
					/>

					<div>
						<label for="sort_elevation_asc">Sort Elevation Ascending</label>
						<input type="radio" name="sort" id="sort_elevation_asc" value="elevation.asc" />
						<label for="sort_elevation_desc">Sort Elevation Descending</label>
						<input type="radio" name="sort" id="sort_elevation_desc" value="elevation.desc" />
					</div>

					<div>
						<label for="sort_distance_asc">Sort Distance Ascending</label>
						<input type="radio" name="sort" id="sort_distance_asc" value="distance.asc" />
						<label for="sort_distance_desc">Sort Distance Descending</label>
						<input type="radio" name="sort" id="sort_distance_desc" value="distance.desc" />
					</div>

					<div>
						<button type="submit">Filter</button>
					</div>
				</div>
			</form>
		</div>

		<div class="routes__list">
			{#each data.routes as item}
				<div class="route">
					<h2 class="route__title">{item.route_name}</h2>
					<div class="route__details">
						<span>Distance: {item.distance}</span>
						<span>Elevation: {item.elevation_gain}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<p>No data available.</p>
{/if}

<style>
	.routes__list {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}

	.route {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 12px;
		transition: background-color 0.3s;
		&:hover {
			cursor: pointer;
			background-color: #f1f1f1;
		}
	}

	.route__details {
		display: flex;
		gap: 6px;
	}
</style>
