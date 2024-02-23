<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fabric } from "fabric";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let downloaded = false;

  export let item:any;
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
    link.download = 'I_Voted_For_Stacks_Nakamoto.png';
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

  const selectCanvas = () => {
    let rawDataUrl = canv.toDataURL({
        format: 'png',
        quality: 0.8
    })
    item.rawDataUrl = rawDataUrl
    dispatch("select_item", {item});
  }

  const mountCanvas = async function () {
    canv = new fabric.Canvas(canvas, {
        preserveObjectStacking: true
      });
      var bnsText = new fabric.Text(item.metaData.name, {
        left: 10,
        top: 35,
        strokeWidth: 0,
        stroke:"#ffffff",
        paintFirst: "stroke",
        fill: '#ffffff',
        fontSize: 28,
        fontFamily: 'Verdana',
        charSpacing:2
      });
      fabric.Image.fromURL(item.metaData.image, function(img) {
        img1 = img //.set({scaleX: (canv.width / img1W) * 0.2, scaleY: (canv.height / img1H), left: 0, top: 0, angle: 0});
        img1.lockMovementX = true;
        img1.lockMovementY = true;
        img1.lockScalingX = true;
        img1.lockScalingY = true;
        img1.lockRotation = true;
        img1.scaleToHeight(canvasHeight);
        img1.scaleToWidth(canvasWidth);
        canv.add(img1).renderAll();
        canv.setDimensions({width:canvasWidth, height:canvasWidth})
        //bnsText.top = (canvasWidth / 3) - ((bnsText.height || 50) / 4)
        bnsText.left = (canvasWidth) - ((bnsText.width || 200) + 30)
        //bnsText.scaleToWidth(canvasWidth - 100);
        canv.add(bnsText);
      }, { crossOrigin: 'anonymous' });
      canv.setDimensions({width:canvasWidth, height:canvasWidth})
  };

  let canvasWidth = window.innerWidth
  let canvasHeight = window.innerWidth
  onMount(async () => {
    const cEl = document.getElementById('canvas-div')
    if (cEl) {
      canvasWidth = cEl.clientWidth
    }
    await mountCanvas();
  });
</script>

<p class="text-base mt-3 mb-1">Custom badge preview</p>
{#if !downloaded}
{#key componentKey}
  <div id="canvas-div" class="border-none border-error-500">
    <canvas class="border-none border-lightpurple" bind:this={canvas} width={canvasWidth}  height={canvasHeight} style={'width: ' + canvasWidth + 'px; height: ' + canvasWidth + 'px; border-radius: ' + borders + ';'}/>
  </div>
  <div>
    <div class="flex justify-between w-[400px] mt-6">
      <div class="flex flex-nowrap gap-x-2">
        <button class="text-sm font-mono uppercase inline-flex items-center bg-white text-[#131416] px-4 py-2 rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:click|preventDefault={selectCanvas}><span>&lt;-</span>&nbsp;Select</button>
      </div>
    </div>
  </div>
{/key}
{:else}
<div class="icontainer"></div>
{/if}
