function setAttributes(element, attributes){
	for(let key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}//setAttributes


AFRAME.registerComponent("shybox", {
	schema: {},
	init: function(){
		this.addListeners();
	},
	update: function(){
		this.setupAnimations();
	},
	addListeners: function(){
		this.beingLookedAt = AFRAME.utils.bind(this.beingLookedAt, this);
		this.el.addEventListener("mouseenter", this.beingLookedAt);
	},
	setupAnimations: function(){
		const startPosition		= this.el.getAttribute("position");
		const startRotation 	= this.el.getAttribute("rotation");

		const jumpAnimation 		= createJumpAnimation();
		const wiggleAnimation 		= createWiggleAnimation();
		const endWiggleAnimation 	= createEndWiggleAnimation();
		const fallAnimation 		= createFallAnimation();

		this.el.appendChild(jumpAnimation);
		this.el.appendChild(wiggleAnimation);
		this.el.appendChild(endWiggleAnimation);
		this.el.appendChild(fallAnimation);

		function createJumpAnimation(){
			const animation = document.createElement("a-animation");
			const fromPos 	= `${startPosition.x} ${startPosition.y} ${startPosition.z}`;
			const toPos 	= `${startPosition.x} ${startPosition.y + 1} ${startPosition.z}`;

			setAttributes(animation, {
				begin		: "jump",
				attribute 	: "position",
				from 		: fromPos,
				to 			: toPos,
				dur 		: 300
			});
			return animation;
		}//createJumpAnimation
		function createWiggleAnimation(){
			const animation = document.createElement("a-animation");
			const fromRot	= `${startRotation.x} ${startRotation.y} ${startRotation.z - 10}`;
			const toRot 	= `${startRotation.x} ${startRotation.y} ${startRotation.z + 10}`;

			setAttributes(animation, {
				begin 		: "wiggle",
				attribute 	: "rotation",
				from 		: fromRot,
				to 			: toRot,
				repeat 		: 4,
				direction	: "alternate",
				dur			: 100
			})
			return animation;
		}//createWiggleAnimation
		function createEndWiggleAnimation(){
			const animation = document.createElement("a-animation");
			const toRot 	= `${startRotation.x} ${startRotation.y} ${startRotation.z}`;
			setAttributes(animation, {
				begin 			: "fall",
				attribute 		: "rotation",
				to 				: toRot,
				dur 			: 50
			});
			return animation;
		}//createEndWiggleAnimation
		function createFallAnimation(){
			const animation = document.createElement("a-animation");
			const fromPos 	= `${startPosition.x} ${startPosition.y + 1} ${startPosition.z}`;
			const toPos 	= `${startPosition.x} ${startPosition.y} ${startPosition.z}`;

			setAttributes(animation, {
				begin		: "fall",
				attribute 	: "position",
				from 		: fromPos,
				to 			: toPos,
				dur 		: 150
			});
			return animation;
		}//createFallAnimation
	},
	beingLookedAt: function(){
		this.surpiseAnimation();
	},
	surpiseAnimation: function(){

		//animation timings
		//--------------------------
		const TIMELINE = {
			"jump" 		: 0,
			"wiggle" 	: 300,
			"fall" 		: 900
		};

		//animation sequence
		//--------------------------
		setTimeout(() => {
			this.el.emit("jump");
		}, TIMELINE.jump);
		setTimeout(() => {
			this.el.emit("wiggle");
		}, TIMELINE.wiggle)
		setTimeout(() => {
			this.el.emit("fall")
			this.el.addEventListener("mouseenter", this.beingLookedAt);
		}, TIMELINE.fall);

		//prevent the animation from triggering again until it's finished
		this.el.removeEventListener("mouseenter", this.beingLookedAt);
	}
});