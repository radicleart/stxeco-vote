<script lang="ts">
	import ProposalStageUpdate from "$lib/components/all-voters/ProposalStageUpdate.svelte";
	import PageIntro from "$lib/ui/PageIntro.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import { daoStore } from "$stores/stores_dao";
	import { onMount } from "svelte";
	
	let message = 'STX ECO is the all-in-one voting platform where the Stacks community can weigh in on major protocol changes';

	let votingOptions = [
		{
			title: 'Solo Stackers',
			method: 1,
			icon: '<svg class="mx-auto text-[#141414] group-hover:text-[#FC6432] group-hover:scale-[0.90] transition ease-out duration-200" xmlns="http://www.w3.org/2000/svg" width="112" height="138" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="11.5" d="M105.984 106.5c.016-1.026.016-2.069.016-3.125 0-15.533-22.386-28.125-50-28.125S6 87.842 6 103.375 6 131.5 56 131.5c13.944 0 23.999-.979 31.25-2.729M81 31.5c0 13.807-11.193 25-25 25s-25-11.193-25-25 11.193-25 25-25 25 11.193 25 25Z"/></svg>',
			description: 'Send a dust BTC transaction',
			explanation: 'Voters who are stacking on their own must send a dust amount of BTC (~6,000 sats) from their PoX reward address to an address representing a ‘Yes’ vote or an address representing a ‘No’ vote.'
		},
		{
			title: 'Community Pool Stackers',
			method: 2,
			icon: '<svg class="mx-auto text-[#141414] group-hover:text-[#FC6432] group-hover:scale-[0.90] transition ease-out duration-200" xmlns="http://www.w3.org/2000/svg" width="158" height="137" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="11.5" d="M129.484 106c.016-1.026.016-2.069.016-3.125 0-15.533-22.386-28.125-50-28.125s-50 12.592-50 28.125S29.5 131 79.5 131c13.944 0 23.999-.979 31.25-2.729M104.5 31c0 13.807-11.193 25-25 25s-25-11.193-25-25 11.193-25 25-25 25 11.193 25 25ZM113.5 54.8c10.631 0 19.25-8.686 19.25-19.4 0-10.714-8.619-19.4-19.25-19.4m38.488 77.6c.012-.796.012-1.605.012-2.425 0-12.054-17.237-21.825-38.5-21.825M44.5 54.8c-10.632 0-19.25-8.686-19.25-19.4 0-10.714 8.618-19.4 19.25-19.4M6.012 93.6C6 92.804 6 91.995 6 91.175 6 79.121 23.237 69.35 44.5 69.35"/></svg>',
			description: 'Send a minimal STX transaction',
			explanation: 'Voters who are stacking in a community pool must send a minimal amount of STX (~1 uSTX) from their stacking address to an address representing a ‘Yes’ vote or an address representing a ‘No’ vote.'
		},
		{
			title: 'Non-Stackers',
			method: 3,
			icon: '<svg class="mx-auto text-[#141414] group-hover:text-[#FC6432] group-hover:scale-[0.90] transition ease-out duration-200" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M40.453 86.6625C41.4144 89.0662 40.2451 91.7941 37.8414 92.7555L32.9211 94.7234L32.9208 94.7235C26.6058 97.2497 22.2298 99.0069 19.3935 100.494C19.1164 100.639 18.8667 100.776 18.642 100.903C18.8667 101.031 19.1164 101.167 19.3935 101.312C22.2299 102.799 26.6059 104.557 32.921 107.083M32.921 107.083L50.4739 114.104C63.1292 119.166 68.4347 121.216 75.0624 121.216C80.1264 121.216 84.522 119.999 92.1317 117.076C94.5484 116.148 97.26 117.355 98.1883 119.771C99.1165 122.188 97.9099 124.9 95.4932 125.828C87.6517 128.84 81.9223 130.591 75.0624 130.591C66.4429 130.591 59.4464 127.791 47.7188 123.099C47.4786 123.003 47.2365 122.906 46.9923 122.809L29.1558 115.674C23.1896 113.287 18.3574 111.354 15.0404 109.615C13.3616 108.735 11.7354 107.737 10.4813 106.535C9.19293 105.299 7.875 103.425 7.875 100.903C7.875 98.3816 9.19293 96.5073 10.4813 95.2715C11.7354 94.0687 13.3616 93.071 15.0404 92.1908C18.3575 90.4518 23.1897 88.5188 29.1558 86.1323L34.36 84.0509C36.7637 83.0895 39.4916 84.2588 40.453 86.6625M109.672 86.6625C110.633 84.2588 113.361 83.0895 115.765 84.0509L120.686 86.0189L120.686 86.019L120.967 86.1316C126.935 88.5185 131.767 90.4516 135.085 92.1909C136.763 93.071 138.39 94.0688 139.644 95.2716C140.932 96.5074 142.25 98.3817 142.25 100.903C142.25 103.424 140.932 105.299 139.644 106.535C138.39 107.737 136.763 108.735 135.085 109.615C131.767 111.355 126.935 113.288 120.968 115.675L120.686 115.787C118.282 116.749 115.554 115.58 114.593 113.176C113.631 110.772 114.8 108.044 117.204 107.083C123.519 104.557 127.895 102.799 130.732 101.312C131.009 101.167 131.258 101.031 131.483 100.903C131.258 100.776 131.009 100.639 130.732 100.494C127.895 99.0069 123.519 97.2497 117.204 94.7235L117.204 94.7234L112.284 92.7555C109.88 91.7941 108.711 89.0662 109.672 86.6625Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M82.7349 95.2215C80.0351 95.9034 77.6496 96.2156 75.0624 96.2156C68.4347 96.2156 63.1292 94.1658 50.4739 89.1041L32.9211 82.0828L31.005 70.4906C31.6228 70.2429 32.2612 69.9873 32.9209 69.7235L37.8416 67.7553L34.3599 59.0508L29.1559 61.1323C23.1896 63.519 18.3574 65.4519 15.0403 67.191C13.3616 68.0711 11.7353 69.0688 10.4813 70.2716C9.19294 71.5074 7.875 73.3816 7.875 75.9031C7.875 78.4246 9.19294 80.2989 10.4813 81.5347C11.7353 82.7375 13.3616 83.7352 15.0403 84.6153C18.3574 86.3544 23.1896 88.2873 29.1559 90.6738L47.7188 98.0992C59.4463 102.791 66.4429 105.591 75.0624 105.591C79.9029 105.591 84.2314 104.708 89.1735 103.103L82.7349 95.2215ZM31.005 70.4906C25.7083 72.6138 21.9336 74.1622 19.3933 75.494C19.1164 75.6393 18.8664 75.7756 18.642 75.9031C18.8666 76.0306 19.1164 76.167 19.3933 76.3123C22.2298 77.7993 26.6059 79.5566 32.9211 82.0828L31.005 70.4906Z" fill="currentColor"/><path d="M103.95 97.4814L120.968 90.6744C126.935 88.2875 131.768 86.3546 135.085 84.6153C136.763 83.7352 138.39 82.7375 139.644 81.5347C140.932 80.2989 142.25 78.4245 142.25 75.9031C142.25 73.3818 140.932 71.5074 139.644 70.2716C138.39 69.0688 136.763 68.0711 135.085 67.191C131.768 65.4517 126.935 63.5186 120.968 61.1319L115.765 59.0508L112.283 67.7553L117.204 69.7235C123.519 72.2497 127.895 74.007 130.732 75.494C131.009 75.6393 131.258 75.7756 131.483 75.9031C131.258 76.0306 131.009 76.167 130.732 76.3123C127.895 77.7993 123.519 79.5566 117.204 82.0828L99.651 89.1041C98.9921 89.3675 98.3529 89.6231 97.7325 89.8704L103.95 97.4814Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M30.352 19.245C32.3569 17.6071 35.3099 17.9047 36.9478 19.9096L122.201 124.268C123.839 126.272 123.542 129.225 121.537 130.863C119.532 132.501 116.579 132.204 114.941 130.199L29.6875 25.8407C28.0496 23.8359 28.3472 20.8828 30.352 19.245Z" fill="currentColor"/><path d="M60.513 68.0197C57.7149 66.9931 54.4588 65.6979 50.4741 64.1041L32.9211 57.0826C26.6059 54.5566 22.2298 52.7996 19.3933 51.3125C19.1404 51.1802 18.8898 51.0438 18.6414 50.9032C18.8897 50.7626 19.1404 50.6261 19.3933 50.4939C22.2298 49.0068 26.6059 47.2498 32.9211 44.7236C35.3246 43.7623 36.4939 41.0341 35.5324 38.6306C34.5709 36.2268 31.8429 35.0578 29.4392 36.0191L29.1562 36.1323C23.19 38.5188 18.3576 40.4516 15.0403 42.1906C13.3616 43.0708 11.7353 44.0686 10.4813 45.2715C9.19275 46.5075 7.875 48.3817 7.875 50.9032C7.875 53.4245 9.19275 55.299 10.4813 56.5348C11.7353 57.7376 13.3616 58.7355 15.0403 59.6156C18.3576 61.3546 23.19 63.2876 29.1562 65.6739L47.7188 73.0993C57.3544 76.9543 63.7963 79.5316 70.5686 80.3285L60.513 68.0197ZM88.3371 78.3693C92.4206 77.0943 96.8897 75.3061 102.405 73.0994L120.968 65.6745C126.935 63.2878 131.767 61.3548 135.085 59.6156C136.763 58.7355 138.39 57.7376 139.644 56.5348C140.932 55.2988 142.25 53.4245 142.25 50.9032C142.25 48.3819 140.932 46.5075 139.644 45.2716C138.39 44.0686 136.763 43.0708 135.085 42.1906C131.767 40.4516 126.935 38.5185 120.968 36.132L102.408 28.7081C90.6791 24.0151 83.6824 21.2156 75.0624 21.2156C68.2026 21.2156 62.4733 22.9666 54.6317 25.9786C52.215 26.907 51.0084 29.6186 51.9366 32.0353C52.8649 34.4521 55.5765 35.6585 57.9932 34.7302C65.6029 31.8071 69.9984 30.5906 75.0624 30.5906C81.6902 30.5906 86.9955 32.6403 99.651 37.7025L117.204 44.7236C123.519 47.2498 127.895 49.0068 130.732 50.4939C131.009 50.6392 131.259 50.7755 131.483 50.9032C131.259 51.0307 131.009 51.1672 130.732 51.3125C127.895 52.7996 123.519 54.5566 117.204 57.0826L99.651 64.104C91.3916 67.4075 86.2628 69.4282 81.8539 70.4334L88.3371 78.3693Z" fill="currentColor"/></svg>',
			description: 'Send a vote transaction',
			explanation: 'Non stackers can vote by connecting their wallets to EcosystemDAO to use the amount of STX in their wallet to represent a ‘Yes’ vote or a ‘No’ vote.'
		},
	]

	let currentContract = ($daoStore.currentProposal) ? $daoStore.currentProposal?.contractId : getConfig().VITE_DOA_PROPOSAL

	onMount(async () => {
    try {
    } catch (err) {
    }
  })
</script>

<svelte:head>
	<title>Ecosystem DAO - Nakamoto SIP Voting</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<PageIntro {message} />

<div class="py-4 mx-auto max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-8">
    	<div>
			<div class="space-y-6">
				<div>
					<ProposalStageUpdate proposal={undefined} method={1} />
					<!-- <span class="font-mono inline-block py-1 text-sm px-3 rounded-full text-[#131416]/[64%] uppercase tracking-wider border border-[#131416]/[12%]">Current proposal</span> -->
					<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
						<a href="https://github.com/stacksgov/sips/blob/6d27e7cf706df5a367d8714e6037226d741630de/sips/sip-021/sip-021-nakamoto.md" class="py-2 px-4 rounded-md" target="_blank">
							SIP-021 - Nakamoto Release
							<svg class="inline w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M34.8958 27.6042L37.5 25C40.9518 21.5482 40.9518 15.9518 37.5 12.5C34.0482 9.04822 28.4518 9.04822 25 12.5L22.3958 15.1042" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M15.1042 22.3958L12.5 25C9.04822 28.4518 9.04822 34.0482 12.5 37.5C15.9518 40.9518 21.5482 40.9518 25 37.5L27.6042 34.8958" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M29.6875 20.3125L20.3125 29.6875" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</a>
					</h1>
				</div>
				<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350" class="w-auto h-auto md:w-[200px] md:h-[233px] lg:w-[300px] lg:h-[350px]" fill="none">
						<rect width="300" height="350" fill="url(#paint0_linear_42_181)" rx="18"/>
						<path stroke="#141414" stroke-opacity=".8" stroke-width="12" d="M80.133 75.828C75.524 80.605 73 86.861 73 93.5v164c0 14.063 11.435 25.5 25.475 25.5h101.05c14.04 0 25.475-11.437 25.475-25.5V117.298a.359.359 0 0 0-.104-.246l-.005-.005-48.902-48.94-.005-.005a.348.348 0 0 0-.239-.102h-44.356a.313.313 0 0 0 0 .625h35.634c5.799 0 8.414 5.232 8.414 8.79v27.132c0 7.207 5.859 13.064 13.049 13.064h27.111c3.555 0 8.788 2.612 8.788 8.411V257.5c0 13.713-11.147 24.875-24.86 24.875H98.475c-13.713 0-24.86-11.162-24.86-24.875v-164a24.765 24.765 0 0 1 6.951-17.254l-.433-.418Zm0 0c.07-.074.14-.15.207-.227m-.207.227.207-.227m0 0C85.164 70.686 91.57 68 98.475 68h12.086a.313.313 0 0 1 0 .625H98.475c-6.8 0-13.18 2.707-17.907 7.62l-.228-.644Z"/>
						<path fill="#141414" fill-opacity=".8" d="M199.492 202.341c0 2.668-.519 4.918-1.556 6.751-1.038 1.825-2.438 3.21-4.2 4.154-1.763.936-3.728 1.404-5.897 1.404-2.184 0-4.157-.472-5.92-1.416-1.755-.952-3.151-2.34-4.188-4.165-1.03-1.833-1.544-4.076-1.544-6.728 0-2.668.514-4.914 1.544-6.739 1.037-1.833 2.433-3.218 4.188-4.154 1.763-.944 3.736-1.416 5.92-1.416 2.169 0 4.134.472 5.897 1.416 1.762.936 3.162 2.321 4.2 4.154 1.037 1.825 1.556 4.071 1.556 6.739Zm-6.692 0c0-1.435-.191-2.644-.574-3.627-.374-.991-.932-1.739-1.673-2.246-.733-.515-1.637-.773-2.714-.773-1.076 0-1.985.258-2.726.773-.733.507-1.291 1.255-1.673 2.246-.374.983-.561 2.192-.561 3.627 0 1.435.187 2.648.561 3.639.382.983.94 1.732 1.673 2.246.741.507 1.65.761 2.726.761 1.077 0 1.981-.254 2.714-.761.741-.514 1.299-1.263 1.673-2.246.383-.991.574-2.204.574-3.639ZM154.133 195.602v-5.242h20.825v5.242h-7.207v18.72h-6.411v-18.72h-7.207ZM152.905 202.341c0 2.668-.519 4.918-1.556 6.751-1.037 1.825-2.438 3.21-4.2 4.154-1.763.936-3.728 1.404-5.897 1.404-2.184 0-4.157-.472-5.92-1.416-1.754-.952-3.151-2.34-4.188-4.165-1.029-1.833-1.544-4.076-1.544-6.728 0-2.668.515-4.914 1.544-6.739 1.037-1.833 2.434-3.218 4.188-4.154 1.763-.944 3.736-1.416 5.92-1.416 2.169 0 4.134.472 5.897 1.416 1.762.936 3.163 2.321 4.2 4.154 1.037 1.825 1.556 4.071 1.556 6.739Zm-6.692 0c0-1.435-.191-2.644-.573-3.627-.375-.991-.932-1.739-1.673-2.246-.734-.515-1.638-.773-2.715-.773-1.076 0-1.985.258-2.726.773-.733.507-1.29 1.255-1.673 2.246-.374.983-.561 2.192-.561 3.627 0 1.435.187 2.648.561 3.639.383.983.94 1.732 1.673 2.246.741.507 1.65.761 2.726.761 1.077 0 1.981-.254 2.715-.761.741-.514 1.298-1.263 1.673-2.246.382-.991.573-2.204.573-3.639ZM99 190.36h8.096l5.569 13.572h.281l5.569-13.572h8.096v23.962h-6.365v-13.853h-.187l-5.335 13.666h-3.837l-5.335-13.76h-.188v13.947H99V190.36ZM181.687 180.962h-7.02L182.576 157h8.892l7.909 23.962h-7.02l-5.241-17.363h-.188l-5.241 17.363Zm-1.31-9.454h13.197v4.868h-13.197v-4.868ZM150.265 180.962V157h6.505v9.688h.327l7.207-9.688h7.581l-8.096 10.671 8.284 13.291h-7.769l-5.382-8.986-2.152 2.809v6.177h-6.505ZM129.856 180.962h-7.02L130.745 157h8.892l7.908 23.962h-7.019l-5.242-17.363h-.187l-5.241 17.363Zm-1.31-9.454h13.196v4.868h-13.196v-4.868ZM119.731 157v23.962h-5.428l-8.658-12.589h-.14v12.589H99V157h5.522l8.517 12.543h.187V157h6.505ZM187.632 246.035v-16.774h11.86v3.669h-7.393v2.883h6.782v3.67h-6.782v2.883h7.361v3.669h-11.828ZM181.432 234.503c-.042-.546-.243-.972-.602-1.278-.354-.305-.892-.458-1.615-.458-.461 0-.839.057-1.133.172-.29.109-.504.259-.643.45s-.212.41-.217.655c-.011.202.024.385.104.549.086.158.22.303.402.434.182.126.415.24.699.344a7.39 7.39 0 0 0 1.013.279l1.35.294c.91.197 1.69.456 2.338.779.648.322 1.178.701 1.591 1.138.412.431.715.917.908 1.458.198.54.3 1.13.305 1.769-.005 1.103-.276 2.037-.811 2.801-.536.764-1.302 1.346-2.299 1.745-.991.398-2.182.597-3.575.597-1.431 0-2.679-.215-3.745-.647-1.06-.431-1.885-1.094-2.475-1.99-.583-.901-.878-2.053-.883-3.456h4.242c.027.513.153.944.378 1.294.225.349.541.614.948.794.413.181.903.271 1.47.271.477 0 .876-.06 1.198-.181.321-.12.565-.286.731-.499.166-.213.252-.456.257-.729a1.043 1.043 0 0 0-.249-.672c-.155-.196-.412-.371-.771-.524-.359-.158-.844-.306-1.455-.442l-1.639-.36c-1.457-.323-2.606-.86-3.447-1.614-.836-.759-1.251-1.794-1.246-3.104-.005-1.065.274-1.996.836-2.793.568-.803 1.353-1.428 2.354-1.875 1.008-.448 2.162-.672 3.464-.672 1.328 0 2.477.227 3.447.68.969.453 1.717 1.092 2.242 1.916.53.819.798 1.778.803 2.875h-4.275ZM159.468 246.035h-4.821l5.431-16.774h6.107l5.432 16.774h-4.821l-3.6-12.154h-.128l-3.6 12.154Zm-.9-6.618h9.064v3.407h-9.064v-3.407ZM141.117 246.035v-16.774h11.86v3.669h-7.392v2.883h6.782v3.67h-6.782v2.883h7.36v3.669h-11.828ZM128.19 246.035v-16.774h4.468v13.105h6.653v3.669H128.19ZM114.115 246.035v-16.774h11.86v3.669h-7.393v2.883h6.782v3.67h-6.782v2.883h7.36v3.669h-11.827ZM99 246.035v-16.774h7.103c1.222 0 2.29.227 3.206.68a5.033 5.033 0 0 1 2.138 1.957c.509.852.763 1.873.763 3.064 0 1.201-.262 2.214-.787 3.038-.52.825-1.251 1.447-2.194 1.868-.937.42-2.033.63-3.286.63H101.7v-3.538h3.343c.525 0 .972-.065 1.341-.197.375-.136.662-.352.86-.647.204-.294.306-.679.306-1.154 0-.481-.102-.871-.306-1.172a1.714 1.714 0 0 0-.86-.671c-.369-.148-.816-.221-1.341-.221h-1.575v13.137H99Zm9.642-7.699 4.114 7.699h-4.853l-4.018-7.699h4.757Z"/>
						<defs>
							<linearGradient id="paint0_linear_42_181" x1="-485.228" x2="-317.79" y1="78.374" y2="710.886" gradientUnits="userSpaceOnUse">
								<stop stop-color="#141414"/>
								<stop offset=".275" stop-color="#FC6432"/>
							</linearGradient>
						</defs>
					</svg>

					<div class="mt-4 sm:mt-0 relative z-[1]">
						<div class="mb-4">
							<h2 class="text-[#131416] text-xl mb-3">Summary</h2>
							<p class="text-lg text-[#605D5D]">The proposal suggests a significant change to the Stacks blockchain for faster and more reliable blocks by separating block production from cryptographic sortitions. Goals include faster blocks, Bitcoin finality, resistance to Bitcoin forks, and preventing advantages for Bitcoin miners.</p>
						</div>
						<div class="pt-4">
							<h2 class="text-xl mb-3 text-[#131416]">Learn more</h2>
							<ul class="list-disc pl-4 text-[#605D5D]">
								<li><a class="underline" href="https://github.com/stacksgov/sips/blob/6d27e7cf706df5a367d8714e6037226d741630de/sips/sip-021/sip-021-nakamoto.md" target="_blank">Stacks Improvement Proposal: Nakamoto v1 on GitHub</a></li>
								<li><a class="underline" href="https://stacks.org/nakamoto-voting-guide" target="_blank">Nakamoto: Your Guide to Voting</a></li>
							</ul>
						</div>
					</div>

					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326 325" fill="none" class="w-[326px] h-[325px] bottom-[-2em] right-[-2em] absolute">
						<mask id="mask0_47_300" width="408" height="408" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
							<g stroke="#fff" stroke-width="1.25" clip-path="url(#clip0_47_300)">
								<circle cx="204" cy="204" r="768" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="744" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="720" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="696" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="672" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="648" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="624" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="600" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="576" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="552" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="528" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="504" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="480" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="456" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="432" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="408" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="384" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="360" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="336" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="312" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="288" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="264" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="240" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="216" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="192" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="168" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="144" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="120" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="96" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="72" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="48" transform="rotate(180 204 204)"/>
								<circle cx="204" cy="204" r="24" transform="rotate(180 204 204)"/>
							</g>
						</mask>
						<g mask="url(#mask0_47_300)">
							<mask id="mask1_47_300" width="408" height="408" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:luminance">
								<rect width="408" height="408" x="408" y="408" fill="url(#paint0_radial_47_300)" rx=".01" transform="rotate(180 408 408)"/>
							</mask>
							<g mask="url(#mask1_47_300)">
								<path fill="#131416" fill-opacity=".08" d="M408 408H0V0h408z"/>
							</g>
						</g>
						<defs>
							<radialGradient id="paint0_radial_47_300" cx="0" cy="0" r="1" gradientTransform="rotate(90 0 612) scale(204)" gradientUnits="userSpaceOnUse">
								<stop offset=".089" stop-color="#fff"/>
								<stop offset=".159" stop-color="#FEFEFE"/>
								<stop offset=".221" stop-color="#FAFAFA"/>
								<stop offset=".276" stop-color="#F3F3F3"/>
								<stop offset=".325" stop-color="#EAEAEA"/>
								<stop offset=".369" stop-color="#E0E0E0"/>
								<stop offset=".411" stop-color="#D3D3D3"/>
								<stop offset=".452" stop-color="#C4C4C4"/>
								<stop offset=".493" stop-color="#B3B3B3"/>
								<stop offset=".535" stop-color="#A1A1A1"/>
								<stop offset=".58" stop-color="#8E8E8E"/>
								<stop offset=".63" stop-color="#797979"/>
								<stop offset=".687" stop-color="#646464"/>
								<stop offset=".75" stop-color="#4D4D4D"/>
								<stop offset=".823" stop-color="#363636"/>
								<stop offset=".906" stop-color="#1E1E1E"/>
								<stop offset="1"/>
							</radialGradient>
							<clipPath id="clip0_47_300">
								<path fill="#fff" d="M408 408H0V0h408z"/>
							</clipPath>
						</defs>
					</svg>
				</div>
			</div>
			<div class="space-y-6 mt-24">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-6">Cast your vote</h2>
				<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
					{#each votingOptions as opt}
						<a href={`/dao/proposals/${currentContract}?method=${opt.method}`} class="group flex flex-col overflow-hidden border border-transparent hover:border-[#FC6432] rounded-lg relative bg-[#E6E4E2] px-6 py-6 transition duration-300 ease-in-out">

							<svg xmlns="http://www.w3.org/2000/svg" class="absolute top-[-4em] left-1/2 -translate-x-1/2" viewBox="0 0 342 376" width="342" height="376" fill="none">
								<mask id="mask0_48_621" width="397" height="397" x="-28" y="-21" maskUnits="userSpaceOnUse" style="mask-type:alpha">
									<g stroke="#fff" clip-path="url(#clip0_48_621)">
										<path d="M320.5 376V-21M272.5 376V-21M224.5 376V-21M176.5 376V-21M128.5 376V-21M80.5 376V-21M32.5 376V-21M369 328.5H-28M369 280.5H-28M369 232.5H-28M369 184.5H-28M369 136.5H-28M369 88.5H-28M369 40.5H-28"/>
									</g>
								</mask>
								<g mask="url(#mask0_48_621)">
									<mask id="mask1_48_621" width="397" height="397" x="-28" y="-21" maskUnits="userSpaceOnUse" style="mask-type:luminance">
										<rect width="397" height="397" x="369" y="376" fill="url(#paint0_radial_48_621)" rx=".01" transform="rotate(180 369 376)"/>
									</mask>
									<g mask="url(#mask1_48_621)">
										<path fill="#131416" fill-opacity=".08" d="M369 376H-28V-21h397z"/>
									</g>
								</g>
								<defs>
									<radialGradient id="paint0_radial_48_621" cx="0" cy="0" r="1" gradientTransform="rotate(90 -3.5 571) scale(198.5)" gradientUnits="userSpaceOnUse">
										<stop offset=".089" stop-color="#fff"/>
										<stop offset=".159" stop-color="#FEFEFE"/>
										<stop offset=".221" stop-color="#FAFAFA"/>
										<stop offset=".276" stop-color="#F3F3F3"/>
										<stop offset=".325" stop-color="#EAEAEA"/>
										<stop offset=".369" stop-color="#E0E0E0"/>
										<stop offset=".411" stop-color="#D3D3D3"/>
										<stop offset=".452" stop-color="#C4C4C4"/>
										<stop offset=".493" stop-color="#B3B3B3"/>
										<stop offset=".535" stop-color="#A1A1A1"/>
										<stop offset=".58" stop-color="#8E8E8E"/>
										<stop offset=".63" stop-color="#797979"/>
										<stop offset=".687" stop-color="#646464"/>
										<stop offset=".75" stop-color="#4D4D4D"/>
										<stop offset=".823" stop-color="#363636"/>
										<stop offset=".906" stop-color="#1E1E1E"/>
										<stop offset="1"/>
									</radialGradient>
									<clipPath id="clip0_48_621">
										<path fill="#fff" d="M369 376H-28V-21h397z"/>
									</clipPath>
								</defs>
							</svg>

							<div class="flex flex-col h-full relative z-[1]">
								<div class="flex-1">
									{@html opt.icon}
									<h4 class="text-lg mt-12 text-[#131416] mb-3">{opt.title}</h4>
								</div>
								<p class="mt-auto text-[#131416]/[0.64]">{opt.explanation}</p>
							</div>

							<div class="mt-3 text-center sm:hidden w-full text-sm font-mono uppercase inline-block bg-bloodorange px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
								Vote now
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
  	</div>
</div>