<script lang="ts">
	import Construct from '$lib/components/dao/admin/Construct.svelte';
	import { getConfig } from '$stores/store_helpers';

</script>

<div class="pt-20">
	<div class="h-full mx-auto flex flex-col justify-center align-baseline">
		<div class="mx-auto max-w-4xl">
			<div class="flex flex-col p-5 gap-10 items-start bg-gray-1000 border-[0.5px] border-gray-700 rounded-lg">
				<div class="flex flex-col gap-10">
					<div>
						<div>
							<h1 class="text-info"><span class="strokeme-info">DAO</span> for Bitcoin</h1>
							<h6>{getConfig().VITE_DOA_DEPLOYER + '.' +  getConfig().VITE_DOA}</h6>
						</div>
 					</div>
					<div>
						<div>
							<Construct/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
