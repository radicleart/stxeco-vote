<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { fabric } from "fabric";
    import { createEventDispatcher } from "svelte";
	import { ArrowDownCircle, Icon } from "svelte-hero-icons";
	import { DownloadOutline, DownloadSolid } from "flowbite-svelte-icons";
	import bannerBlue from '$lib/assets/banner-blue.png'
	import bannerWhite from '$lib/assets/banner-white.png'

    const dispatch = createEventDispatcher();
    let downloaded = false;

    $: bannerImageSrc = bannerBlue;
    export let imageSrc:string;
    export let hasVotes:boolean;
    let canvas: HTMLCanvasElement;
    let canv:any;
    let img1:any;
    let img2:any;
    let componentKey = 0;

    const saveImage = (e:any) => {
      let rawDataUrl = canv.toDataURL({
          format: 'png',
          quality: 0.8
      })
      //const dataUrl = rawDataUrl.replace('data:', '').replace(/^.+,/, '');;
      const image1 = rawDataUrl; //.replace('image/png', 'image/octet-stream');
      const link = document.createElement('a');
      link.download = 'I_Voted_For_Stacks_Two_Point_One.png';
      link.href = image1;
      link.target = '_blank'
      link.click();
      // downloaded = true;

      try {
        const image = document.createElement('img');
        image.src = image1; //'data:image/png;base64,' + dataUrl.replace('data:', '').replace(/^.+,/, ''); //.split(';base64,')[1];
        document.querySelector('.icontainer')?.appendChild(image);
        //document.getElementById("dimage").src = rawDataUrl.split(';base64,')[1];
        localStorage.removeItem('VOTED_FLAG');
      } catch (err) {}
    }

    let borders = 'none';
    const toggleRoundness= () => {
      if (borders === 'none') borders = '50%';
      else borders = 'none';
    }

    onDestroy(() => {
      if (canv) canv.dispose();
    })

    const toggleCanvas = () => {
      dispatch("toggle_canvas");
    }

    const switchImage = function (img:number) {
      if (img === 1) {
        bannerImageSrc = bannerWhite;
      } else {
        bannerImageSrc = bannerBlue;
      }
      //componentKey++;
      canv.dispose();
      mountCanvas();
    };

    const modifiedHandler = function (evt:any) {
      const modifiedObject = evt.target;
      canv.sendToBack(img1);
      console.log(modifiedObject.get('left'), modifiedObject.get('top'));
    };

    const mountCanvas = async function () {
      canv = new fabric.Canvas(canvas, {
          preserveObjectStacking: true
        });
        var text = new fabric.Text('Loading image..', {
          left: 10,
          top: 10,
          strokeWidth: 0,
          stroke:"#ffffff",
          paintFirst: "stroke",
          fill: '#ffffff',
          fontSize: 24,
          charSpacing:1
        });
        const rect = new fabric.Rect({
          left: 10,
          top: 10,
          width: 20,
          height: 15,
          fill: "blue"
        });
        fabric.Image.fromURL(imageSrc, function(img) {
          img1 = img.set({scaleX: (400 / (img.width || 100)), scaleY: (400 / (img.height||100)), left: 0, top: 0, angle: 0});
          //img1.scaleToWidth(50);
          //img1.scaleToHeight(50);
          //canv.setBackgroundImage(img, canv.renderAll.bind(canv), {
          //  scaleX: canv.width / img1.width,
          //  scaleY: canv.height / img1.height
          //})
          canv.add(img1).renderAll();
          //canv.moveTo(img1, 50);
          //anv.on('img1:modified', modifiedHandler);
          if (bannerImageSrc.length === 0) {
            canv.remove(text).renderAll();
          }
          canv.setDimensions({width:400, height:400})
          if (hasVotes && bannerImageSrc.length > 0) {
            fabric.Image.fromURL(bannerImageSrc, function(img) {
              if (bannerImageSrc.indexOf('white') > -1) {
                img2 = img.set({scaleX: (canv.width / ((img.width || 100) * 1.1)), scaleY: ((canv.height * 0.27) / (img.height || 100)), left: 10, top: 280, angle: 0});
              } else {
                img2 = img.set({scaleX: (canv.width / (img.width || 100)), scaleY: ((canv.height * 0.22) / (img.height || 100)), left: 10, top: 280, angle: 0});
              }
              //img2 = img.set({left: 0, top: 300, angle: 0});
              canv.add(img2).renderAll();
              canv.remove(text).renderAll();
              //canv.moveTo(img2, 100);
              //canv.on('img2:modified', modifiedHandler);
              canv.on({
                'object:modified' : modifiedHandler
              });
            }, { crossOrigin: 'anonymous' });
          }
        }, { crossOrigin: 'anonymous' });
        // canv.add(rect);
        canv.setDimensions({width:400, height:400})
        canv.add(text);
    };

    onMount(async () => {
      await mountCanvas();
    });
</script>

<div class="flex justify-between mt-5">
  <div class="text-2xl">Download Your Badge</div>
  <div>
    <button class={'text-black md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2   rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0'} on:click|preventDefault={toggleCanvas}>back</button>
  </div>
</div>
{#if !hasVotes}
<div class="flex justify-center text-warning-500">
  <p>Please register a vote on the proposal to see the I Voted Banner </p>
</div>
{:else}
<div class="my-8 flex justify-between">
  <div>Choose banner, position and download:
    <div class="ms-5">
      <a href="/" on:click|preventDefault={() => switchImage(2)}><img width="140px" src={bannerBlue} alt="blue banner"/></a>
      <a href="/" on:click|preventDefault={() => switchImage(1)}><img width="140px" src={bannerWhite} alt="white banner"/></a>
    </div>
  </div>
</div>
{/if}
{#if !downloaded}
{#key componentKey}
<div class="flex flex-col">
  <div>
    <canvas bind:this={canvas} width="400" height="400" style={'width: 400px; height: 400px; border-radius: ' + borders + ';'}/>
  </div>
  <div class="flex justify-between w-[400px]">
      <a href="/" on:click|preventDefault={saveImage}><Icon src={ArrowDownCircle} width={30} height={30}/></a>
      <span class="text-sm"><a href="/" on:click|preventDefault={() => {toggleRoundness()}}>twitter preview</a></span>
  </div>
</div>
{/key}
{:else}
<div class="icontainer"></div>
{/if}
<style>
  canvas {
    border: 1pt solid #ccc;
  }
</style>