<script lang="ts">
  import DaoUtils from '$lib/service/DaoUtils';
  import ChainUtils from '$lib/service/ChainUtils';
  import FormatUtils from '$lib/service/FormatUtils';
  import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import { CONFIG } from '$lib/config';
	import { ArrowDown, ArrowUp, Icon } from "svelte-hero-icons"
	import { CaretDownOutline, CaretUpOutline } from 'flowbite-svelte-icons';

  const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
  export let method1:any;

  const data = {yes:{"total":"138587597558415",voters:{solo:[{stx_address:"SM1DSTRMKA4CSDEC5JD80FHK3N525MPSMKTRDHAHK",ustx:"5407873280000",pox_address:"3ChZ4Nbh57QwP3RsFRQ6mnQcz34yPANSKV",vote:"yes",type:"solo"},{stx_address:"SP221KXXMJY8S6V6G7N1CKVSDJJ6Q8T3BFBGK61M2",ustx:"3347008000000",pox_address:"3ChZ4Nbh57QwP3RsFRQ6mnQcz34yPANSKV",vote:"yes",type:"solo"},{stx_address:"SM15G2EHAEJECA5PSQM2678QBXX8WJSQPX58T7F4G",ustx:"10000001000000",pox_address:"3BPM9UktK9JeyA4c91TgkKWwZe9aYohrFH",vote:"yes",type:"solo"},{stx_address:"SM2T4VK2E9Q8RB8PT48RS2V4ZC1J8KZZ4FYTHZYA7",ustx:"10000000000000",pox_address:"3BPM9UktK9JeyA4c91TgkKWwZe9aYohrFH",vote:"yes",type:"solo"},{stx_address:"SM2KX7J6F4Z039FJHHDSW1VXFX1HF7310ZSNDRGCK",ustx:"25000000000000",pox_address:"36hQtSEXBMevo5chpxhfAGiCTSC34QKgda",vote:"yes",type:"solo"},{stx_address:"SP16YFW0EJ2WWRWFC29FTSFBS3WQAZF536WM12T2R",ustx:"1328482000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP1CPAV9AFNNSX1Z1ZJEYH8RY4FTTYED3PB5M28S7",ustx:"1047734000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP1VXJ8CKXH7WWXMGRAC1G2MZ8Z0NQ2ADY81ECMHW",ustx:"1807667000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP21T2QX7WB2AZRHTRFATPEMK66FBEWBZXJ1M0A95",ustx:"1258031000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP23X97DMHEZM3WHZ7E6T5N3J3EKJ56HRBGNB7Y1V",ustx:"2403238000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP2AQ31Z7F6YFYD7FBPQYKKWVFNPDZGBSG063EFMF",ustx:"1158808000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP2TRGH9N0DRB0ZHHHX0GP2V6J16K59JDKZVMV0H5",ustx:"1630699000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP31PEGJE8XT4QC9S9YFM05H0VP6Z9AFJQQJ9GEC1",ustx:"1888923000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP386XPJXT6CV1X6CCKKCJK2W56RJQW6MZSVYAWGG",ustx:"1470623000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SPC56XMQ7YTBKZ2Q1F6HRV87705NDTC8DX9Q1A5A",ustx:"1090996000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SPZNSFA5JDAY9YTA5DA0D3SN2KW9WE8RKW59EYKK",ustx:"744012000000",pox_address:"36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC",vote:"yes",type:"solo"},{stx_address:"SP1ADFEHK8QF20B7X1A4GRMRK6S4RXE1500K4G7QA",ustx:"760000000000",pox_address:"1AtmGCBtgBzNevQ7ZKs6xDvsw9sLJkGcoe",vote:"yes",type:"solo"},{stx_address:"SP3573HMB9SPCTMT85YS85KEPYCX33E6MZGQ5QB2A",ustx:"1440000000000",pox_address:"1AtmGCBtgBzNevQ7ZKs6xDvsw9sLJkGcoe",vote:"yes",type:"solo"},{stx_address:"SM1B13GAFTB6DPB5VGQZYSR7XGZPC0CQJVMTVW6BE",ustx:"9940000000000",pox_address:"3AH3YzZEYfmDrnTicLyRYUpbjwhyrnu9ZM",vote:"yes",type:"solo"},{stx_address:"SP2389QCGHF3EFNSZAKQDA8SS3SW8KR24D7Z06HHC",ustx:"821100000000",pox_address:"3Q8PwRNvbsFQrbsAQoDfijV6L9P7dJeZkn",vote:"yes",type:"solo"},{stx_address:"SP3G0J7HGZBHCK8H14RD0XVY2PRYZDJ3N5Y354YT1",ustx:"793515000000",pox_address:"3Q8PwRNvbsFQrbsAQoDfijV6L9P7dJeZkn",vote:"yes",type:"solo"},{stx_address:"SP1CXRYP7XKJFH1BQ9Z8TGWS5S4QBJHES4N2687E7",ustx:"1200000000000",pox_address:"37K8y7oU9xBxw43bjsX7bRPFNVQZykvird",vote:"yes",type:"solo"},{stx_address:"SP3433K5D0BJ212KVHD5J8KE782AG3E4XYEP9548V",ustx:"450000000000",pox_address:"37K8y7oU9xBxw43bjsX7bRPFNVQZykvird",vote:"yes",type:"solo"},{stx_address:"SPEJYD1YTYKK0RBQH200TV7X7ZJC8KMAA5D3SXX3",ustx:"450000000000",pox_address:"37K8y7oU9xBxw43bjsX7bRPFNVQZykvird",vote:"yes",type:"solo"},{stx_address:"SP13CM9QN6J23B6T6415SC0T8JQZ3YADPD1TJ27WZ",ustx:"280000000000",pox_address:"1PSnCwZ7hhmEin5dHHjjz4JPGEXGsLkaqW",vote:"yes",type:"solo"},{stx_address:"SM225KZ70EEFT799Q265PT9X53EYZKKAQPS9V78Z1",ustx:"11290000000000",pox_address:"3Bju4h3PfVpfFNeNQ4thLsXigGM91jURaZ",vote:"yes",type:"solo"},{stx_address:"SM3MRPECV0C76Z1AK71QD7WKA7JP72DV6CA4VFERC",ustx:"9940000000000",pox_address:"3Q2fpkY4srLR22YBhLzAVejuM6p5LEMr5B",vote:"yes",type:"solo"},{stx_address:"SM1AN7V0YHA3F6X5E5XVMQ3D8VDBCMQA1GKMRADBS",ustx:"9940000000000",pox_address:"3B6yFoWxGpRP3Z4SLQHYcxJdmyKKv4V5wZ",vote:"yes",type:"solo"},{stx_address:"SP3CVQGASE285WB6TXES7DVHCQ6PHQVNQ3FAANKBJ",ustx:"600006000000",pox_address:"1PgsdEANmib7JUkfwrxKV494a21yQdyxen",vote:"yes",type:"solo"},{stx_address:"SM2RBEQT0H8MW4WEH0ZG5TRAD1ZT3K09X09H22T6Z",ustx:"8000000000000",pox_address:"3AEaCPD8KHhudgXdnzGpZLboUrfKUKqDW7",vote:"yes",type:"solo"},{stx_address:"SP02VFZ3G4YWB469T0FBPEW0JM36S5A5T49AZA3K",ustx:"170001000000",pox_address:"3NvLpDoQvVemXUeQu6UfUuEgrurrGbyNnM",vote:"yes",type:"solo"},{stx_address:"SP16J2EFKJRDHM4XR4NZE3GDDHBDYCXTKDTZ81V7A",ustx:"617001000000",pox_address:"3NvLpDoQvVemXUeQu6UfUuEgrurrGbyNnM",vote:"yes",type:"solo"},{stx_address:"SPQRZQWAZ78SE0Y9R571AGTK9V4GT9CWAFAQRNDK",ustx:"174001000000",pox_address:"3NvLpDoQvVemXUeQu6UfUuEgrurrGbyNnM",vote:"yes",type:"solo"},{stx_address:"SPYK7WJCM4PMCEH4CCM4FHA3RTG946QKJBNN5553",ustx:"120000000000",pox_address:"3NvLpDoQvVemXUeQu6UfUuEgrurrGbyNnM",vote:"yes",type:"solo"},{stx_address:"SM3N7WM5G4SEY49XA4NH6HD62T73T77BE234N80BM",ustx:"717974000000",pox_address:"3HASeAxLLZQJTbGDTSyfxbJXLtnUF8K1Dw",vote:"yes",type:"solo"},{stx_address:"SM2CC48KX8HASDE0BR9HXWCBJMK7T2YV9BFKZ83X2",ustx:"8000000000000",pox_address:"38wxx1c4xS5umg7XgcFbRn9tYQLxwve1nF",vote:"yes",type:"solo"}],pool:[{stx_address:"SP1NGMS9Z48PRXFAG2MKBSP0PWERF07C0KV9SPJ66",ustx:"1500000000000",vote:"yes",pox_address:"12DQ3u4JdnGf6QZF9qAd7z9zUo7NnXpXFg","delegator":"SP2H485NJWV1M1XVS3N8CM64KM205G25X5JZ8FR04",type:"pool"},{stx_address:"SPQ2HN9TYF8ZYY9D3G45NGYA9GHA6QZHQ8AXF5QM",ustx:"25000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP4DYYK99BZS7S95KYYEJAJE5VJ21F57M4NS0Q5F",ustx:"45000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP12QGTQ22KVNSTEJYCWDJ5MJQ8BKX476X56HCD25",ustx:"55240000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP1MPJF1VCNE2WFKK9XN5Y3MR3X557DBYWGSRT2HR",ustx:"200000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP3SF0PSD7KYVJQPKKRBYJFF7NENGFHZSBVHM3B27",ustx:"9000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP2ZFPT5E7YGZ4P3E14TDEX6PSQ9YWMZRCA720FG4",ustx:"11111000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP1PS8F8KCW6NAQZBPRXMV9MJYT90CBRMY8K38Y67",ustx:"2588000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP1Q1Y5SRJA68VK7BKQNRXCKB9HKF3ZM48352Q5F7",ustx:"10000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP1WYMS04HEP4V5RQQ51JJ4D9S1Z15RTJ3GPR0HDK",ustx:"36201000000",vote:"yes",pox_address:"397nXAJvv477V94DZSQSnHVR9do93ibTVP","delegator":"SPXVRSEH2BKSXAEJ00F1BY562P45D5ERPSKR4Q33",type:"pool"},{stx_address:"SP3ZVY1FJED9TPJNE3TB0CSRT0131H1NQ6D32PKTJ",ustx:"85000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP2BGPBWZFS5TJ4NJTRMGZVG1V2JAJ1ZQ7D6AKZYP",ustx:"1000000000",vote:"yes",pox_address:"397nXAJvv477V94DZSQSnHVR9do93ibTVP","delegator":"SPXVRSEH2BKSXAEJ00F1BY562P45D5ERPSKR4Q33",type:"pool"},{stx_address:"SP9TN8DRZZYDY4HN6QKHGAGHKN6B8DPAV69P64W8",ustx:"206700000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP1KWMJYPHM5RFC6DEFEV4S3NKETTBRGN8KD3B4WB",ustx:"680000000",vote:"yes",pox_address:"397nXAJvv477V94DZSQSnHVR9do93ibTVP","delegator":"SPXVRSEH2BKSXAEJ00F1BY562P45D5ERPSKR4Q33",type:"pool"},{stx_address:"SP2KW6DXVTR0SJGY3GN8GMPRP0KK2J8B9T4PMJWEP",ustx:"696860000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP370GG80AXHB8M74STXT9TQAMK4F9RZ8CPH7E809",ustx:"29903731144",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP2KD44XNHAXEPY4WXDQDCM596DNM68N29EGWJJ52",ustx:"22000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP1T4W78G06T6SFWPKP8K53QK2GQT41J6PT4Z8712",ustx:"8315000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP4C294T7W2DZN0ZNP64QFKRVVJHS50QZNTFZ1FA",ustx:"2030000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP1AV94YJEXKVJVYZPYHE5NBG8TJVMYW5YTJ47KHJ",ustx:"13347633106",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP31SXJHBV3YN94HQX7NR7TV9RBM8NSNYAGXG9R6X",ustx:"1200000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SPYMQGWH0SXVZQY2R46CYWVX1CEVHHV34H76DC49",ustx:"30000000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"},{stx_address:"SP1405MRD5WHDQ1ERFPJ43NYVQV7Q172B5CVSVMBD",ustx:"462857359474",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP28GPT0D74CR0JX34ZVRCV2J4TDH413Y5Q97X76Z",ustx:"18993980191",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP3W40MRS2BYEK9DEXAZQD5P08F4XR521621HMHTS",ustx:"17000000000",vote:"yes",pox_address:"3A8n8rwMnHnt2BqnjW4R73eZCMcUDTpYvv","delegator":"SP3TDKYYRTYFE32N19484838WEJ25GX40Z24GECPZ",type:"pool"},{stx_address:"SP2APBCHA5YWSB4MBRHN4KAVPM6EM84B4YFS88CHB",ustx:"6853000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SPQWV24PYDJ6S36GB06E1KMWNHG34NGAEXZD5Y4K",ustx:"2500000000",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP700C57YJFD5RGHK0GN46478WBAM2KG3A4MN2QJ",type:"pool"},{stx_address:"SP34T0DS0ECN32J0JK891YP6JQ8VZDHJ98MPR74GX",ustx:"323574500",vote:"yes",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"}]}},no:{"total":"4400000000",voters:{solo:[],pool:[{stx_address:"SP1JX76Z86NPWZVP9RKZWTVNB4GCRZD1A002V4CXE",ustx:"4400000000",vote:"no",pox_address:"33WSGLeVoEpuZDjB54HKZ1y5YsERELoVNq","delegator":"SP6K6QNYFYF57K814W4SHNGG23XNYYE1B8NV0G1Y",type:"pool"}]}},invalid:[]};
  
  let showVotes = false;
  let componentKey = 0;
  const color = 'warning';
  let sortDir = '';
  let sortField = 'voter';
  const reorder = (sf:string) => {
      sortField = sf;
      sortDir = (sortDir === '-') ? '' : '-';
      componentKey++;
  }

  const scrollTop = () => {
    const getMeTo = document.getElementById("page-header");
    if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
  }
  
  
  const votes: any[] = []
  let countFor = 0;
  let countAgainst = 0;
  let numbFor = 0;
  let numbAgainst = 0;
  let winning = 'danger';

  onMount(async () => {
    for (const value of data.yes.voters.solo) {
      votes.push({
        address: value.stx_address,
        locked: Number(value.ustx),
        for: value.vote === 'yes'
      })
      if (value.vote === 'yes') {
        countFor += Number(value.ustx);
        numbFor++;
      } else {
        countAgainst += Number(value.ustx);
        numbAgainst++;
      }
    }
    if (Number(((countFor / (countFor + countAgainst)) * 100).toFixed(2)) > 80) {
      winning = 'success';
    }
  })
  $: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
  $: vAg = FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(countAgainst)));
  $: vFr = FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(countFor)));
  $: inFavour = Number(((countFor / (countFor + countAgainst)) * 100).toFixed(2));
  $: totalAccounts = numbAgainst + numbFor;
  $: totalVotePower = FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(countFor + countAgainst)));

</script>
  
  <section class="bg-card my-5 p-4">
    <div class="row">
      <div class="cols-12"><h1 class={'text-' + color}><span>Method 1: Stacking Solo</span>
      <span class="css-1wdxw4w"><svg viewBox="0 0 4091.27 4091.73" focusable="false" class="chakra-icon css-1lj29s9" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="nonzero"><path fill="white" d="M4030.06 2540.77C3756.82 3636.78 2646.74 4303.79 1550.6 4030.48 454.92 3757.24-212.09 2647.09 61.27 1551.17c273.12-1096.13 1383.2-1763.19 2479-1489.95C3636.33 334.46 4303.3 1444.73 4030.03 2540.79l.02-.02z"></path><path fill="currentColor" d="M2947.77 1754.38c40.72-272.26-166.56-418.61-450-516.24l91.95-368.8-224.5-55.94-89.51 359.09-179.87-42.34L2186 768.69l-224.36-55.94-92 368.68-143.35-33.69.26-1.16-309.59-77.31-59.72 239.78s166.56 38.18 163.05 40.53c90.91 22.69 107.35 82.87 104.62 130.57l-104.74 420.15c6.26 1.59 14.38 3.89 23.34 7.49l-23.73-5.87-146.81 588.57c-11.11 27.62-39.31 69.07-102.87 53.33 2.25 3.26-163.17-40.72-163.17-40.72l-111.46 256.98 292.15 72.83 160.06 41.3-92.9 373.03 224.24 55.94 92-369.07 178.91 46.43-91.69 367.33 224.51 55.94 92.89-372.33c382.82 72.45 670.67 43.24 791.83-303.02 97.63-278.78-4.86-439.58-206.26-544.44 146.69-33.83 257.18-130.31 286.64-329.61l-.07-.05zm-512.93 719.26c-69.38 278.78-538.76 128.08-690.94 90.29l123.28-494.2c152.17 37.99 640.17 113.17 567.67 403.91zm69.43-723.3c-63.29 253.58-453.96 124.75-580.69 93.16l111.77-448.21c126.73 31.59 534.85 90.55 468.94 355.05h-.02z"></path></svg></span>
      </h1></div>
      <div class="cols-12"><h4 class="text-white">Total voting power is <span class="text-warning">{totalVotePower}</span> with votes cast from <span class="text-warning">{totalAccounts}</span> accounts.</h4></div>
      <div class="cols-12"><p class="text-white"><a href="https://sip015.xyz/">Voting now closed</a></p></div>
    </div>
    <div class="my-5 p-4">
      <div class={'mt-5 row text-' + color}>
        <div class="col-md-6 col-sm-12 text-center mb-5">
          <h4 class="text-big text-center text-success">{vFr} <span class="text-white" style="font-size: 2.2rem;">YES ON 2.1</span></h4>
          <h6 class="text-center text-success">from {numbFor} accounts</h6>
        </div>
        <div class="col-md-6 col-sm-12 text-center mb-5">
          <h4 class="text-big text-center text-danger">{vAg} <span class="text-white" style="font-size: 2.2rem;">NO ON 2.1</span></h4>
          <h6 class="text-center text-danger">from {numbAgainst} accounts</h6>
        </div>
      </div>
      <div class={' mb-4 d-flex justify-content-around text-' + winning}>
        <div class="text-big text-center" style="font-size: 2.2rem;">
          <span class="text-big text-center">{inFavour}%</span> <span class="text-white"> in favour of this proposal</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="cols-12 text-end my-3">
        <p class="w-100 text-right">
          <a href="/" class={'text-white'} on:click|preventDefault={() => { showVotes = !showVotes }}>{#if showVotes}<Icon src={CaretUpOutline} />{:else}<Icon src={CaretDownOutline} />{/if} transactions</a>
          <a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTop()}><img class="mx-2" src="/img/png-assets/stx_eco_arrow_up.png" alt="Scroll down" width="20" height="auto" /></a>
        </p>
      </div>
    </div>
    
    {#if showVotes}
    <div class="row">
      <div class="cols-12 my-3">
        <table class="table text-white">
          <thead>
            <tr>
              <th scope="col" class="pointer" on:click={() => reorder('address')}>{#if sortDir}<Icon src={ArrowDown} />{:else}<Icon src={ArrowUp} />{/if} Voter</th>
              <th scope="col" class="pointer" on:click={() => reorder('locked')}>{#if sortDir}<Icon src={ArrowDown} />{:else}<Icon src={ArrowUp} />{/if} Power</th>
              <th scope="col" class="pointer" on:click={() => reorder('for')}>{#if sortDir}<Icon src={ArrowDown} />{:else}<Icon src={ArrowUp} />{/if} For/Against</th>
            </tr>
          </thead>
          <tbody>
        {#key componentKey}
        {#each sortedEvents as vote}
        <tr>
          <th scope="row" class={(vote.address === account.stxAddress) ? 'text-success' : ''} title={'I voted!'}>
            <div class="">{vote.address.substring(0,5) + '..' + vote.address.substring(vote.address.length - 8)}</div>
            <!--<div class="">{vote.address}</div>-->
          </th>
          <td class="py-3">{@html ChainUtils.fromOnChainAmount(vote.locked)}</td>
          <td class="py-3">{@html (vote.for) ? '<span class="text-warning">for</span>' : 'against'}</td>
        </tr>
        {/each}
        {/key}
    </tbody>
  </table>
  </div>
  </div>
  {/if}
  </section>
  
  <style>
    .text-big {
      font-size: 2.0rem;
    }
    h1 {
      font-size: 1.8rem;
    }
  section {
  }
  .part0 {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .part1 {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .text-big {
      font-size: 2.0rem;
  }
  .css-1wdxw4w {
      width: 2.0rem;
      height: 2.0rem;
      display: inline-block;
      line-height: 1em;
      flex-shrink: 0;
      color: rgb(85, 70, 255);
      vertical-align:middle;
      margin-inline-start: 2px;
  }
  </style>
  