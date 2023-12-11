<script lang="ts">
import ChevronDown from "$lib/components/shared/ChevronDown.svelte";
import ChevronUp from "$lib/components/shared/ChevronUp.svelte";

let componentKey = 0;

const toggleAnswer = (index:number) => {
	questions[index].hidden = !questions[index].hidden
}
let questions = [
	{
		hidden: true,
		question: 'Question?',
		answer: 'Answer.'
	},
	{
		hidden: true,
		question: 'Question?',
		answer: 'Answer.'
	},
	{
		hidden: true,
		question: 'Question?',
		answer: 'Answer.'
	},
	{
		hidden: true,
		question: 'Question?',
		answer: 'Answer.'
	},
	{
		hidden: true,
		question: 'Question?',
		answer: 'Answer.'
	}
]
</script>

<svelte:head>
	<title>Ecosystem DAO - Frequently Asked Questions</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="mx-auto flex flex-col justify-center px-6 lg:px-8 py-12 w-full max-w-5xl">
	<div class="p-10 gap-6 items-start bg-gray-1000 border-[0.5px] border-gray-700 rounded-lg">
		<h1 class="text-4xl font-normal">Frequently Asked Questions</h1>
		<div class="space-y-8 divide-y divide-gray-700/50 mt-12">
			{#key componentKey}
				{#each questions as q, i}
					<div class="pt-4 flex-1">
						<div aria-hidden="true" class="flex items-start justify-between cursor-pointer text-2xl font-normal " on:keydown on:click={() => toggleAnswer(i)}>
							<p>{q.question}</p>
							{#if q.hidden}
								<button class="mt-1">
									<ChevronDown />
								</button>
							{:else}
								<button class="mt-1">
									<ChevronUp />
								</button>
							{/if}
						</div>
						{#if !q.hidden}
							<div id={'answer-' + i} class="sm:max-w-[80%] text-base font-light mt-6">{@html q.answer}</div>
						{/if}
					</div>
				{/each}
			{/key}
		</div>
	</div>
</div>
