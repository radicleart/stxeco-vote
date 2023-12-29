<script lang="ts">
	import { Icon, ShieldCheck } from "svelte-hero-icons";
	import Banner from "$lib/components/shared/Banner.svelte";
	import { Button } from "flowbite-svelte";
	import { goto } from "$app/navigation";
	import { CONFIG } from "$lib/config";

	const gotoVotePage = (method:number) => {
		goto('/dao/proposals/' + CONFIG.VITE_DOA_PROPOSAL + '?method=' + method)
	}

	let stepsDeposit = [
		{
			title: 'Voting for Solo Stackers',
			method: 1,
			description: 'Send a dust BTC transaction',
			explanation: 'Voters who are Stacking on their own must send a dust amount of BTC (~6,000 sats) from their PoX reward address to an address representing a ‘Yes on 2.1’ vote or an address representing a ‘No on 2.1’ vote.'
		},
		{
			title: 'Voting for Community Pool Stackers',
			method: 2,
			description: 'Send a minimal STX transaction.',
			explanation: 'Voters who are Stacking in a community pool must send a minimal amount of STX (~1 uSTX) from their Stacking address to an address representing a ‘Yes on 2.1’ vote or an address representing a ‘No on 2.1’ vote.'
		},
		{
			title: 'Voting for Exchange Stackers and Non-Stackers',
			method: 3,
			description: 'Send a vote transaction.',
			explanation: 'Voters who are Stacking via an exchange or not Stacking at all (and have a STX balance below the Stacking minimum) can connect their wallets to EcosystemDAO and use the amount of STX in their wallet to represent a ‘Yes on 2.1’ vote or a ‘No on 2.1’ vote.'
		},
	]

	let startBlockHeight = 0;
	let balanceAtHeight = 0;
</script>

<svelte:head>
	<title>Ecosystem DAO - Nakamoto SIP Voting</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
  <div class="flex flex-col w-full my-8">
    <div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">

			<div class="space-y-8">
				<h1 class="text-3xl sm:text-4xl font-bold">Stacks Nakamoto Upgrade Vote</h1>
				<div class="md:grid md:grid-cols-1 md:gap-6 space-y-4 md:space-y-0">
					<div class="space-y-6 px-6 sm:px-10 divide-y divide-gray-400/30 py-6 bg-white/5 rounded-lg border border-primary-500/20 shadow-[0px_1px_6px_0px_rgba(254,219,99,0.20)]">
						<h3 class="text-2xl font-bold mt-10 lg:mt-0">3 Ways to Vote</h3>
						<!--
						<div>
							<div class="lg:flex lg:items-start lg:justify-start  lg:space-y-0">
								<SwitchGraphic reverse={true} />
							</div>
						</div>
						-->
						<div>
							<div class="pt-8 space-y-8">
								{#each stepsDeposit as step, i}
									<div class="flex gap-4">
										<div class="w-2 rounded-md bg-primary-02 shrink-0"></div>
										<div class="flex-1">
											<div class="flex items-center justify-between flex-1 mb-4">
												<span class="font-medium text-transparent bg-clip-text bg-primary-02">Method {i+1}</span>
												<span class="inline-flex px-3 py-1 text-xs font-medium bg-gray-400 rounded-3xl text-gray-1000">{step.title}</span>
											</div>
											<p>{step.description}</p>
											<p class="my-3 text-sm text-gray-300">{step.explanation}</p>
											<Button on:click={() => gotoVotePage(step.method)} class="bg-primary-600 text-center font-medium focus:ring-4 focus:outline-none items-center px-5 py-2.5 text-sm text-white focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg !border-[0.5px] !border-gray-700">
												Vote now
											</Button>
										</div>
									</div>
								{/each}
								<Banner bannerType={'info'} message={'No stacks are transferred when voting through Ecosystem DAO.'}/>
							</div>
						</div>
					</div>
				</div>

				<div class="p-[1.2px] bg-[linear-gradient(126.12deg,rgba(237,105,60,0.5)11.8%,rgba(254,219,99,0.2)72.43%)] rounded-lg">
					<div
						class="relative flex items-center p-6 bg-[linear-gradient(126.12deg,rgba(0,0,0,0.95)21.1%,rgba(18,18,18,0.5)53.58%);] rounded-lg"
					>
						<div class="sm:flex sm:items-center gap-x-10">							

							<div class="w-full ">
								<div class="text-white flex flex-col gap-y-6">
									<div class="flex flex-col gap-y-6"> 
										<h2 class="text-primary-500">
										<span class="text-2xl font-bold mt-10 lg:mt-0">What is SIP XXX ?</span></h2> 
										<p class="sub-text">Stacks 2.1 is a network-wide upgrade that will strengthen the connection between Stacks and Bitcoin. The upgrade is slated to bring improvements to stacking and proof-of-transfer, Clarity functionality, bridges, decentralised mining pools, and more. Should this upgrade pass, the Stacks community can expect:</p> 
										<ul> 
											<li>More efficient Bitcoin yield via Stacking</li> 
											<li>More robust bridges to other networks</li> 
											<li>Improvements to developers' ability to trigger interactions between Stacks and Bitcoin</li> 
											<li>Fundamental groundwork laid for Subnets, which will increase speed and scalability</li> 
										</ul> 
										<p>In addition, SIP-020 adds 6 new native functions to perform bitwise operations in Clarity code, and will be activated if the SIP-015 vote passes.</p> <p><a class="text-info" href="https://stacks.org/stacks-21-what-to-expect?ref=stacksroadmap" target="_blank">→ Learn more about Stacks 2.1</a></p> <p><a class="text-info" href="https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#for-non-stackers" target="_blank">→ Read the full SIP for Stacks 2.1</a></p> <p><a class="text-info" href="https://www.hiro.so/blog/a-developers-guide-to-stacks-2-1" target="_blank">→ Learn more about Clarity language improvements in Stacks 2.1</a></p> <p><a class="text-info" href="https://github.com/obycode/sips/blob/bitwise-ops/sips/sip-020/sip-020-bitwise-ops.md" target="_blank">→ Learn more about SIP-020 Bitwise Operations in Clarity</a></p> 
									</div>
									<p>After voting you'll be able to claim your "I Voted" badge for your profile picture to display on social media. So be sure to have your favorite profile picture NFTs in your voting wallet!</p>
									<p class="text-warning-500">Your snapshot balance at block {startBlockHeight} was {balanceAtHeight} STX.</p>
								</div>
							</div>
						</div>
					</div>
					<Banner bannerType={'info'} message={'Voting will take place during reward cycles x and y. This window is estimated to begin starting November 10, 2022 and ending December 8, 2022.'}/>
				</div>

				<div class="bg-[linear-gradient(180deg,#A9E6D2_0%,rgba(169,230,210,0.00)100%)] p-[1.2px] rounded-lg">
					<div class="relative lg:flex lg:items-center lg:justify-between gap-10 px-6 sm:px-10 py-6 rounded-lg bg-black-01">
						<div>
							<div class="flex items-center">
								<Icon src={ShieldCheck} class="w-6 h-6 mr-2 shrink-0 text-success-400" aria-hidden="true" />
								<h3 class="text-xl font-bold">Requirements</h3>
							</div>
							<ul class="pl-4 mt-3 space-y-2 list-disc">
								<li>A wallet that supports both Bitcoin (BTC) and Stacks (STX);<br/>we recommend Leather or Xverse.</li>
								<li>Some BTC in your wallet. ✨</li>
							</ul>
						</div>
						<div class="lg:flex lg:items-center lg:gap-4 space-y-4 lg:space-y-0 mt-6 lg:mt-0">
							<a href="https://leather.io/install-extension" class="block flex-1 border-gray-900 border hover:border-gray-600 transition duration-1000 ease-in-out rounded-md px-12 py-4 bg-[linear-gradient(126deg,#121212_43.55%,#404040_81.39%,#E4DDD6_94.51%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
								<svg class="mx-auto w-32 h-auto" viewBox="0 0 94 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M90.2321 14.5531C89.366 16.1704 88.0947 17.1632 87.113 17.1632C86.3625 17.1632 85.7853 16.5394 85.7853 15.0643C85.7853 12.7661 86.9404 9.19207 87.4886 7.31913H78.8841L78.0461 10.1848C76.7763 14.582 74.7833 17.1632 71.6361 17.1632C71.1738 17.1632 70.6255 17.078 70.3366 16.9076C72.7044 15.2339 75.1011 12.5675 75.1011 9.92925C75.1011 7.74514 73.4838 6.89387 72.0109 6.89387C67.3916 6.89387 64.0991 12.8513 65.3408 16.5957C64.5903 16.8513 63.8976 17.1632 63.0604 17.1632C62.2225 17.1632 61.7602 16.5957 61.9335 15.8296C62.1358 14.922 63.2908 11.8866 63.2908 10.2412C63.2908 8.22745 61.7024 6.86572 59.3064 6.86572C58.7574 6.86572 58.1513 7.00722 57.5446 7.23393L59.0752 1.92925H56.0717L52.491 14.2982C51.9428 16.2267 50.2973 17.1632 48.9393 17.1632C47.236 17.1632 46.6011 15.8296 47.0048 14.4968L48.2754 10.156H51.5383L52.3755 7.31913H49.0837L50.6433 1.92925H47.6405L43.742 15.3762C43.3671 16.6527 42.4714 17.1632 41.692 17.1632C40.4503 17.1632 40.0747 16.1704 40.3347 15.2628L42.6448 7.31913C41.8365 7.06427 40.6814 6.86572 39.7865 6.86572C34.6174 6.86572 29.7372 11.3762 29.7372 15.8296V15.8422C28.3547 16.7127 26.7507 17.1632 25.3482 17.1632C24.3666 17.1632 23.8183 17.078 23.3849 16.8513C25.8105 15.291 28.3229 12.6809 28.3229 9.92925C28.3229 7.74514 26.7055 6.89387 25.2327 6.89387C20.6414 6.89387 17.4364 12.709 18.5048 16.4253C17.4942 16.9365 16.5703 17.1913 15.5598 17.1913C13.9713 17.1913 12.4696 16.5394 11.3145 15.2339L12.7874 10.156C16.3681 9.8722 21.1038 6.97907 21.1038 3.43323C21.1038 1.22023 19.602 0 17.6965 0C14.3181 0 11.7768 3.20578 10.5929 7.31913C8.39844 7.06427 7.21451 4.73791 8.94743 1.92925H5.82833C3.8939 6.15595 5.85723 9.10687 9.78462 10.156L8.83185 13.4188C7.38788 12.5394 6.26174 12.1986 4.93335 12.1986C-1.44783 12.1986 -1.70788 20 4.55773 20C6.37732 20 8.5718 19.0635 9.72683 17.8159C11.3723 19.2339 12.9897 20 15.0686 20C16.657 20 18.2736 19.5458 19.9487 18.5812C21.0749 19.4895 22.5477 20 24.6555 20C26.5277 20 28.3999 19.6184 30.3277 18.2871C30.8989 19.2747 31.9413 20 33.6935 20C35.1664 20 36.7829 19.3762 37.9958 18.0426C38.8907 19.3191 40.248 20 41.6342 20C42.7892 20 43.9732 19.5458 44.9837 18.6383C45.792 19.4895 47.2649 20 48.8822 20C51.3938 20 54.1951 18.6953 55.1767 15.3191L56.3036 11.4043C56.6496 10.2412 57.5735 9.70254 58.6418 9.70254C59.5664 9.70254 60.0569 10.156 60.0569 10.9502C60.0569 12.426 58.7285 15.943 58.7285 17.1913C58.7285 19.291 60.1725 20 62.1069 20C63.3197 20 64.2725 19.9718 66.9871 18.7805C68.0843 19.5747 69.7883 20 71.7227 20C76.025 20 79.0285 17.1061 81.0786 10.156H83.6768C83.1863 11.7733 82.8396 13.5603 82.8396 15.1487C82.8396 17.8159 83.8213 20 86.8537 20C89.2215 20 92.5133 17.6455 93.3504 14.5531H90.2321ZM17.263 2.83682C17.812 2.83682 18.1869 3.14947 18.1869 3.60289C18.1869 5.10687 15.4731 7.03538 13.5957 7.31913C14.4625 4.36896 16.2236 2.83682 17.263 2.83682ZM4.7022 17.1632C2.24767 17.1632 2.44993 14.7805 4.90446 14.7805C5.9728 14.7805 6.80999 15.1206 7.82055 15.9718C7.12783 16.7379 5.79944 17.1632 4.7022 17.1632ZM24.3666 9.70254C24.9734 9.70254 25.3482 10.0715 25.3482 10.6672C25.3482 12.2556 23.2404 14.213 21.4505 15.2058C20.8148 13.3899 22.6344 9.70254 24.3666 9.70254ZM34.2136 17.1632C33.3179 17.1632 32.8852 16.5394 32.8852 15.631C32.8852 13.4469 35.2819 9.75884 38.9485 9.70254C37.6209 14.2693 36.7252 17.1632 34.2136 17.1632ZM71.1449 9.70254C71.7516 9.70254 72.1265 10.0715 72.1265 10.6672C72.1265 12.2556 69.9328 14.2982 68.2577 15.3191C67.5353 13.6173 69.3838 9.70254 71.1449 9.70254Z" fill="white"/>
									</svg>
									<p class="mt-6 text-sm text-center">
										Browser extension<br/>Desktop app
									</p>
								</a>
							<a href="https://www.xverse.app/download" class="block flex-1 border-gray-900 border hover:border-gray-600 transition duration-1000 ease-in-out rounded-md px-12 py-4 bg-[linear-gradient(126deg,#121212_43.38%,#404040_81.42%,#EE7A30_94.1%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
								<svg class="mx-auto w-32 h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 16" fill="none">
									<path fill="#fff" d="M19.696 15.053 14.95 1.551c-.051-.153.05-.305.228-.305h3.3c.101 0 .177.076.228.152l2.208 7.082.634 2.208c0 .025.026.025.026.025.025 0 .025 0 .025-.025.127-.584.33-1.32.61-2.209l2.258-7.08c.026-.102.127-.153.229-.153h3.248c.153 0 .28.152.229.305l-4.797 13.502c-.026.101-.127.152-.229.152H19.9c-.102 0-.178-.05-.203-.152ZM35.71 15.637c-2.258 0-4.035-.686-5.33-2.082-1.294-1.396-1.928-3.172-1.928-5.355 0-2.157.634-3.858 1.929-5.254C31.675 1.526 33.325.84 35.355.84c2.208 0 3.909.761 5.102 2.284 1.167 1.498 1.776 3.452 1.802 5.914a.228.228 0 0 1-.229.228h-9.67c-.152 0-.254.127-.228.28.178.99.533 1.75 1.091 2.309.61.609 1.422.914 2.462.914 1.32 0 2.183-.533 2.64-1.6.025-.075.127-.126.203-.126h3.223c.152 0 .254.152.228.279-.304 1.193-.99 2.183-2.005 2.995-1.116.888-2.538 1.32-4.264 1.32Zm-.279-11.955c-1.726 0-2.792.914-3.198 2.742-.025.152.077.279.229.279h5.685c.127 0 .254-.127.228-.254-.101-.787-.38-1.421-.888-1.929-.533-.558-1.244-.838-2.056-.838ZM51.65 4.216a.228.228 0 0 1-.228.228h-3.757a.227.227 0 0 0-.228.228v10.33a.228.228 0 0 1-.228.229h-3.122a.228.228 0 0 1-.229-.229V5.688A4.446 4.446 0 0 1 48.3 1.246h3.096c.127 0 .229.102.229.229l.025 2.74ZM59.085 15.637c-2.03 0-3.604-.432-4.746-1.32-1.066-.838-1.523-1.954-1.675-3.376 0-.127.102-.254.228-.254h3.02c.102 0 .204.077.23.178.278 1.421 1.116 2.132 2.867 2.132.838 0 1.472-.152 1.929-.431.457-.305.685-.686.685-1.168 0-.178-.025-.355-.101-.482a1.227 1.227 0 0 0-.33-.406c-.152-.127-.305-.203-.406-.28-.127-.076-.33-.152-.61-.228a7.315 7.315 0 0 0-.685-.152 27.865 27.865 0 0 1-.812-.152c-.38-.077-.634-.102-.787-.153a18.675 18.675 0 0 1-1.878-.457 7.877 7.877 0 0 1-1.523-.685c-.532-.304-.939-.71-1.192-1.218-.28-.508-.407-1.142-.407-1.878 0-1.447.533-2.564 1.625-3.325 1.091-.761 2.436-1.168 4.111-1.168 1.828 0 3.25.407 4.29 1.244.964.787 1.396 1.827 1.573 3.147.026.127-.101.254-.228.254h-2.944c-.102 0-.203-.076-.229-.203-.203-1.244-.939-1.853-2.512-1.853-.762 0-1.346.127-1.777.406-.431.28-.66.66-.66 1.142 0 .153.026.305.102.457a.884.884 0 0 0 .33.356c.152.101.304.177.456.253.153.077.356.127.635.203.28.077.508.127.71.153.204.05.483.101.838.152.355.076.635.102.838.152.584.127 1.066.254 1.446.33.381.102.813.254 1.32.482.508.229.889.483 1.168.762.279.28.533.66.736 1.142.203.482.304 1.04.304 1.675 0 1.396-.558 2.487-1.65 3.3-1.065.862-2.512 1.269-4.289 1.269ZM73.452 15.637c-2.26 0-4.036-.686-5.33-2.082-1.295-1.396-1.93-3.172-1.93-5.355 0-2.157.635-3.858 1.93-5.254C69.416 1.526 71.066.84 73.096.84c2.208 0 3.909.761 5.102 2.284C79.365 4.622 79.974 6.576 80 9.038a.228.228 0 0 1-.229.228h-9.67c-.152 0-.253.127-.228.28.178.99.533 1.75 1.091 2.309.61.609 1.422.914 2.462.914 1.32 0 2.183-.533 2.64-1.6.025-.075.127-.126.203-.126h3.223c.152 0 .254.152.229.279-.305 1.193-.99 2.183-2.005 2.995-1.117.888-2.538 1.32-4.264 1.32Zm-.305-11.955c-1.726 0-2.792.914-3.198 2.742-.025.152.076.279.229.279h5.685c.127 0 .254-.127.228-.254-.101-.787-.38-1.421-.888-1.929-.508-.558-1.218-.838-2.056-.838ZM14.01 14.977v-2.538a.532.532 0 0 0-.102-.28L3.071 1.298a.382.382 0 0 0-.28-.102H.255a.227.227 0 0 0-.229.229v2.36c0 .102.051.203.102.28L4.01 7.945c.102.102.102.229 0 .33L.076 12.21c-.05.051-.076.102-.076.153v2.588c0 .127.102.229.228.229h4.264a.227.227 0 0 0 .229-.229V13.43c0-.051.025-.127.076-.153l2.106-2.106c.102-.102.229-.102.33 0l3.909 3.908a.382.382 0 0 0 .28.102h2.36c.126.025.228-.076.228-.203Z"/>
									<path fill="#EE7A30" d="M8.3 4.546h2.132c.127 0 .228.101.228.228v2.132c0 .203.254.304.38.152l2.92-2.919c.05-.05.076-.101.076-.152V1.424a.227.227 0 0 0-.229-.229H11.22c-.051 0-.127.026-.153.076L8.148 4.165c-.153.127-.051.38.152.38Z"/>
								</svg>
								<p class="mt-6 text-sm text-center">
									Browser extension<br/>Mobile app
								</p>
							</a>
						</div>
					</div>
				</div>

			</div>
		</div>
  </div>
</div>
