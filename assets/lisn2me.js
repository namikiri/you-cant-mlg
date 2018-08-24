// Sound constants to use later
var SND_WIN			= 0,
	SND_FAIL		= 1,
	SND_PRESS		= 2;
	
var soundFiles = [
					"assets/snd/win.mp3",
                    "assets/snd/fail.mp3",
					"assets/snd/press.mp3"
				 ];
				 
				 
// Minimal Radio Volume
var RADIO_MIN_VOL = 30,

// Maximal Radio Volume
	RADIO_MAX_VOL = 100,

// Attenuation speed. 1 unit per RADIO_ATT_DEL ms.
	RADIO_ATT_DEL = 10; // ms

				 
var soundObjects = [];
var radioPlayer = null;

var seReady = false;

var nowAttenuating = false;

/*
	Sound Initializing.
	Preloads all sounds to prevent the game from lags,
	prepares all the system to work. 
	Run this when you're initializing your game.
*/
function soundInit()
{
	soundManager.setup({
			url: '//api.nyan.pw/smswf/',
			// We'll try to use HTML5 instead of Flash
			preferFlash: false,
			ontimeout: function ()
		{
			alert("FUCK, cant start audio system");
		},

		onready: function()
		{
			for (i = 0; i < soundFiles.length; i++)
			{
				soundObjects[i] = soundManager.createSound(
				{
					id : "snd"+i,
					allowScriptAccess: 'always',
					url : soundFiles[i],
				});
				
				soundObjects[i].load();
			}
			seReady = true;
		}
	});
}

/*
	Main function to play a sound
	Use constants above to play different game sounds,
	for example, to sound a collision of Nyan with Huesos,
	use this: playSound(SND_HUESOS);
*/
function playSound (soundID)
{
	if (seReady)
		soundObjects[soundID].play();
}

function stopSound (soundID)
{
	if (seReady)
		soundObjects[soundID].stop();
}


/*
	Use this function to start radio stream.
*/
function radioPlay()
{	
	if (seReady)
	{
		if (!radioPlayer)
			{
				radioPlayer = soundManager.createSound(
				{
					id: 'radio',
					allowScriptAccess: 'always',
					volume: 100,
					url: 'assets/snd/cmax.mp3'
				});
			}
		radioPlayer.play({onfinish : radioPlay});
	}
}

/*
	Use this to shut down the radio
*/
function radioStop()
{
	if (seReady)
	{
		radioPlayer.stop();
		// radioPlayer.destruct();
		// radioPlayer = null;
	}
}

function radioAttenuate(toMinLevel)
{
	if (!seReady || radioPlayer == null)
		return;

	nowAttenuating = true;

	var volChg = (toMinLevel) ? -1 : 1,
	volResult = radioPlayer.volume + volChg;
		
	if (!(volResult > RADIO_MAX_VOL || volResult < RADIO_MIN_VOL))
	{
		radioPlayer.setVolume(volResult);
		setTimeout(function(){radioAttenuate(toMinLevel)}, RADIO_ATT_DEL);
	}
	else
	{
		nowAttenuating = false;
	}	
}

