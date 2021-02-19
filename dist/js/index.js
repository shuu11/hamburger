//----------------------------------------------------------------------
//  mode
//----------------------------------------------------------------------
"use strict";

//----------------------------------------------------------------------
//  変数宣言
//----------------------------------------------------------------------

//----------------------------------------------------------------------
//  main
//----------------------------------------------------------------------
{
}

//----------------------------------------------------------------------
//  イベントハンドラ
//----------------------------------------------------------------------
document.getElementById("js-header__btn").addEventListener("click", function () {
	sibebarEvent("add");
});

document.getElementById("js-sidebar").addEventListener("click", function () {
	sibebarEvent("rm");
});

document.getElementById("js-mask").addEventListener("click", function () {
	sibebarEvent("rm");
});

window.addEventListener("resize", function () {
	sibebarEvent("rm");
});

//----------------------------------------------------------------------
//  関数
//----------------------------------------------------------------------
function hoge(str) {
	console.log(str);
}

function sibebarEvent(str) {
	if (str === "add") {
		document.getElementById("js-sidebar").classList.add("open");
		document.getElementById("js-mask").classList.add("open");
		document.querySelector("body").classList.add("open");
	} else if (str === "rm") {
		document.getElementById("js-sidebar").classList.remove("open");
		document.getElementById("js-mask").classList.remove("open");
		document.querySelector("body").classList.remove("open");
	}
}

/************************************************************************/
/*  END OF FILE                                       									*/
/************************************************************************/
