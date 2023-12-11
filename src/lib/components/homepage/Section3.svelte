<script>
  import CallButtons1 from '$lib/shared/CallButtons1.svelte'
  import Sidebar from './Sidebar.svelte'
  import arr from '$lib/assets/png-assets/stx_eco_directional_arrow.png'
	import { Icon } from "svelte-hero-icons";
	import { CaretRightOutline } from "flowbite-svelte-icons";

  const img1 = "https://images.prismic.io/edao/86ff5a4f-62f6-4961-b872-b22ab3dc2a67_stx_eco_hands_%23image.png?auto=compress,format";
  const img2 = "https://images.prismic.io/edao/5e216471-9b0e-4376-ba06-d36aa651ec11_stx_eco_snapshot_%23image.png?auto=compress,format";
  const img3 = "https://images.prismic.io/edao/fe0199be-cc3f-47cd-8875-81aab1632801_stx_eco_coin_%23image.png?auto=compress,format";
  const img4 = "https://images.prismic.io/edao/5fcfd473-fb50-4b14-a788-701626c8c8a8_stx_eco_laptop_%23image.png?auto=compress,format";
</script>

<section id="section3">
  <div class="row" style="height: 100%; width: 100%;">
    <div class="col-1 sidebar hideme" style="min-height: 100%;">
      <Sidebar context={3} />
    </div>
    <div class="col-md-11 col-sm-12" style="height: 100%;">
      <div class="m-5">
        <div class="row">
          <div class="col-12"><h1><span class="strokeme">Latest</span><br/>Proposals</h1></div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img1} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src={arr} alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Stacks 2.1 Voting</h2>
                <p class="text3">Polls open soon - show your support for the Stacks Upgrade by voting!
                </p>
                <h3 class="pointer"><a class="text-warning" href="/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.edp015-2-1-activation"><Icon src={CaretRightOutline} width={10} height={10}/> vote now</a></h3>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img2} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src={arr} alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Stacks 2.1 Upgrade</h2>
                <p class="text3">The Stacks 2.1 Upgrade brings improvements to Stacking and closer links with Bitcoin
                </p>
                <h3 class="pointer"><a class="text-warning" href="/sip/twopointone"><CaretRightFill width={10} height={10}/> find out more</a></h3>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img3} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src={arr} alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Crowd Fund Proposals</h2>
                <p class="text3">Deploy your proposal and crowd fund support from the community
                </p>
                <h3 class="pointer"><a class="text-warning" href="/dao/proposals/deployment"><CaretRightFill width={10} height={10}/> start here</a></h3>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-xs-12 p-4">
            <p>
              <img src={img4} alt="Rowing together" width="100%" height="auto" />
            </p>
            <div class="row">
              <div class="col-1">
                <img src={arr} alt="Scroll down" width="22" height="auto" />
              </div>
              <div class="col-11 mt-3">
                <h2>Learn Clarity</h2>
                <p class="text3">DAO Extensions are human readable and written in Clarity</p>
                <h3 class="pointer"><a class="text-warning" href="https://clarity-lang.org/" target="_blank"><CaretRightFill width={10} height={10}/> find out more</a></h3>
              </div>
            </div>
          </div>
          <div class="col-12 text-center my-5">
            <CallButtons1 />
          </div>
        </div>
      </div>
    </div>
  </div>
  
</section>

<style>
section {
  max-width: 100vw;
  min-width: 100vw;
  background-color: #333333;
  overflow: hidden;
  border-top: 0pt solid #fff;
}
h1 {
  font-family: Gilroy-ExtraBold;
  color: #FFA701;
  text-transform: uppercase;
  line-height: 3.3rem;
  font-size: 7.2rem;
  line-height: 6.0rem;
}
@media screen and (min-width: 0px) and (max-width: 756px) {
  h1 { 
    font-size: 4.2rem;
    line-height: 3.5rem;;
  }  /* show it on small screens */
}

.strokeme {
  color: #333333;
	-webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #FFA701;
}

h2 {
  color: #FFA701;
  text-transform: uppercase;
  font-size: 1.75rem;
  font-weight: 700;
}
h3 {
  font-family: Gilroy-ExtraBold;
  color: #FFA701;
  text-transform: uppercase;
  font-size: 1.2rem;
  font-weight: 300;
}

.text3 {
  font-size: 1.2rem;
  color: #ededed;
  line-height: 1.4rem;
}
</style>
