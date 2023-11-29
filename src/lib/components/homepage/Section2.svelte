<script>
import Sidebar from './Sidebar.svelte'
import CallButtons1 from '$lib/shared/CallButtons1.svelte'

const rowers = "https://images.prismic.io/edao/c5c4c13b-34a0-4c05-a3c1-01aaada52aef_stx_eco_rowing_%23image.png?auto=compress,format";
function scrollTo() {
  const getMeTo = document.getElementById("section3");
  if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
}
</script>
  
<section id="section2">
  <div class="row" style="height: 100%; width: 100%;">
    <div class="col-1 sidebar hideme" style="min-height: 100%;">
      <Sidebar context={2} />
    </div>
    <div class="col-md-11 col-sm-12 mx-0" style="height: 100%; padding-top: 30px;">
      <div class="m-5">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 ">
            <div>
              <p><span class="text1">Join our Stacks Community</span>
                <span class="text2">of forward thinking humans
                  on a mission to build the future of decentralised
                  governance and blockchain technology.
                </span>
              </p>
              <p class="text3">Be part of the future. Simply become a member of the Stacks
                Ecosystem DAO where you get to vote on proposals under consideration,
                gather information about community sentiment and engage with the community.
                It's the perfect place to get involved with our open source project - advancing
                Stacks technology in a real-life DAO.
              </p>
              <p class="my-5">
                <CallButtons1 />
              </p>
              </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 hideme"  style="height: 100%;">
            <div class="">
              <img src={rowers} alt="Rowing together" width="100%" height="auto" />
              <!--
              <div class="square-thing">
                <div class="mb-2 text-left"><img src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="22" height="auto" /></div>
                <h1>HERO DAO</h1>
                <p>Be part of the future.<br/>
                Become a member of the<br/>
                Stacks Ecosystem DAO.</p>
                <button>› VOTE NOW</button>
                <div class="w-100 d-flex justify-content-end"><img src="/img/png-assets/stx_eco_expand_window.png" alt="Scroll down" width="30" height="auto" /></div>
              </div>
              -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</section>

<style>
section {
  min-height: 100vh;
  max-height: 320vh;
  min-width: 100vw;
  max-width: 100vw;
  background-color: #333333;
  overflow: hidden;
}
.text1 {
  font-family: Gilroy-ExtraBold;
  font-size: 3.0rem;
  line-height: 3.5rem;
  color: #e71d73;
  text-transform: uppercase;
}
.text2 {
  font-family: Gilroy-Light;
  font-size: 3.0rem;
  line-height: 3.5rem;
  color: #ededed;
}
.text3 {
  font-family: Gilroy-Light;
  font-size: 1.5rem;
  color: #ededed;
  line-height: 2.2rem;
}
/**
.square-thing {
  width: 230px;
  padding: 10px;
  position: relative;
  top: -400px;
  right: -350px;
  font-family: Gilroy-ExtraBold;
  max-height: 30%;
  background-color: #E71D73;
}
.square-thing h1 {
  font-size: 1.5rem;
  color: #ededed;
  text-transform: uppercase;
}
.square-thing p {
  font-family: Gilroy-Light;
  font-size: 1.0rem;
  color: #ededed;
  text-transform: none;
}
.square-thing button {
  font-family: Gilroy-ExtraBold;
  font-size: 1.0rem;
  color: #ededed;
  text-transform: uppercase;
  background-color: transparent;
  border: none;
}
*/

.section-footer {
  position: relative;
  height: auto;
  bottom: 0;
  background: rgb(118, 112, 112, 0);
  color: #f1f1f1;
  width: 100%;
  text-align: right;
  padding: 5px 20px;
  border: 0pt solid rgb(85, 12, 12);
} 

</style>
