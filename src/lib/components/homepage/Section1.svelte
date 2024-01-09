<script>
// @ts-nocheck
import { goto } from '$app/navigation';
import play from '$lib/assets/png-assets/stx_eco_play_video.png'
import pause from '$lib/assets/png-assets/stx_eco_pause_video.png'
import adown from '$lib/assets/png-assets/stx_eco_arrow_down.png'

// medium 
const bgvideo = 'https://prismic-io.s3.amazonaws.com/edao/ea5c92b8-d910-479c-813b-a3ef19292578_stx_eco_colour_balls_animation_medium.mp4';

let playing = true;
// Get the button
const openVoting = () => {
  goto('/sip/twopointone', { replaceState: false })
}

// Pause and play the video, and change the button text
const toggleVideo = () => {
	const video = document.getElementById("myVideo");
  	if (video.paused) {
   	 	video.play();
		  playing = true;
  	} else {
    	video.pause();
		  playing = false;
  	}
}
const scrollTo = () => {
  const getMeTo = document.getElementById("section2");
  if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
}

</script>
  
<section id="section1" class="h-full">
  <video autoplay muted loop id="myVideo">
    <source src={bgvideo} type="video/mp4">
  </video>
  <!-- Optional: some overlay text to describe the video -->
  <div class="flex flex-col gap-y-5 h-full align-middle self-center mt-20 justify-start px-[115px]">
    <h1 class="text-4xl font-bold">
      vote. voice. contribute
      <br/>collaborate. create
    </h1>
    <p class="text-2xl font-bold">Be the future of decentralised democracy
    </p>
    <button class="btn w-[250px] " on:click={() => { openVoting() }}>Vote for SIP 15</button>
  </div>
  <div class="section-footer">
    <div class="flex justify-end m-5">
      <div>
        <a href="/" class="pointer" on:click|preventDefault={() => { toggleVideo() }}>
          {#if playing}
            <img src={pause} alt="Pause video" width="40" height="auto" />
          {:else}
            <img src={play} alt="Play video" width="40" height="auto" />
          {/if}
        </a>
      </div>
    </div>
  </div>
</section>

<style>
section {
  font-family: Gilroy-ExtraBold;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  border: 0pt solid rgb(35, 183, 37);
}
#myVideo {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  z-index: -100;
  overflow: hidden;
  min-height: 100%;
  width: auto;
  object-fit: fill;
}
.section-footer {
  position: absolute;
  height: auto;
  bottom: 0;
  background: rgb(118, 112, 112, 0);
  color: #f1f1f1;
  width: 100%;
  text-align: right;
  padding: 5px 20px;
  border: 0pt solid rgb(85, 12, 12);
} 

/* Add some content at the bottom of the video/page
.content {
  position: fixed;
  bottom: 0;
  background: rgb(118, 112, 112, 0.5);
  color: #f1f1f1;
  width: 100%;
  padding: 40px;
} 
*/
.btn {
  border: none;
  border-radius: 50px!important;
  padding: 15px 20px;
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #fff;
  background-color: #4786cd;
}
.btn:hover {
  background-color: #fff;
  color: #4786cd;
}
</style>
