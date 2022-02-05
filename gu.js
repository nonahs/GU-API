let currentTab = "";

function showTabNews() {
        if (currentTab != "TabNews") {
        currentTab = "TabNews";
        getNews();
        }
    }

function getNews() {
	const uri = "https://api.x.immutable.com/v1/orders";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    //xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        showNews(resp, 0);
    }
    xhr.send(null);
}

function showNews(news, homepage) { //homepage is true if getting news for home else just the news page
    let tableContent = "<tr class='orderTitle'><td>ID</td><td>Status</td><td>Name</td><td>ETH</td><td>USD</td><td>Image</td><td>Posted</td><td>Refreshed at " + new Date() + "</td></tr>\n";
    //let odd = true;
    const addRecord = (record) => {
        //const title = "<a href=" + record.order_id + ">" + record.status + "</a>";
		
		let name = '';
		let image = '';
		let pricedata;
		//if (record.status != 'active') return;
		if (record.sell.type == "ERC721") {
			if (record.sell.data.properties.collection.name != "Gods Unchained") return;
			name = record.sell.data.properties.name;
			image = record.sell.data.properties.image_url;
			pricedata = record.buy.data.quantity;
		} else if (record.buy.type == 'ERC721') {		//SOLD LISTINGS
			if (record.buy.data.properties.collection.name != "Gods Unchained") return;
			if (!sold.checked) return;
			name = record.buy.data.properties.name;
			image = record.buy.data.properties.image_url;
			//pricedata = record.amount_sold;
			pricedata = record.sell.data.quantity;
		}
		const id = record.order_id;
		let status = record.status;
		if (status == 'filled' || status == 'cancelled') {
			tableContent += "<tr class='orderOdd'>";
		}
		//const name = record.sell.data.properties.name;
		//const pricedata = record.buy.data.quantity;
		//var price = setPrice(pricedata);
		const price = pricedata / 1000000000000000000;
		var priceunit = getUnits(record)
		if (!ether.checked) {
			if (priceunit == " ETH") return;
		}
		//const dollars = price * 2000;
		//const usd = (price * 2000).toFixed(2);
		const usd = 0;
		//price = (price * 1).toString();
		const posted = record.timestamp;
		//const image = record.sell.data.properties.image_url;
        //tableContent += odd ? "<tr class='orderOdd'>" : "<tr class='orderEven'>";
        //odd = !odd;
        tableContent += "<td>" + id + "</td><td>" + status + "</td><td>" + name + "</td><td>" + price + priceunit + "</td><td><b>" + usd + "</b></td><td><img src=" + image + " alt='card image' style='width:50%'></td><td>" + posted + "</td></tr>\n";
        //newsContent += "<div class='headline'>" + title + "</div><br>"; //<div class ='date'>" + date + "</div><div class='article'>" + desc +"</div><br>";
    }
    if (homepage) {
        news.result.forEach(addRecord);
        document.getElementById("SectionHomedata").innerHTML = tableContent;
    } else {
        news.result.forEach(addRecord);
        document.getElementById("SectionNewsdata").innerHTML = tableContent;
    }
}

function getUnits(record) {
	if (record.buy.data.token_address == "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff") return " IMX";
	else if (record.buy.data.token_address == "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97") return " GODS";
	else return " ETH";

}

function setPrice(pricedata) {
	//	buy type is null for eth price erc20 for gods/imx
	//	buy token address null for eth
	//	0xccc8cb5229b0ac8069c51fd58367fd1e622afd97 for Gods
	//	0xf57e7e7c23978c3caec3c3548e3d615c346e79ff for IMX
	//let pricefloat = parseFloat(pricedata);
	let price = 0;
	let finalprice = '0';
	if (pricedata.length > 18) {
		price = pricedata / 1000000000000000000;
		finalprice = price;
	} else {
		price = pricedata.toString().padStart(18, '0');
		finalprice = "0." + price;
	}
	//let finalprice = "0." + price;
	return finalprice;
	
}

function toggleSold() {
	classList.remove("orderOdd");
}

function refreshTime() {
	console.log("checking");
	if (refresh60.checked) getNews();
}

//Refresh every 60 seconds if box is checked requery API
//setInterval("getNews()", 60000);
setInterval("refreshTime()", 60000);