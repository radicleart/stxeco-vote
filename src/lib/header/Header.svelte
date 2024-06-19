<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'

	

	const getNavActiveClass = (item:string) => {
		if (location.pathname.indexOf(item) > -1) return ' text-base text-primary-500 !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
		return ' text-base !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
	}

</script>

<Navbar
	class="relative mx-auto flex max-w-7xl items-center !px-6 lg:px-8 !bg-transparent"
	let:hidden
	let:toggle
	fluid={true}
>

  	<div class="hidden md:flex md:gap-2 md:order-3">
		</div>


		<NavUl
			{hidden}
			class="order-1 md:flex-0"
			ulClass="dark:bg-white dark:md:bg-white md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4 sm:justify-end md:text-sand-700 py-2.5 px-2"
		>
			</NavUl>
			<NavUl
			{hidden}
			class="order-1 md:flex-1"
			ulClass="dark:bg-white dark:md:bg-white md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4 sm:justify-end md:text-sand-700 py-2.5 px-2"
		>

			<NavLi nonActiveClass="md:hidden" class="-ml-2 -mr-3">
			</NavLi>
		</NavUl>
</Navbar>

