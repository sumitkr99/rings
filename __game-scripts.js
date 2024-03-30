var Rotate=pc.createScript("rotate");Rotate.attributes.add("cameraEntity",{type:"entity",title:"Camera Entity"}),Rotate.attributes.add("orbitSensitivity",{type:"number",default:.3,title:"Orbit Sensitivity",description:"How fast the camera moves around the orbit. Higher is faster"}),Rotate.prototype.initialize=function(){this.app.mouse.on(pc.EVENT_MOUSEMOVE,this.onMouseMove,this),this.lastTouchPoint=new pc.Vec2,this.app.touch&&(this.app.touch.on(pc.EVENT_TOUCHSTART,this.onTouchStart,this),this.app.touch.on(pc.EVENT_TOUCHMOVE,this.onTouchMove,this)),this.on("destroy",(function(){this.app.mouse.off(pc.EVENT_MOUSEMOVE,this.onMouseMove,this),this.app.touch&&(this.app.touch.off(pc.EVENT_TOUCHSTART,this.onTouchStart,this),this.app.touch.off(pc.EVENT_TOUCHMOVE,this.onTouchMove,this))}),this)},Rotate.horizontalQuat=new pc.Quat,Rotate.verticalQuat=new pc.Quat,Rotate.resultQuat=new pc.Quat,Rotate.prototype.rotate=function(t,o){var i=Rotate.horizontalQuat,e=Rotate.verticalQuat,a=Rotate.resultQuat;i.setFromAxisAngle(this.cameraEntity.up,t*this.orbitSensitivity),e.setFromAxisAngle(this.cameraEntity.right,o*this.orbitSensitivity),a.mul2(i,e),a.mul(this.entity.getRotation()),this.entity.setRotation(a)},Rotate.prototype.onTouchStart=function(t){var o=t.touches[0];this.lastTouchPoint.set(o.x,o.y)},Rotate.prototype.onTouchMove=function(t){var o=t.touches[0],i=o.x-this.lastTouchPoint.x,e=o.y-this.lastTouchPoint.y;this.rotate(i,e),this.lastTouchPoint.set(o.x,o.y)},Rotate.prototype.onMouseMove=function(t){this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)&&this.rotate(t.dx,t.dy)};var ColorManager=pc.createScript("colorManager");ColorManager.attributes.add("RingEntity",{type:"entity",title:"Ring Entity"}),ColorManager.attributes.add("GemColorButtonsGroup",{type:"entity",title:"Gem Color Buttons Group"}),ColorManager.attributes.add("MetalColorButtonsGroup",{type:"entity",title:"Metal Color Buttons Group"}),ColorManager.attributes.add("ResetButton",{type:"entity",title:"Reset Button"}),ColorManager.attributes.add("GemModelParent",{type:"entity",title:"Gem Models"}),ColorManager.attributes.add("RingMetalParent",{type:"entity",title:"Ring Metal Models"}),ColorManager.attributes.add("WhiteMetalModels",{type:"entity",title:"White Metal Models",array:!0}),ColorManager.attributes.add("WhiteGoldModels",{type:"entity",title:"WhiteGold Models",array:!0}),ColorManager.attributes.add("GemMaterials",{type:"asset",title:"Gem Materials",array:!0}),ColorManager.attributes.add("RingMetalMaterials",{type:"asset",title:"Ring Metal Materials",array:!0}),ColorManager.attributes.add("WhiteMetalMaterials",{type:"asset",title:"White Metal Materials",array:!0}),ColorManager.attributes.add("WhiteGoldMaterials",{type:"asset",title:"White Gold Materials",array:!0}),ColorManager.prototype.initialize=function(){for(var t=0;t<this.GemColorButtonsGroup.children.length;t++)this.OnButtonsClick(this.GemColorButtonsGroup.children[t],!0,t);for(t=0;t<this.MetalColorButtonsGroup.children.length;t++)this.OnButtonsClick(this.MetalColorButtonsGroup.children[t],!1,t);this.ResetButton.button.on("click",(function(t){this.RingEntity.setLocalEulerAngles(0,0,0),this.RingEntity.setLocalScale(1,1,1)}),this)},ColorManager.prototype.OnButtonsClick=function(t,e,o){t.button.on("click",(function(o){e?this.ChangeColor(this.GemModelParent.children,t.element.color):(this.ChangeColor(this.RingMetalParent.children,t.element.color),this.ChangeColor(this.WhiteMetalModels,t.element.color),this.ChangeColor(this.WhiteGoldModels,t.element.color))}),this)},ColorManager.prototype.update=function(t){},ColorManager.prototype.ChangeColor=function(t,e){for(var o=0;o<t.length;o++){var a=t[o].render.meshInstances[0].material;a.diffuse=e,a.emissive=e,a.update()}};var ScaleWithTouch=pc.createScript("scaleWithTouch");ScaleWithTouch.attributes.add("cameraEntity",{type:"entity",title:"Camera Entity"}),ScaleWithTouch.attributes.add("minScale",{type:"number",default:1}),ScaleWithTouch.attributes.add("maxScale",{type:"number",default:2}),ScaleWithTouch.attributes.add("scaleSpeed",{type:"number",default:.05}),ScaleWithTouch.prototype.initialize=function(){this.startTouches=[],this.lastPinchDistance=0,this.app&&this.app.touch?(this.app.touch.on(pc.EVENT_TOUCHSTART,this.onTouchStart,this),this.app.touch.on(pc.EVENT_TOUCHMOVE,this.onTouchMove,this),this.app.touch.on(pc.EVENT_TOUCHEND,this.onTouchEnd,this)):console.error("App or touch input not available.")},ScaleWithTouch.touchStartWorldPos=new pc.Vec3,ScaleWithTouch.touchMoveWorldPos=new pc.Vec3,ScaleWithTouch.mouseMoveWorldPos=new pc.Vec3,ScaleWithTouch.prototype.onTouchStart=function(t){this.startTouches=t.touches,this.lastPinchDistance=this.getPinchDistance(t.touches),this.cameraEntity.camera.screenToWorld(this.startTouches[0].x,this.startTouches[0].y,100,ScaleWithTouch.touchStartWorldPos)},ScaleWithTouch.prototype.onTouchMove=function(t){var c=t.touches[0];if(this.cameraEntity.camera.screenToWorld(c.x,c.y,100,ScaleWithTouch.touchMoveWorldPos),!(ScaleWithTouch.touchStartWorldPos.y<-15||ScaleWithTouch.touchMoveWorldPos.y<-15)){var e=this.getPinchDistance(t.touches),o=e-this.lastPinchDistance,h=this.entity.getLocalScale().clone(),a=this.scaleSpeed,i=h.x+o*a;i=pc.math.clamp(i,this.minScale,this.maxScale),h.set(i,i,i),this.entity.setLocalScale(h),this.lastPinchDistance=e}},ScaleWithTouch.prototype.onTouchEnd=function(t){ScaleWithTouch.touchStartWorldPos.y<-15||ScaleWithTouch.touchMoveWorldPos.y<-15||(this.startTouches=[],this.lastPinchDistance=0)},ScaleWithTouch.prototype.getPinchDistance=function(t){if(t.length<2)return 0;var c=t[0],e=t[1],o=c.x-e.x,h=c.y-e.y;return Math.sqrt(o*o+h*h)};pc.script.createLoadingScreen((function(e){var t,a;t=["body {","    background-color: #283538;","}","","#application-splash-wrapper {","    position: absolute;","    top: 0;","    left: 0;","    height: 100%;","    width: 100%;","    background-color: #283538;","}","","#application-splash {","    position: absolute;","    top: calc(50% - 28px);","    width: 264px;","    left: calc(50% - 132px);","}","","#application-splash img {","    width: 100%;","}","","#progress-bar-container {","    margin: 20px auto 0 auto;","    height: 2px;","    width: 100%;","    background-color: #1d292c;","}","","#progress-bar {","    width: 0%;","    height: 100%;","    background-color: #f60;","}","","@media (max-width: 480px) {","    #application-splash {","        width: 170px;","        left: calc(50% - 85px);","    }","}"].join("\n"),(a=document.createElement("style")).type="text/css",a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t)),document.head.appendChild(a),function(){var e=document.createElement("div");e.id="application-splash-wrapper",document.body.appendChild(e);var t=document.createElement("div");t.id="application-splash",e.appendChild(t),t.style.display="none";var a=document.createElement("img");a.src="https://raw.githubusercontent.com/sumitkr99/host/main/loading.png",t.appendChild(a),a.onload=function(){t.style.display="block"};var o=document.createElement("div");o.id="progress-bar-container",t.appendChild(o);var n=document.createElement("div");n.id="progress-bar",o.appendChild(n)}(),e.on("preload:end",(function(){e.off("preload:progress")})),e.on("preload:progress",(function(e){var t=document.getElementById("progress-bar");t&&(e=Math.min(1,Math.max(0,e)),t.style.width=100*e+"%")})),e.on("start",(function(){var e=document.getElementById("application-splash-wrapper");e.parentElement.removeChild(e)}))}));