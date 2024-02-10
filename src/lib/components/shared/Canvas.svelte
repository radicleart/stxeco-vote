<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { fabric } from "fabric";
    import { createEventDispatcher } from "svelte";
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
          img1 = img //.set({scaleX: (canv.width / img1W) * 0.2, scaleY: (canv.height / img1H), left: 0, top: 0, angle: 0});
          img1.lockMovementX = true;
          img1.lockMovementY = true;
          img1.lockScalingX = true;
          img1.lockScalingY = true;
          img1.lockRotation = true;
          img1.scaleToHeight(canvasWidth);
          img1.scaleToWidth(canvasWidth);

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
          canv.setDimensions({width:canvasWidth, height:canvasWidth})
          if (hasVotes && bannerImageSrc.length > 0) {
            fabric.Image.fromURL(bannerImageSrc, function(img) {
              const reductioW = (canv.width / (img.width || 100)) * 1
              const reductioH = (canv.width / (img.height || 100)) * 1
              if (bannerImageSrc.indexOf('white') > -1) {
                img2 = img.set({scaleX: reductioW, scaleY: reductioH});
              } else {
                img2 = img.set({scaleX: reductioW, scaleY: reductioH});
              }
              img2.scaleToWidth(canvasWidth);
              img2.viewportCenterV();
              img2.set({top: canvasWidth - (canvasWidth/2)});
              canv.add(img2).renderAll();
              canv.remove(text).renderAll();
            }, { crossOrigin: 'anonymous' });
          }
        }, { crossOrigin: 'anonymous' });
        // canv.add(rect);
        canv.setDimensions({width:canvasWidth, height:canvasWidth})
        canv.add(text);
    };

    let canvasWidth = window.innerWidth
    onMount(async () => {
      const cEl = document.getElementById('canvas-div')
      if (cEl) {
        canvasWidth = cEl.clientWidth
      }
      await mountCanvas();
    });
</script>

<p class="text-base mt-3 mb-1">Select the banner</p>
<div class="flex flex-row gap-4 mb-8">
  <div class="bg-white flex items-center justify-center py-2 px-2 rounded-lg">
    <button on:click|preventDefault={() => switchImage(2)}><img width="auto" src={bannerBlue} alt="blue banner"/></button>
  </div>
  <div class="bg-white flex items-center justify-center py-2 px-2 rounded-lg">
    <button on:click|preventDefault={() => switchImage(1)}><img width="auto" src={bannerWhite} alt="white banner"/></button>
  </div>
</div>
<p class="text-base mt-3 mb-1">Custom badge preview</p>
{#if !downloaded}
  {#key componentKey}
    <div id="canvas-div" class="border-none border-error-500">
        <canvas bind:this={canvas} width={canvasWidth}  height={canvasWidth} style={'width: ' + canvasWidth + 'px; height: ' + canvasWidth + 'px; border-radius: ' + borders + ';'}/>
      </div>
    <div>
      <button class="ml-auto mt-2 text-xs font-mono uppercase inline-block items-center bg-[#EEEBE7] px-2 py-1 text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:click|preventDefault={() => {toggleRoundness()}}>Preview as circle</button>
      <div class="flex justify-between w-[400px] mt-6">
        <div class="flex flex-nowrap gap-x-2">
          <button class="text-sm font-mono uppercase inline-flex items-center bg-white text-[#131416] px-4 py-2 rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:click|preventDefault={toggleCanvas}><span>&lt;-</span>&nbsp;Back</button>
          <button class="text-sm font-mono uppercase inline-flex items-center bg-[#131416] px-4 py-2 text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:click|preventDefault={saveImage}>Download&nbsp;<span class="text-[#FDFDFC]/[0.64]">-&gt;</span></button>
        </div>
      </div>
    </div>
  {/key}
{:else}
  <div class="icontainer"></div>
{/if}
