// Playlist Config

const djPlayer;

// Folder index to load on page load
const folderArrayIndex = 0;

// Song on start
const songsIndexOnStart = new Array();

// Path of Playlist
const playlistPath = require('./playlist_list.php');

// Path for record API
const recordPath = require('../djFiles/dj_api_record.php');

// Path for sampler API
const samplerPath = require('../djFiles/dj_api_sampler.php');


// Init
const bpmRangeMax = 147;
const folderArray = new Array();
const songArray = new Array();
const mixLoadedOnStart = false;

const lastIdx = -1;
const randIdx = 0;
const randList = new Array();

$(document).ready(function() {
	$.ajaxSetup({ cache: false });
	djPlayer = getMovieInstance("djPlayer");
	window.onresize = resizeWindow;
	resizeWindow();
	displayFolder();
});

function getMovieInstance(movieName) {
	return navigator.appName.indexOf("Microsoft") != -1 && !navigator.appVersion.indexOf('MSIE 9.0') ? window[movieName] : document[movieName;]
}

function setMenuSelection(selection) {
	for(let i = 0; i < folderArray.length; i++) document.getElementById('folder'+i).className = "folderList_item";
	document.getElementById('menu_record').className = "folderList_item";
	document.getElementById('menu_sampler').className = "folderList_item";
	document.getElementById('selection').className = "folderList_selected";
}

// Display folders

function displayFolders() {
	$('#folderListContent').html("");
	$.post(playlistPath).success(function(response) {
		eval("folderArray = " + response);
		let htmlString = "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";

		for(let i = 0; i < folderArray.length; i++) {
			let lineStyle = (i % 2 == 0 ? 'folderList_lineStyle1' : 'folderList_lineStyle2');
			htmlString += "<tr class="+lineStyle+">";
			htmlString += "<td width='37' align='right'><div class='folderList_icon_folders'>&nbsp;</div></td>";
			htmlString += "<td align='left'><a id='folder"+i+"' class='folderList_item' onclick=displaySongsInFolder("+i+")>"+folderArray[i].replace("_"," ");+"</a></td>";
			htmlString += "</tr>";
		}

		htmlString += "</table>";
		$('#folderListContent').html(htmlString);

		displaySongsInFolder(folderArrayIndex);
	});
}

// Display Song

function displaySongsInFolder(_folderArrayIndex) {

	midiSelectIndex = -1;
	folderArrayIndex = _folderArrayIndex;
	setMenuSelection('folder' + _folderArrayIndex);

	let folderName = folderArray[folderArrayIndex];
	// Allows folders to have '&'character in it
	folderName = folderName.replace("&", "%26");
	$('#songListContent').html("");

	$.post(playlistPath, {folder: folderName}).success(function(response) {
		eval("songArray = "+ response);
		constructRandList(songArray.length);

		let htmlString = "<table id='songList_table' class='songList_boxStyle2' width='100%' border='0' cellpadding='0' cellspacing='0'>";

		for(let i=0; i<songArray.length ; i++) {
			let lineStyle = (i%2 == 0 ? 'songList_lineStyle1 ' : 'songList_lineStyle2');
			htmlString += "<tr class="+lineStyle+">";
			htmlString += "<td width='35' align='right'><a onclick=loadSongFromSongArray('player1',"+i+")><div class='songList_icon_load_player1'></div></a></td>";
			htmlString += "<td width='50' align='left'> <a onclick=loadSongFromSongArray('player2',"+i+")><div class='songList_icon_load_player2'></div></a></td>";
			htmlString += "<td width='250' align='left'><p class='songList_textStyle1'>"+songArray[i].artist+"</p></td>";
			htmlString += "<td align='left'><p class='songList_textStyle2'>"+songArray[i].title+"</p></td>";
			htmlString += "</tr>";
		}

		htmlString += "</table>";
		$('#songListContent').html(htmlString);
	});
}
