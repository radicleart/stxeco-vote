<script lang="ts">
	import type { ProposalEvent } from "$types/stxeco.type";
	import SoloVotingActiveQr from "./SoloVotingActiveQR.svelte";

  export let proposal: ProposalEvent;

</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 md:px-12 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="mt-6 md:mt-0">
      <div class="mb-4">
        <h2 class="font-semibold text-[#131416] text-2xl mb-3">Voting as Solo Stackers (Method 1)</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-8 space-y-3 max-w-xl">
        <p><strong>Instructions</strong>:</p>
        <p>Voters who are stacking on their own must send <strong>a dust amount of BTC (~6000 sats)</strong> from their PoX Bitcoin reward address to either:</p>
        <ul class="list-disc pl-3">
          <li>an address representing the “Yes to Nakamoto Release”</li>
          <li>an address representing the “No to Nakamoto Release”.</li>
        </ul>
      </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350" class="relative z-[1] ml-auto w-auto h-auto md:w-[200px] md:h-[233px] lg:w-[180px] lg:h-[auto]" fill="none">
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

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
  <div class="p-8 bg-[#121314] rounded-2xl">
    <h3 class="text-3xl text-white">Cast your vote</h3>
  </div>
  <SoloVotingActiveQr {proposal}/>
</div>