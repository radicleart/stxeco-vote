<script>
  import LogoStacks from '../components/shared/LogoStacks.svelte';
</script>

<div class="mx-auto flex max-w-7xl items-center !px-6 lg:px-8 py-6 mt-32">
  <div class="py-10 px-10 md:px-12 rounded-2xl relative w-full bg-[#F4F3F0] rounded-tl-none">
    <div class="top-0 absolute left-0 top-[-96px]">
      <svg  width="252" height="96" viewBox="0 0 252 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0H228C234.627 0 240 5.37258 240 12V84C240 90.6274 245.373 96 252 96H0V12C0 5.37258 5.37258 0 12 0Z" fill="#F4F3F0"/>
      </svg>

      <a href="https://www.stacks.co/" class="absolute top-8 left-1/2 -translate-x-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500/50 rounded-lg">
        <LogoStacks class="w-28 h-auto" />
      </a>
    </div>

    <div class="py-20 space-y-6">
      <p class="text-lg text-[#131416]/[0.64]">Explore the Stacks:</p>

      <div class="flex gap-x-6">
        <a href="https://www.stacks.co/ecosystem" class="inline-flex items-center bg-[#131416] px-4 py-2 font-normal text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
          Ecosystem &nbsp;<span class="text-[#FDFDFC]/[0.64]">-></span>
        </a>
        <a href="https://www.stacks.co/build" class="inline-flex items-center bg-[#EEEBE7] px-4 py-2 font-normal text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
          Developer Hub &nbsp;<span class="text-[#27282B]">-></span>
        </a>
      </div>
    </div>
  </div>
</div>