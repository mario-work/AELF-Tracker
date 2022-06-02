const hamburger_icon = document.getElementById("menu-hamburger");
const close_sidebar = document.getElementById("close_sidebar");
const sidebar = document.getElementById("sidebar");
const nav = document.getElementById("nav");
const content = document.getElementById("content");
const main_block = document.getElementsByClassName("main_block")[0];
const bottom_menu = document.getElementById("bottom_menu");
const overlay = document.getElementById("overlay");
const wallet_address = document.getElementsByClassName("wallet")[0];
var addNewWallet = document.getElementById("addNewWallet");

const bottom_menu_items = document.querySelectorAll(".item");
const listOfTokens = document.getElementById("listOfTokens");
const refreshAndSort = document.getElementById("refreshAndSort");
var refreshBtn = null;

var one_balance = document.getElementById("one_balance");
var showMoreBlock = document.getElementById("showMoreBlock");
var showMoreBtn = document.getElementById("showMoreBtn");

const walletAelf = AElf.wallet.getWalletByPrivateKey('_');

const networkIndicator = document.getElementById("networkIndicator");

const chains = [
	{"title":"AELF Main Chain", "id" : "aelf_main", "rpc":"https://explorer.aelf.io/chain", "type":"mainnet"},
	{"title":"tDVV Side Chain", "id" : "tdvv_main", "rpc":"https://tdvv-explorer.aelf.io/chain", "type":"mainnet"},
	{"title":"AELF Testnet Chain", "id" : "aelf_test", "rpc":"https://aelf-explorer-test.aelf.io/chain", "type":"testnet"},
	{"title":"tDVV Testnet Side Chain", "id" : "tdvv_test", "rpc":"https://tdvv-explorer-test.aelf.io/chain", "type":"testnet"}
]

if(!localStorage.getItem('chainType') || !localStorage.getItem('chainID') || !localStorage.getItem('rpc')){
	localStorage.setItem('chainID', "aelf_main");
	localStorage.setItem('rpc', "https://explorer.aelf.io/chain");
	localStorage.setItem('chainType', "mainnet");
}

if(!localStorage.getItem("walletsStorage") || JSON.parse(localStorage.getItem("walletsStorage")).length == 0){
	localStorage.setItem("walletsStorage", JSON.stringify([]));
	localStorage.setItem("currentWallet", null);
} 
else {
	if(!localStorage.getItem("currentWallet")){
		localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

		var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
		var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
		wallet_address.classList.add("exist");
		wallet_address.innerHTML = `<span>${nameWal}</span><br>${addWal.substring(0, 9)}...${addWal.substring(40)}`;

		if(wallet_address.classList.contains("exist")){
			wallet_address.addEventListener("click", ()=>{
				navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
			})
		}

	} else{
		var checkThisAddress = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		if(checkThisAddress < 0){
			localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);
		}

		var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
		var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
		wallet_address.classList.add("exist");
		wallet_address.innerHTML = `<span>${nameWal}</span><br>${addWal.substring(0, 9)}...${addWal.substring(40)}`;
		
		if(wallet_address.classList.contains("exist")){
			wallet_address.addEventListener("click", ()=>{
				navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
			})
		}

	}
}




addNewWallet.addEventListener("click", ()=>{
	render("addressBook", main_block, null);
	bottom_menu_items.forEach((item) => {
		item.classList.remove("active");
	})
	bottom_menu_items[3].classList.add("active");
})


bottom_menu_items.forEach((item) => {
	item.addEventListener("click", ()=>{
		if(!item.classList.contains("active")){
			render(item.getAttribute("data-id"), main_block, null);
		}

		bottom_menu_items.forEach((item) => {
			item.classList.remove("active");
		})
		item.classList.add("active");
	})
})

wallet_address.addEventListener("click", ()=>{
	wallet_address.classList.add("copied");
})

wallet_address.addEventListener("mouseover", ()=>{
	wallet_address.classList.remove("copied");
})


hamburger_icon.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");

	const walletsList = document.getElementById("walletsList");
	var arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));

	walletsList.innerHTML = "";

	if(arrayOfWallets.length == 0){
		walletsList.innerHTML = `<span class="title">Your address book is empty</span>`;
	} else{
		var str = "";
		for(const wallet of arrayOfWallets){
			var checked = "";
			if(localStorage.getItem("currentWallet") == wallet.address){
				checked = `checked`;
			}
			str += `
				<li class="walletItem ${checked}" data-wallet="${wallet.address}" data-name="${wallet.name}">
					<div class="wallet">
						<span>${wallet.name}</span> <br>${wallet.address.substring(0, 9)}...${wallet.address.substring(40)}
					</div>
					<span class="checked"><i class="fa fa-check" aria-hidden="true"></i></span>
				</li>`;
		}
		walletsList.innerHTML += `<ul>${str}</ul>`;

		const walletItems = document.querySelectorAll(".walletItem");
		walletItems.forEach((item) => {
				item.addEventListener("click", ()=>{ 
					localStorage.setItem("currentWallet", item.getAttribute("data-wallet"));
					walletItems.forEach((item) => {
						item.classList.remove("checked");
					})
					item.classList.add("checked");

					sidebar.classList.toggle("show_sidebar");
					nav.classList.toggle("blur");
					content.classList.toggle("blur");
					bottom_menu.classList.toggle("blur");
					overlay.classList.toggle("show");

					wallet_address.innerHTML = `<span>${item.getAttribute("data-name")}</span><br>${item.getAttribute("data-wallet").substring(0, 9)}...${item.getAttribute("data-wallet").substring(40)}`;

					tokenList = "";
					address = item.getAttribute("data-wallet");
					render("balance", main_block, null);

				}) 
		})

	}

})

overlay.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");
})

close_sidebar.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");
})




networkIndicator.className = "";
networkIndicator.classList.add(`chain_${localStorage.getItem('chainID')}`);
networkIndicator.classList.add(localStorage.getItem('chainType'));


const templates = {};

var tokenList = "";
var chainId = localStorage.getItem('chainID');
var rpc = localStorage.getItem('rpc');
var address = localStorage.getItem("currentWallet");



if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
	render("noWallet", main_block, "Balance");
}
else{
	render("balance", main_block, null);
}

function loadMore(targetElement, sendedData){
	const listOfTokens = document.getElementById("listOfTokens");
	targetElement.classList.add("hidden");
	var tokensInList = document.getElementsByClassName("token").length;

	if(sendedData.data.items.length > tokensInList+5){
		var maxToShow = tokensInList + 5;
		var showBtnMore = true;
	} else{
		var maxToShow = sendedData.data.items.length;
		var showBtnMore = false;
	}

	;(async () => {
		var balance = null;
		for(var i=tokensInList; i < maxToShow; i++){
			balance = (Math.round(sendedData.data.items[i].balance  * 100000) / 100000);
			realLogoUrl = `https://eu.ui-avatars.com/api/?name=${sendedData.data.items[i].symbol[0]}`;

			listOfTokens.innerHTML += `<li class="token" >
				<img src="${realLogoUrl}" >
				<div>
					<p class="title">${sendedData.data.items[i].name}</p>
					<p class="subtitle">Balance: ${balance.toFixed(4).replace(/[.,]00$/, "")} ${sendedData.data.items[i].symbol}</p>
				</div>
				</li>`;
		}
		
		if(showBtnMore){
			targetElement.classList.remove("hidden");
		}

	})();
}


async function getElfTokenBalance(chainId, address){

	const aelf = new AElf(new AElf.providers.HttpProvider(localStorage.getItem('rpc')));
	let systemTokenContract;

	if(chainId == "aelf_main" || chainId == "aelf_test"){ 
		systemTokenContract = await aelf.chain.contractAt("JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE", walletAelf);
	} else{
		systemTokenContract = await aelf.chain.contractAt("7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX", walletAelf);
	}

	let balanceResult = await systemTokenContract.GetBalance.call({
    	symbol: "ELF",
    	owner: address,
  	});

	return balanceResult.balance / 10 ** 8;
}


async function getTokenBalance(chainId, address, sort_by, asc_desc) {
	const wallets = JSON.parse(localStorage.getItem('walletsStorage'));
	let tokensContracts = [];
	let tokensInfo = [];

	const aelf = new AElf(new AElf.providers.HttpProvider(localStorage.getItem('rpc')));
	let systemTokenContract;

	if(chainId == "aelf_main" || chainId == "aelf_test"){ 
		systemTokenContract = await aelf.chain.contractAt("JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE", walletAelf);
	} else{
		systemTokenContract = await aelf.chain.contractAt("7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX", walletAelf);
	}

	for(var i = 0; i < wallets.length; i++){
		if(wallets[i].address.toLowerCase() == address.toLowerCase()){
			tokensContracts = wallets[i]["tracked-tokens"][chainId];
			break;
		}
	}

	tokensContracts = tokensContracts.filter(token => token.tracked);

	const promisesTokenBalance = [];
	for(var i = 0; i < tokensContracts.length; i++){
			promisesTokenBalance.push(systemTokenContract.GetBalance.call({
		    	symbol: tokensContracts[i].symbol,
		    	owner: address,
		  	}));
	}

	const resultPromise = await Promise.all(promisesTokenBalance);

	tokensContracts.map((token, index)=>{
        tokensInfo.push({
			"symbol": token.symbol,
			"decimals": token.decimals,
			"name": token.name,
			"balance": resultPromise[index].balance / 10**token.decimals,
		})
    })


	var newObject = {};
	newObject.data = {};
	newObject.error = false;

	if(tokensInfo.length > 1){
		if( sort_by == "balance"){
			newObject.data.items = Object.values(tokensInfo).sort(function(a, b) { 
				return (a["balance"] - b["balance"])*(asc_desc)
			});
		} 
		else if( sort_by == "symbol"){
			if(asc_desc == 1){
				newObject.data.items = Object.values(tokensInfo).sort(function(a, b) { 
					return a["symbol"].localeCompare(b["symbol"]);
				});
			} else{
				newObject.data.items = Object.values(tokensInfo).sort(function(a, b) { 
					return b["symbol"].localeCompare(a["symbol"]);
				});
			}
		}
	}

	else{
		newObject.data.items = tokensInfo;
	}
	
	newObject.oneBalance = await getElfTokenBalance(chainId, address);
	returnedData = newObject;
	
  	return returnedData;
}

async function sortTokenBalance(result, sort_by, asc_desc){

	var newObject = {};
	newObject.data = {};
	newObject.oneBalance = result.oneBalance;
	newObject.error = false;

	if( sort_by == "balance"){
		newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
			return (a["balance"] - b["balance"])*(asc_desc)
		});
	} 
	else if( sort_by == "symbol"){
		if(asc_desc == 1){
			newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
				if(a["symbol"] && b["symbol"] ){
					return a["symbol"].trim().localeCompare(b["symbol"].trim());
				}
			});
		} else{
			newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
				return b["symbol"].trim().localeCompare(a["symbol"].trim());
			});
		}
	}

	returnedData = newObject;
	return returnedData;
}


function render(template_name, node, dataSended) {
		var listOfTokens = null;
		var refreshAndSort = null;
		var sortOption = null;
		var one_balance = null;
		var refreshBtn = null;

    if (!node) return;
    switch(template_name){
    	case "balance":

    		bottom_menu_items.forEach((item) => {
				item.classList.remove("active");
			})
			bottom_menu_items[0].classList.add("active");

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="one_balance">-</span> ELF</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");

	    	var tokenListNew = "";
			one_balance = document.getElementById("one_balance");


    		;(async () => {
				result = await getTokenBalance(chainId, address, "balance",  -1);
				
				if (result.error) {
				    tokenList = `<li class="error"><p class="title">Error #${result.error_code}:</p><p class="subtitle">${result.error_message}</p></li>`;
				    listOfTokens.innerHTML = tokenList;
					one_balance.innerHTML = `${result.oneBalance.toFixed(4).toLocaleString()}`;
				}
				else{
					tokenList = "";
					var balance = null;
					var realLogoUrl = null;

				  	if(result.data.items.length > 5){
						var maxToShow = 5;
						var showBtnMore = true;
					} else{
						var maxToShow = result.data.items.length;
						var showBtnMore = false;
					}

				  	for (var i = 0; i < maxToShow; i++){
						balance = (Math.round(result.data.items[i].balance * 100000) / 100000);
						realLogoUrl = `https://eu.ui-avatars.com/api/?name=${result.data.items[i].symbol[0]}`;

						tokenListNew += `<li class="token">
							<img src="${realLogoUrl}" >
							<div>
								<p class="title">${result.data.items[i].name}</p>
								<p class="subtitle">Balance: ${balance.toFixed(4).replace(/[.,]00$/, "")} ${result.data.items[i].symbol}</p>
							</div>
							</li>`;
					}

					refreshAndSort.innerHTML = ` 
					<div id="refresh">
			            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
			          </div>
			          <div id="sort_block">
			            <div id="sort">Sort by:</div>
			            <div id="sortby">
			              <ul>
			                <li class="sortOption" id="symbol__1">Token symbol [a-z]</li>
			                <li class="sortOption" id="symbol__-1">Token symbol [z-a]</li>
			                <li class="sortOption" id="balance__1">Token balance [asc]</li>
			                <li class="sortOption" id="balance__-1">Token balance [des]</li>
			              </ul>
			            </div>
			          </div>`;

					refreshBtn = document.getElementById("refresh");
					refreshBtn.addEventListener("click", ()=>{
						render("refresh", main_block, null);
					});

					refreshAndSort = document.getElementById("refreshAndSort");
			    	refreshAndSort.classList.remove("hidden");
			    	sortOption = document.querySelectorAll(".sortOption");
				
					sortOption.forEach((item) => {
						item.addEventListener("click", ()=>{
							;(async () => {
								var sortBy = (item.id).split("__")[0];
								var sortAscDesc = parseInt((item.id).split("__")[1]);

								var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);

								render("sortBalance", main_block, sortedArray);
							})()
							refreshAndSort.classList.add("hidden");
						})
					})

					if(result.data.items.length > 0){
						listOfTokens.innerHTML = `<div class="aelf20tokens">Tracked tokens:</div>${tokenListNew}`;
				    } else {
						listOfTokens.innerHTML = `<div class="aelf20tokens"><span class="info">No tracked tokens. <br>You can track tokens in Settings</span></div>`;
				    }

					one_balance.innerHTML = `${result.oneBalance.toFixed(4).toLocaleString()}`;

					if(showBtnMore){
	    				showMoreBlock = document.getElementById("showMoreBlock");
						showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
						showMoreBtn = document.getElementById("showMoreBtn");

						showMoreBtn.addEventListener("click", function(event){
				        	var targetElement = event.target || event.srcElement;
				        	loadMore(targetElement, result);
				      	});
					}
				}
				
			})()


	    	refreshAndSort = document.getElementById("refreshAndSort");
	    	refreshAndSort.classList.remove("hidden");
	    	sortOption = document.querySelectorAll(".sortOption");
		
			sortOption.forEach((item) => {
				item.addEventListener("click", ()=>{
					;(async () => {
						var sortBy = (item.id).split("__")[0];
						var sortAscDesc = parseInt((item.id).split("__")[1]);
						var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
						render("sortBalance", main_block, sortedArray);
					})()
					refreshAndSort.classList.add("hidden");
				})
			})

    		break;

    	case "refresh":
    		render("balance", main_block, null);
    		break;

    	case "sortBalance":

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="one_balance">-</span> ELF</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");
				one_balance = document.getElementById("one_balance");

				;(async () => {
					refreshAndSort.classList.add("hidden");
	    		refreshAndSort.innerHTML = ` 
						<div id="refresh">
	            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
	          </div>
	          <div id="sort_block">
	            <div id="sort">Sort by:</div>
	            <div id="sortby">
	              <ul>
	                <li class="sortOption" id="symbol__1">Token symbol [a-z]</li>
	                <li class="sortOption" id="symbol__-1">Token symbol [z-a]</li>
	                <li class="sortOption" id="balance__1">Token balance [asc]</li>
	                <li class="sortOption" id="balance__-1">Token balance [des]</li>
	              </ul>
	            </div>
	          </div>`;

					refreshBtn = document.getElementById("refresh");
					refreshBtn.addEventListener("click", ()=>{
						render("refresh", main_block, null);
					});

	    		if(dataSended.data.items.length > 5){
						var maxToShow = 5;
						var showBtnMore = true;
					} else{
						var maxToShow = dataSended.data.items.length;
						var showBtnMore = false;
					}

					tokenListNew = "";

					for (var i = 0; i < maxToShow; i++){
						balance = (Math.round(dataSended.data.items[i].balance  * 100000) / 100000);
						realLogoUrl = `https://eu.ui-avatars.com/api/?name=${dataSended.data.items[i].symbol[0]}`;

						tokenListNew += `<li class="token" >
							<img src="${realLogoUrl}" >
							<div>
								<p class="title">${dataSended.data.items[i].name}</p>
								<p class="subtitle">Balance: ${balance.toFixed(4).replace(/[.,]00$/, "")} ${dataSended.data.items[i].symbol}</p>

							</div>
							</li>`;
					}

					

					if(result.data.items.length > 0){
						listOfTokens.innerHTML = `<div class="aelf20tokens">Tracked tokens:</div>${tokenListNew}`;
				    } else {
						listOfTokens.innerHTML = `<div class="aelf20tokens"><span class="info">No tracked tokens. <br>You can track tokens in Settings</span></div>`;
				    }

					one_balance.innerHTML = `${parseFloat(dataSended.oneBalance).toFixed(4).toLocaleString()}`;

					if(showBtnMore){
		    		showMoreBlock = document.getElementById("showMoreBlock");
		    		showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
						showMoreBtn = document.getElementById("showMoreBtn");

						showMoreBtn.addEventListener("click", function(event){
			        		var targetElement = event.target || event.srcElement;
			        		loadMore(targetElement, dataSended);
			      		});
					}

					refreshAndSort.classList.remove("hidden");
					sortOption = document.querySelectorAll(".sortOption");
			
					sortOption.forEach((item) => {
						item.addEventListener("click", ()=>{
							;(async () => {
								var sortBy = (item.id).split("__")[0];
								var sortAscDesc = parseInt((item.id).split("__")[1]);
								var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
								render("sortBalance", main_block, sortedArray);
							})()
							refreshAndSort.classList.add("hidden");
						})
					})

				})();

    		break;

    	case "settings":

    		let showTrackTokens = "";
    		if(localStorage.getItem("currentWallet") && (localStorage.getItem("currentWallet") != "null") ){
    			showTrackTokens = `<li class="settingOption" data-id="tracked-tokens"> <p class="title">Tracked tokens</p> <p class="subtitle">List of tracked tokens</p> </li>`;
    		}

    		node.innerHTML = `
    			<h1 class="title">Settings</h1> 
    			<ul class="settings_options">
    				<li class="settingOption" data-id="addressBook"> <p class="title">Saved addresses</p> <p class="subtitle">View, edit or remove added addresses</p> </li> 
    				<li class="settingOption" data-id="network"> <p class="title">Change network</p> <p class="subtitle">Change your network settings</p> </li> 
    				${showTrackTokens}
    			</ul>
    			`;

    			const seetingOptions = document.querySelectorAll(".settingOption");

    			seetingOptions.forEach((item) => {
						item.addEventListener("click", ()=>{
							render(item.getAttribute("data-id"), main_block, null);
						})
					})

	    	break;

	    case "addressBook":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Saved addresses</h1>
    			<span id="addWalletBtn">Add new address</span>
    			<div id="addWalletForm" class="hidden">
    				<input id="walletName" type="text" maxlength="15" placeholder="Wallet name"><br>
    				<input id="walletAddress" type="text" placeholder="Wallet ID"><br>
    				<p id="addError"></p>
    				<div class="btns">
	    				<button id="cancelAdd">Cancel</button>
	    				<button id="confirmAdd">Add</button>
    				</div>
    			</div>
    			<ul id="divAddressBook"></ul>
    		`;

    		var back = document.getElementsByClassName("undo")[0];
    		back.addEventListener("click", ()=>{
					render("settings", main_block, null);
				})

				var arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
				var divAddressBook = document.getElementById("divAddressBook");

				divAddressBook.innerHTML = "";

				for(const wallet of arrayOfWallets){
					divAddressBook.innerHTML += ` 
	    		<li class="settingOption" data-id="${wallet.address}"> 
	    			<div class="row">
	    				<div class="left">
	    					<input type="text" class="input_title" value="${wallet.name}" maxlength="15" readonly data-id="${wallet.address}"> 
	    				</div>
	    				<div class="right">
		    				<span class="save hidden" data-id="${wallet.address}"><i class="fa fa-check" aria-hidden="true" ></i></span>
		    				<span class="edit" data-id="${wallet.address}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
		    				<span class="delete" data-id="${wallet.address}"><i class="fa fa-trash" aria-hidden="true"></i></span>
		    			</div>
	    			</div>
	    			<p class="subtitle">${wallet.address.substring(0, 15)}...${wallet.address.substring(34)}</p> 
	    		</li>
	    		`;
				}

				var addWalletBtn = document.getElementById("addWalletBtn");
				var addWalletForm = document.getElementById("addWalletForm");
				var cancelAdd = document.getElementById("cancelAdd");
				var confirmAdd = document.getElementById("confirmAdd");


				var walletName = document.getElementById("walletName");
				var walletAddress = document.getElementById("walletAddress");
				var addError = document.getElementById("addError");


				addWalletBtn.addEventListener("click", ()=>{
					addWalletForm.classList.toggle("hidden");
					walletName.value = "";
					walletAddress.value = "";
					addError.innerHTML = "";
					walletName.classList.remove("error");
					walletAddress.classList.remove("error");
				})

				cancelAdd.addEventListener("click", ()=>{
					addWalletForm.classList.toggle("hidden");
					walletName.value = "";
					walletAddress.value = "";
					addError.innerHTML = "";
					walletName.classList.remove("error");
					walletAddress.classList.remove("error");

					deleteBtns = document.querySelectorAll(".delete");
					editBtns = document.querySelectorAll(".edit"); 
	    			saveBtns = document.querySelectorAll(".save"); 

	    			editBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

							item.classList.add("hidden");
						})
					})

					saveBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
							if(walletInp.value){
								document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
								walletInp.setAttribute("value", walletInp.value);
								walletInp.readOnly = true;
								walletInp.classList.remove("active");

								var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
								arrayOfWallets[objIndex].name = walletInp.value;
								localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

								item.classList.add("hidden");

								var currentW = localStorage.getItem("currentWallet");
								if(item.getAttribute("data-id") == currentW){
									wallet_address.innerHTML = `<span>${walletInp.value}</span><br>${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
								}

							} else{
								walletInp.focus();
							}
						})
					})

					deleteBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
							document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });							

							arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
							localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));
							
							var currentW = localStorage.getItem("currentWallet");
							if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
								localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

								var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
								var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
								var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
								wallet_address.classList.add("exist");
								wallet_address.innerHTML = `<span>${nameWal}</span><br>${addWal.substring(0, 9)}...${addWal.substring(40)}`;
							
								if(wallet_address.classList.contains("exist")){
									wallet_address.addEventListener("click", ()=>{
										navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
									})
								}

							}

							if(!arrayOfWallets.length){
								localStorage.setItem("currentWallet", null);

								wallet_address.classList.remove("exist");
								wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

								addNewWallet = document.getElementById("addNewWallet");
								addNewWallet.addEventListener("click", ()=>{
									render("addressBook", main_block, null);
									bottom_menu_items.forEach((item) => {
										item.classList.remove("active");
									})
									bottom_menu_items[3].classList.add("active");
								})
							}

							tokenList = "";
							address = localStorage.getItem('currentWallet');

							arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
							deleteBtns = document.querySelectorAll(".delete"); 
						})

					})
				})


				confirmAdd.addEventListener("click", ()=>{

					walletName = document.getElementById("walletName");
					walletAddress = document.getElementById("walletAddress");

					var checkExist = arrayOfWallets.findIndex((obj => obj.address == walletAddress.value));

					let invalidChecksum = false;
					const {base58} = AElf.utils;
					try{
						base58.decode(walletAddress.value.trim()); 
					} catch(error){
						console.log("ERROR !", error.message);
						invalidChecksum = true;
					}


					if(!walletName.value){
						walletName.focus();
						addError.innerHTML = "Write a name of wallet";
						walletName.classList.add("error");
					} else if(!walletAddress.value.trim() || invalidChecksum){
						walletName.classList.remove("error");
						addError.innerHTML = "Please enter correct wallet ID";
						walletAddress.focus();
						walletAddress.classList.add("error");
					} else if(checkExist >= 0){
						addError.innerHTML = "Wallet already exist in list !";
						walletAddress.focus();
						walletAddress.classList.add("error");
					} else{
						walletName.classList.remove("error");
						walletAddress.classList.remove("error");
						addError.innerHTML = "";

						arrayOfWallets.push({
							"name": walletName.value, 
							"address":walletAddress.value, 
							"tracked-tokens" : {
								"aelf_main":[
									{"symbol":"WRITE","decimals":8,"name":"WRITE Token","tracked":false},
									{"symbol":"VOTE","decimals":8,"name":"VOTE Token","tracked":false},
									{"symbol":"SHARE","decimals":8,"name":"SHARE Token","tracked":false},
									{"symbol":"STORAGE","decimals":8,"name":"STORAGE Token","tracked":false},
									{"symbol":"TRAFFIC","decimals":8,"name":"TRAFFIC Token","tracked":false},
									{"symbol":"READ","decimals":8,"name":"READ Token","tracked":false},
									{"symbol":"RAM","decimals":8,"name":"RAM Token","tracked":false},
									{"symbol":"NET","decimals":8,"name":"NET Token","tracked":false},
									{"symbol":"PORT","decimals":8,"name":"Port All Project Token","tracked":false},
									{"symbol":"CPU","decimals":8,"name":"CPU Token","tracked":false},
									{"symbol":"DISK","decimals":8,"name":"DISK Token","tracked":false},
									{"symbol":"LOT","decimals":8,"name":"aelf Lottery Token","tracked":false},
								], 
								"aelf_test":[
									{"symbol":"WRITE","decimals":8,"name":"WRITE Token","tracked":false},
									{"symbol":"VOTE","decimals":8,"name":"VOTE Token","tracked":false},
									{"symbol":"SHARE","decimals":8,"name":"SHARE Token","tracked":false},
									{"symbol":"STORAGE","decimals":8,"name":"STORAGE Token","tracked":false},
									{"symbol":"TRAFFIC","decimals":8,"name":"TRAFFIC Token","tracked":false},
									{"symbol":"READ","decimals":8,"name":"READ Token","tracked":false},
									{"symbol":"RAM","decimals":8,"name":"RAM Token","tracked":false},
									{"symbol":"NET","decimals":8,"name":"NET Token","tracked":false},
									{"symbol":"PORT","decimals":8,"name":"Port All Project Token","tracked":false},
									{"symbol":"CPU","decimals":8,"name":"CPU Token","tracked":false},
									{"symbol":"DISK","decimals":8,"name":"DISK Token","tracked":false},
									{"symbol":"LOT","decimals":8,"name":"aelf Lottery Token","tracked":false},
									{"symbol":"LOTTEST","decimals":8,"name":"aelf Lottery test Token","tracked":false},
									{"symbol":"AEUSD","decimals":8,"name":"AEUSD","tracked":false},
									{"symbol":"SIDETOKEN","decimals":8,"name":"elf token SIDETOKEN","tracked":false},
									{"symbol":"TESTTOKEN","decimals":8,"name":"elf token TESTTOKEN","tracked":false},

									{"symbol":"USDTE","decimals":6,"name":"USDTE","tracked":false},
									{"symbol":"BTETE","decimals":8,"name":"BTETE","tracked":false},
									{"symbol":"ETHTE","decimals":8,"name":"ETHTE","tracked":false},
									{"symbol":"UNITE","decimals":8,"name":"UNITE","tracked":false},
									{"symbol":"BNBTE","decimals":8,"name":"BNBTE","tracked":false},
									{"symbol":"AWKN","decimals":8,"name":"AWKN","tracked":false},
									{"symbol":"TIGER","decimals":8,"name":"TIGER PROTOCOL","tracked":false},
									{"symbol":"AWAW","decimals":8,"name":"AwAwToken","tracked":false},
									{"symbol":"SARU","decimals":8,"name":"SARU","tracked":false},
									{"symbol":"OSM","decimals":8,"name":"OSIM","tracked":false},
									{"symbol":"TEUSD","decimals":8,"name":"TEUSD","tracked":false},
									{"symbol":"TEBTC","decimals":8,"name":"TEBTC","tracked":false},
									{"symbol":"BTC","decimals":8,"name":"Bitcoin","tracked":false},
									{"symbol":"ETH","decimals":8,"name":"Ethereum","tracked":false},
									{"symbol":"USDT","decimals":6,"name":"Tether USD","tracked":false},
									{"symbol":"USDC","decimals":6,"name":"USD Coin","tracked":false},
									{"symbol":"LATCH","decimals":8,"name":"LATCH","tracked":false},
									{"symbol":"LUNAINU","decimals":8,"name":"LUNA INU TOKEN","tracked":false},
									{"symbol":"DOGEINUU","decimals":8,"name":"DOGEINUU","tracked":false},
									{"symbol":"DOGINU","decimals":8,"name":"DOG INU","tracked":false},
									{"symbol":"CATINU","decimals":8,"name":"CAT INU","tracked":false},
									{"symbol":"CITI","decimals":8,"name":"CITI Garden","tracked":false},
									{"symbol":"BOOM","decimals":8,"name":"BOOM","tracked":false},

								], 
								"tdvv_main":[
									{"symbol":"WRITE","decimals":8,"name":"WRITE Token","tracked":false},
									{"symbol":"STORAGE","decimals":8,"name":"STORAGE Token","tracked":false},
									{"symbol":"TRAFFIC","decimals":8,"name":"TRAFFIC Token","tracked":false},
									{"symbol":"READ","decimals":8,"name":"READ Token","tracked":false},
									{"symbol":"RAM","decimals":8,"name":"RAM Token","tracked":false},
									{"symbol":"NET","decimals":8,"name":"NET Token","tracked":false},
									{"symbol":"CPU","decimals":8,"name":"CPU Token","tracked":false},
									{"symbol":"DISK","decimals":8,"name":"DISK Token","tracked":false},
									{"symbol":"LOT","decimals":8,"name":"aelf Lottery Token","tracked":false},
								], 
								"tdvv_test":[
									{"symbol":"WRITE","decimals":8,"name":"WRITE Token","tracked":false},
									{"symbol":"STORAGE","decimals":8,"name":"STORAGE Token","tracked":false},
									{"symbol":"TRAFFIC","decimals":8,"name":"TRAFFIC Token","tracked":false},
									{"symbol":"READ","decimals":8,"name":"READ Token","tracked":false},
									{"symbol":"RAM","decimals":8,"name":"RAM Token","tracked":false},
									{"symbol":"NET","decimals":8,"name":"NET Token","tracked":false},
									{"symbol":"PORT","decimals":8,"name":"Port All Project Token","tracked":false},
									{"symbol":"CPU","decimals":8,"name":"CPU Token","tracked":false},
									{"symbol":"DISK","decimals":8,"name":"DISK Token","tracked":false},
									{"symbol":"LOT","decimals":8,"name":"aelf Lottery Token","tracked":false},
									{"symbol":"SIDETOKEN","decimals":8,"name":"elf token SIDETOKEN","tracked":false},
									{"symbol":"AEUSD","decimals":8,"name":"AEUSD","tracked":false},
									{"symbol":"LOTTEST","decimals":8,"name":"aelf Lottery test Token","tracked":false},

									{"symbol":"USDTE","decimals":6,"name":"USDTE","tracked":false},
									{"symbol":"BTETE","decimals":8,"name":"BTETE","tracked":false},
									{"symbol":"ETHTE","decimals":8,"name":"ETHTE","tracked":false},
									{"symbol":"UNITE","decimals":8,"name":"UNITE","tracked":false},
									{"symbol":"BNBTE","decimals":8,"name":"BNBTE","tracked":false},
									{"symbol":"AWKN","decimals":8,"name":"AWKN","tracked":false},
									{"symbol":"TIGER","decimals":8,"name":"TIGER PROTOCOL","tracked":false},
									{"symbol":"AWAW","decimals":8,"name":"AwAwToken","tracked":false},
									{"symbol":"SARU","decimals":8,"name":"SARU","tracked":false},
									{"symbol":"OSM","decimals":8,"name":"OSIM","tracked":false},
									{"symbol":"TEUSD","decimals":8,"name":"TEUSD","tracked":false},
									{"symbol":"TEBTC","decimals":8,"name":"TEBTC","tracked":false},
									{"symbol":"BTC","decimals":8,"name":"Bitcoin","tracked":false},
									{"symbol":"ETH","decimals":8,"name":"Ethereum","tracked":false},
									{"symbol":"USDT","decimals":6,"name":"Tether USD","tracked":false},
									{"symbol":"USDC","decimals":6,"name":"USD Coin","tracked":false},
									{"symbol":"LATCH","decimals":8,"name":"LATCH","tracked":false},
									{"symbol":"LUNAINU","decimals":8,"name":"LUNA INU TOKEN","tracked":false},
									{"symbol":"DOGEINUU","decimals":8,"name":"DOGEINUU","tracked":false},
									{"symbol":"DOGINU","decimals":8,"name":"DOG INU","tracked":false},
									{"symbol":"CATINU","decimals":8,"name":"CAT INU","tracked":false},
									{"symbol":"CITI","decimals":8,"name":"CITI Garden","tracked":false},
									{"symbol":"BOOM","decimals":8,"name":"BOOM","tracked":false},

								]
							} 
						});
						
						localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

						if(arrayOfWallets.length == 1){
							localStorage.setItem("currentWallet", arrayOfWallets[0].address);

							var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
							var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
							var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
							wallet_address.classList.add("exist");
							wallet_address.innerHTML = `<span>${nameWal}</span><br>${addWal.substring(0, 9)}...${addWal.substring(40)}`;
							
							if(wallet_address.classList.contains("exist")){
								wallet_address.addEventListener("click", ()=>{
									navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
								})
							}
						}

						divAddressBook.innerHTML += ` 
		    		<li class="settingOption" data-id="${walletAddress.value}"> 
		    			<div class="row">
		    				<div class="left">
		    					<input type="text" class="input_title" value="${walletName.value}" onfocus="this.value = this.value;" readonly data-id="${walletAddress.value}"> 
		    				</div>
		    				<div class="right">
			    				<span class="save hidden" data-id="${walletAddress.value}"><i class="fa fa-check" aria-hidden="true" ></i></span>
			    				<span class="edit" data-id="${walletAddress.value}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
			    				<span class="delete" data-id="${walletAddress.value}"><i class="fa fa-trash" aria-hidden="true"></i></span>
			    			</div>
		    			</div>
		    			<p class="subtitle">${walletAddress.value.substring(0, 15)}...${walletAddress.value.substring(34)}</p> 
		    		</li>
		    		`;

						addWalletForm.classList.toggle("hidden");

						deleteBtns = document.querySelectorAll(".delete"); 
						editBtns = document.querySelectorAll(".edit"); 
		    		saveBtns = document.querySelectorAll(".save"); 

		    		editBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

								item.classList.add("hidden");
							})
						})

						saveBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
								if(walletInp.value){
									document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
									walletInp.setAttribute("value", walletInp.value);
									walletInp.readOnly = true;
									walletInp.classList.remove("active");

									var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
									arrayOfWallets[objIndex].name = walletInp.value;
									localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

									item.classList.add("hidden");

									var currentW = localStorage.getItem("currentWallet");
									if(item.getAttribute("data-id") == currentW){
										wallet_address.innerHTML = `<span>${walletInp.value}</span><br>${item.getAttribute("data-id").substring(0, 9)}...${item.getAttribute("data-id").substring(40)}`;
									}

								} else{
									walletInp.focus();
								}
							})
						})

						deleteBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
								document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });

								arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
								localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));
								
								var currentW = localStorage.getItem("currentWallet");
								if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
									localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

									var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
									var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
									var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
									wallet_address.classList.add("exist");
									wallet_address.innerHTML = `<span>${nameWal}</span><br>${addWal.substring(0, 9)}...${addWal.substring(40)}`;
								
									if(wallet_address.classList.contains("exist")){
										wallet_address.addEventListener("click", ()=>{
											navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
										})
									}

								}

								if(!arrayOfWallets.length){
									localStorage.setItem("currentWallet", null);

									wallet_address.classList.remove("exist");
									wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

									addNewWallet = document.getElementById("addNewWallet");
									addNewWallet.addEventListener("click", ()=>{
										render("addressBook", main_block, null);
										bottom_menu_items.forEach((item) => {
											item.classList.remove("active");
										})
										bottom_menu_items[3].classList.add("active");
									})
								}

								tokenList = "";
								address = localStorage.getItem('currentWallet');

								arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
								deleteBtns = document.querySelectorAll(".delete"); 
							})

						})

					tokenList = "";
					address = localStorage.getItem('currentWallet');


					}
				})

				
    		

    		var walletsNames = document.querySelectorAll(".input_title");

    		var editBtns = document.querySelectorAll(".edit");
    		var deleteBtns = document.querySelectorAll(".delete");
    		var saveBtns = document.querySelectorAll(".save");

    		editBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

						item.classList.add("hidden");
					})
				})

				saveBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
						if(walletInp.value){
							document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
							walletInp.setAttribute("value", walletInp.value);
							walletInp.readOnly = true;
							walletInp.classList.remove("active");

							var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
							arrayOfWallets[objIndex].name = walletInp.value;
							localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

							item.classList.add("hidden");

							var currentW = localStorage.getItem("currentWallet");
							if(item.getAttribute("data-id") == currentW){
								wallet_address.innerHTML = `<span>${walletInp.value}</span><br>${item.getAttribute("data-id").substring(0, 9)}...${item.getAttribute("data-id").substring(40)}`;
							}

						} else{
							walletInp.focus();
						}
					})
				})

				deleteBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
						document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });

						arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
						localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

						var currentW = localStorage.getItem("currentWallet");
						if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
							localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);
							
							var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
							var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
							var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
							wallet_address.classList.add("exist");
							wallet_address.innerHTML = `<span>${nameWal}</span><br>${addWal.substring(0, 9)}...${addWal.substring(40)}`;
								
						}

						if(!arrayOfWallets.length){
							localStorage.setItem("currentWallet", null);

							wallet_address.classList.remove("exist");
							wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

							addNewWallet = document.getElementById("addNewWallet");
							addNewWallet.addEventListener("click", ()=>{
								render("addressBook", main_block, null);
								bottom_menu_items.forEach((item) => {
									item.classList.remove("active");
								})
								bottom_menu_items[3].classList.add("active");
							})
						}

						tokenList = "";
						address = localStorage.getItem('currentWallet');

						arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
						deleteBtns = document.querySelectorAll(".delete"); 

					})
				})


	    	break;

    	case "network":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Change network</h1>
    			<ul id="networks"></ul>
    			`;
    		var back = document.getElementsByClassName("undo")[0];
    		back.addEventListener("click", ()=>{
					render("settings", main_block, null);
				})

    		var divNetworks = document.getElementById("networks");
    		divNetworks.innerHTML = "";

    		for(const chain of chains){
    			var active = "";
    			if(chain.id == localStorage.getItem('chainID')){
    				active = "active";
    			}
    			divNetworks.innerHTML += ` 
	    			<li class="network ${active}" data-rpc="${chain.rpc}" data-id="${chain.id}" data-type="${chain.type}">${chain.title}</li>
	    		`;
    		}
    		

    		var allNetworks = document.querySelectorAll(".network");
    		allNetworks.forEach((item) => {
					item.addEventListener("click", ()=>{

						localStorage.setItem('chainID', item.getAttribute("data-id"));
						localStorage.setItem('chainType', item.getAttribute("data-type"));
						localStorage.setItem('rpc', item.getAttribute("data-rpc"));

						networkIndicator.className = "";
						networkIndicator.classList.add(`chain_${item.getAttribute("data-id")}`);
						networkIndicator.classList.add(item.getAttribute("data-type"));

					
						allNetworks.forEach((item) => {
							item.classList.remove("active");
						})
						item.classList.add("active");

						tokenList = "";
						chainId = localStorage.getItem('chainID');
						rpc = localStorage.getItem('rpc');

					})
				})

	    	break;


	    case "tracked-tokens":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Tracked tokens</h1>
    			<ul id="trackedTokens"></ul>
			`;
    		var back = document.getElementsByClassName("undo")[0];

    		back.addEventListener("click", ()=>{
				render("settings", main_block, null);
			})

    		var divTrackedTokens = document.getElementById("trackedTokens");
    		divTrackedTokens.innerHTML = "";


			const wallets = JSON.parse(localStorage.getItem('walletsStorage'));
			let tokensContracts = [];

			for(var i = 0; i < wallets.length; i++){
				if(wallets[i].address.toLowerCase() == address.toLowerCase()){
					tokensContracts = wallets[i]["tracked-tokens"][chainId];
					break;
				}
			}

			for(var i = 0; i < tokensContracts.length; i++){
				let active = "";
				let checked = "";
    			if(tokensContracts[i].tracked){
    				active = "tracked";
    				checked = "checked";
    			}
				divTrackedTokens.innerHTML += ` 
	    			<li class="trackedToken ${active}" data-symbol="${tokensContracts[i].symbol}">
	    				<span>${tokensContracts[i].symbol}</span>
	    				<input class="track" type="checkbox" ${checked} data-symbol="${tokensContracts[i].symbol}">
	    			</li>
	    		`;
			}	

			var allTrackButtons = document.querySelectorAll(".track");
    		allTrackButtons.forEach((item) => {
				item.addEventListener("click", ()=>{

					let walletsStorage = JSON.parse(localStorage.getItem('walletsStorage'));

					for(var i = 0; i < walletsStorage.length; i++){
						if(walletsStorage[i].address.toLowerCase() == address.toLowerCase()){
							walletsStorage[i]["tracked-tokens"][chainId];
							let tokenIndex = 0;

							for(var j = 0; j < walletsStorage[i]["tracked-tokens"][chainId].length; j++){
								if(walletsStorage[i]["tracked-tokens"][chainId][j].symbol == item.getAttribute("data-symbol")){
									tokenIndex = j;
									break;
								}
							}

							if(item.checked) {
								walletsStorage[i]["tracked-tokens"][chainId][tokenIndex].tracked = true;
							} else{
								walletsStorage[i]["tracked-tokens"][chainId][tokenIndex].tracked = false;
							}

							localStorage.setItem('walletsStorage', JSON.stringify(walletsStorage));
							break;
						}
					}
				})
			})

    	

	    	break;

    	case "noWallet":
    		node.innerHTML = `
    			<h1 class="title">${dataSended}</h1>
    			<div class="noWallet">
    				Your address book is empty.<br>
    				<a id="linkAddWallet">Click here to add new wallet</a>
    				</div>
    			`;

    		document.getElementById("linkAddWallet").addEventListener("click", ()=>{
    			render("addressBook", main_block, null);
    			bottom_menu_items.forEach((item) => {
						item.classList.remove("active");
					})
					bottom_menu_items[3].classList.add("active");
    		});

	    	break;

    	default:
    		node.innerHTML = templates[template_name];
    }
};