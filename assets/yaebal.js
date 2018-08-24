var MLG_RES = [
	"assets/gfx/1v1.png",
	"assets/gfx/brazzers.png",
	"assets/gfx/doritos_logo.png",
	"assets/gfx/doritos_nachos_1.gif",
	"assets/gfx/doritos_nachos_2.gif",
	"assets/gfx/faze.png",
	"assets/gfx/fedora.png",
	"assets/gfx/fiteme.png",
	"assets/gfx/glasses.png",
	"assets/gfx/illuminati.png",
	"assets/gfx/joint.png",
	"assets/gfx/mdew.png",
	"assets/gfx/mlgpro.png",
	"assets/gfx/partyhat.png",
	"assets/gfx/putin.png",
	"assets/gfx/rekt.png",
	"assets/gfx/sampletext.png",
	"assets/gfx/sanic.png",
	"assets/gfx/shrek.png",
	"assets/gfx/skip.png",
	"assets/gfx/spoody.gif",
	"assets/gfx/weed.png",
	"assets/gfx/worldstarhiphop.png"
],


	MLG_RES_LEN = MLG_RES.length,
	MAX_VELOCITY = 100,
	BG_COLOR_FREQ = 0.1,
	BG_COLOR_ITERATIONS = 255,

	currentColorPos = 0,
	madnessIntensifies,

	stage = null,
	renderer = null,
	sprites = [];


function pixi_init()
{
	renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
	document.getElementById('bgcanvas').appendChild(renderer.view);

	// 
	renderer.backgroundColor = 0x020202;
	stage = new PIXI.Container();

	PIXI.loader.add(MLG_RES).on("progress", loadProgressHandler).load(load_finished);

	renderer.render(stage);
}


function loadProgressHandler(loader, resource)
{
	$('#resource-name').html(resource.url); 
	setGauge(100, Math.round(loader.progress), 'loading'); 
}

function load_finished()
{

	$('#resource-name').html('Buffering'); 

	soundInit();
	
	for (i = 0; i < MLG_RES_LEN; i++)
	{
		var spr = new PIXI.Sprite(PIXI.loader.resources[MLG_RES[i]].texture);
		spr.x = rnd(0, window.innerHeight);
		spr.y = rnd(0, window.innerWidth);
		spr.vx = rnd (1, MAX_VELOCITY);
		spr.vy = rnd (1, MAX_VELOCITY);

		spr.scale.x = 0.5;
		spr.scale.y = 0.5;

		spr.anchor.x = 0.5;
		spr.anchor.y = 0.5;

		spr.visible = false;

		sprites.push(spr);
		stage.addChild(spr);
	}

	switch_mode('startscreen');
}

function world_update()
{
	for (i = 0; i < MLG_RES_LEN; i++)
	{
		var spr = sprites[i];

		if (spr.x <= 0)
			spr.vx = rnd(1, MAX_VELOCITY);

		if (spr.y <= 0)
			spr.vy = rnd(1, MAX_VELOCITY);

		if ((spr.x) >= window.innerWidth)
			spr.vx = -rnd(1, MAX_VELOCITY);

		if ((spr.y) >= window.innerHeight)
			spr.vy = -rnd(1, MAX_VELOCITY);

		if (spr.rotation >= Math.PI)
			spr.rotation = 0;
		else spr.rotation += (spr.vx + spr.vy) / (MAX_VELOCITY*2);

		spr.x += spr.vx;
		spr.y += spr.vy;
	}

	// Crazy background
	red   = Math.sin(BG_COLOR_FREQ*currentColorPos + 0) * 127 + 128;
	green = Math.sin(BG_COLOR_FREQ*currentColorPos + 2) * 127 + 128;
	blue  = Math.sin(BG_COLOR_FREQ*currentColorPos + 4) * 127 + 128;
	renderer.backgroundColor = ((red & 0xff) << 16) + ((green & 0xff) << 8) + (blue & 0xff);
	currentColorPos++;

	if (currentColorPos > BG_COLOR_ITERATIONS)
		currentColorPos = 0;

	if (madnessIntensifies)
	{
		renderer.render(stage);
		requestAnimationFrame(world_update);
	}
}

function madness_setState(INTENSIFY)
{
	madnessIntensifies = INTENSIFY;

	for (i = 0; i < MLG_RES_LEN; i++)
	{
		var spr = sprites[i];
		spr.visible = INTENSIFY;
	}

	if (INTENSIFY)
	{
		world_update();
	}
	else
	{
		renderer.backgroundColor = 0x020202;
		stage.backgroundColor = 0x020202;
		renderer.render(stage);
	}
}
