var EX=["A cozy one-story farmhouse with 3 bedrooms, 2 bathrooms, white walls and a gable roof",
"A mediterranean 2 story home with 5 bedrooms, 4 baths, garage and terracotta hip roof",
"A small cabin with 2 bedrooms and 1 bath, wood walls",
"A traditional brick 3 story house with 4 bedrooms, 3 bathrooms and a garage"];
var N={one:1,single:1,two:2,three:3,four:4,five:5,six:6};
function num(s){return N[s]||parseInt(s,10)||0}
function parse(t){t=t.toLowerCase();var p={},m;
m=t.match(/(\d+|one|two|three|single)[- ]?(?:story|storey|floor)/);p.floors=Math.min(3,m?num(m[1]):1)||1;
m=t.match(/(\d+|one|two|three|four|five|six)[- ]?(?:bed|br)/);p.beds=Math.min(8,m?num(m[1]):3)||3;
m=t.match(/(\d+|one|two|three|four|five)[- ]?(?:bath)/);p.baths=Math.min(6,m?num(m[1]):2)||2;
p.garage=/garage|carport/.test(t);p.office=/office|study/.test(t);
p.style=/modern|contemporary/.test(t)?'modern':/farm/.test(t)?'farmhouse':/mediterr|spanish|villa/.test(t)?'mediterranean':/cabin|lodge|rustic/.test(t)?'cabin':'traditional';
p.roof=/flat/.test(t)?'flat':/hip/.test(t)?'hip':/gable|pitched/.test(t)?'gable':({modern:'flat',farmhouse:'gable',mediterranean:'hip',cabin:'gable',traditional:'gable'})[p.style];
var pal={modern:['#cfd2d4','#2b2f33','#3a3f45'],farmhouse:['#f3f1ec','#2d2d2d','#8a6a4a'],mediterranean:['#ead2a8','#b5532f','#6b4226'],cabin:['#8b5a2b','#4a3220','#5a3a1a'],traditional:['#a9553c','#4b4f55','#2f3a4a']}[p.style];
p.wall=pal[0];p.roofC=pal[1];p.door=pal[2];
var cols={white:'#f3f1ec',gr:'#a9adb1',blue:'#8fb0cf',red:'#b5483a',brick:'#a9553c',beige:'#e3d3b3',green:'#8fae8a',black:'#2b2b2b',yellow:'#e8d48a',wood:'#8b5a2b',brown:'#7a5230'};
for(var k in cols){if(t.indexOf(k)>-1){p.wall=cols[k];break}}
return p}
function build(p){var f=[],bl=p.beds,ba=p.baths,bi=0,pub=[{n:'Living',w:3},{n:'Kitchen',w:2.2},{n:'Dining',w:2}];
if(p.garage)pub.push({n:'Garage',w:2.4,g:1});
if(p.floors==1){var r2=[];for(var i=0;i<bl;i++)r2.push({n:i?'Bedroom '+(i+1):'Primary Bed',w:2});for(i=0;i<ba;i++)r2.push({n:'Bath',w:1});if(p.office)r2.push({n:'Office',w:1.6});f.push({name:'Ground floor',rows:[pub,r2]});return f}
var g2=[{n:'Utility',w:1},{n:p.office?'Office':'Flex',w:2},{n:'Entry',w:1.4},{n:'Powder',w:1}];
f.push({name:'Ground floor',rows:[pub,g2]});
for(var fl=1;fl<p.floors;fl++){var left=p.floors-fl,nb=Math.ceil(bl/left),nba=Math.max(1,Math.ceil(ba/left));bl-=nb;ba-=nba;var r=[];
for(var j=0;j<nb;j++){r.push({n:bi?'Bedroom '+(bi+1):'Primary Bed',w:2});bi++}
var r3=[];for(j=0;j<nba;j++)r3.push({n:'Bath',w:1});r3.push({n:'Landing',w:1.4});
f.push({name:(fl==1?'Second':'Third')+' floor',rows:[r.length?r:[{n:'Loft',w:2}],r3]})}
return f}
function planSVG(fl,p){var S=10,W=44+(p.garage?20:0),D=p.beds>3?38:32,pad=60,gw=0,rows=fl.rows;
var tw=W*S+pad*2,th=D*S+pad*2+30,s='<svg viewBox="0 0 '+tw+' '+th+'" width="'+tw+'" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">';
s+='<defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#2a5db0" stroke-width=".6"/></pattern></defs>';
s+='<rect width="100%" height="100%" fill="#0b3d91"/><rect width="100%" height="100%" fill="url(#g)"/>';
var upper=fl.name!='Ground floor'||false,usable=W;
if(fl.name!='Ground floor'&&p.garage)usable=W-W*0+44;
var rh=D/rows.length;
rows.forEach(function(row,ri){var tot=row.reduce(function(a,r){return a+r.w},0),x=0,wUse=(ri==0)?W:usable;
if(fl.name!='Ground floor'&&p.floors>1)wUse=usable;
row.forEach(function(r){var w=r.w/tot*wUse,X=pad+x*S,Y=pad+ri*rh*S,ww=w*S,hh=rh*S;
s+='<rect class="rm" data-n="'+r.n+'" data-w="'+Math.round(w)+'" data-d="'+Math.round(rh)+'" x="'+X+'" y="'+Y+'" width="'+ww+'" height="'+hh+'" fill="'+(r.g?'#1a4fa8':'none')+'" stroke="#e6f0ff" stroke-width="3"/>';
var fs=ww<80?10:12;s+='<text x="'+(X+ww/2)+'" y="'+(Y+hh/2)+'" fill="#e6f0ff" font-size="'+fs+'" text-anchor="middle">'+r.n.toUpperCase()+'</text>';
s+='<text x="'+(X+ww/2)+'" y="'+(Y+hh/2+14)+'" fill="#9fc2ff" font-size="10" text-anchor="middle">'+Math.round(w)+"' x "+Math.round(rh)+"'</text>";
if(ri==0&&!r.g&&r.n=='Living'||r.n=='Entry'){s+='<path d="M'+(X+ww/2-14)+' '+(Y+hh)+'a14 14 0 0 1 14 -14" fill="none" stroke="#e6f0ff" stroke-width="1.5"/>'}
x+=w})});
var by=pad+D*S;s+='<line x1="'+pad+'" y1="'+(by+18)+'" x2="'+(pad+W*S)+'" y2="'+(by+18)+'" stroke="#9fc2ff"/><text x="'+(pad+W*S/2)+'" y="'+(by+32)+'" fill="#9fc2ff" font-size="11" text-anchor="middle">'+W+"' - 0\"</text>";
s+='<text x="'+pad+'" y="30" fill="#fff" font-size="15" font-weight="bold">'+fl.name.toUpperCase()+'</text>';
s+='<text x="'+(tw-pad)+'" y="30" fill="#9fc2ff" font-size="11" text-anchor="end">SCALE 1/8" = 1\'</text></svg>';return s}
function elevSVG(p){
var fh=96,gw=p.garage?140:0,bw=320,tw=bw+gw,X=(760-tw)/2,gy=340,top=gy-fh*p.floors,k=SK[tod],nt=tod=='night',gx=X+bw,gt=gy-fh+12,s='',i,f;
var tex=p.style=='traditional'?'br':(p.style=='farmhouse'||p.style=='cabin')?'sd':'st';
s+='<svg viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg"><defs>'
+'<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+k[0]+'"/><stop offset="1" stop-color="'+k[1]+'"/></linearGradient>'
+'<linearGradient id="wl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>'
+'<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>'
+'<linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+(nt?'#ffe9a8':'#d6ecfa')+'"/><stop offset="1" stop-color="'+k[3]+'"/></linearGradient>'
+'<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ab462"/><stop offset="1" stop-color="#4a8841"/></linearGradient>'
+'<radialGradient id="bs"><stop offset="0" stop-color="#63a64d"/><stop offset="1" stop-color="#2f6a34"/></radialGradient>'
+'<radialGradient id="gw"><stop offset="0" stop-color="#ffd36a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd36a" stop-opacity="0"/></radialGradient>'
+'<pattern id="br" width="28" height="14" patternUnits="userSpaceOnUse"><path d="M0 .5H28M0 7.5H28M0 0V7M14 7V14" stroke="#efe6d6" stroke-opacity=".55" stroke-width="1.2" fill="none"/></pattern>'
+'<pattern id="sd" width="10" height="11" patternUnits="userSpaceOnUse"><path d="M0 .5H10" stroke="#000" stroke-opacity=".28"/><path d="M0 1.6H10" stroke="#fff" stroke-opacity=".18"/></pattern>'
+'<pattern id="sh" width="16" height="8" patternUnits="userSpaceOnUse"><path d="M0 .5H16M0 4.5H16M8 .5V4.5M0 4.5V8M16 4.5V8" stroke="#000" stroke-opacity=".4" fill="none"/></pattern>'
+'<filter id="nz" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .16 0"/></filter>'
+'<filter id="bl"><feGaussianBlur stdDeviation="4"/></filter></defs>';
s+='<rect width="760" height="420" fill="url(#sk)"/>';
if(nt)for(i=0;i<26;i++)s+='<circle cx="'+((i*97)%760)+'" cy="'+((i*53)%170)+'" r="1.3" fill="#fff" opacity=".8"/>';
s+='<circle cx="650" cy="72" r="60" fill="'+k[2]+'" opacity=".25"/><circle cx="650" cy="72" r="27" fill="'+k[2]+'"/>';
if(!nt)s+='<g fill="#fff" opacity=".85"><ellipse cx="160" cy="80" rx="52" ry="14"/><ellipse cx="190" cy="70" rx="34" ry="13"/><ellipse cx="520" cy="120" rx="60" ry="14"/><ellipse cx="550" cy="110" rx="36" ry="12"/></g>';
s+='<path d="M0 300Q120 230 260 285T520 262T760 290V345H0Z" fill="#6f9a6a" opacity=".55"/><path d="M0 320Q200 280 380 315T760 305V345H0Z" fill="#5b8a55" opacity=".7"/>';
s+='<rect y="'+gy+'" width="760" height="'+(420-gy)+'" fill="url(#gr)"/>';
var dx=X+bw/2-22;
s+='<polygon points="'+(dx+6)+','+gy+' '+(dx+38)+','+gy+' '+(dx+68)+',420 '+(dx-24)+',420" fill="#d9d2c4" stroke="#0002"/>';
if(p.garage)s+='<polygon points="'+(gx+10)+','+gy+' '+(gx+gw-10)+','+gy+' '+(gx+gw+30)+',420 '+(gx-14)+',420" fill="#b3b0aa"/>';
s+='<rect x="'+(X-6)+'" y="'+(gy-3)+'" width="'+(tw+12)+'" height="12" fill="#000" opacity=".35" filter="url(#bl)"/>';
function W(x,y,w,h){var r='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" ';return r+'fill="'+p.wall+'"/>'+(tex!='st'?r+'fill="url(#'+tex+')"/>':'')+r+'filter="url(#nz)"/>'+r+'fill="url(#wl)"/>'}
function RF(pt){return '<polygon points="'+pt+'" fill="'+p.roofC+'"/><polygon points="'+pt+'" fill="url(#sh)"/><polygon points="'+pt+'" fill="url(#rg)" stroke="#000" stroke-opacity=".5"/>'}
s+=W(X,top,bw,fh*p.floors);if(p.garage)s+=W(gx,gt,gw,gy-gt);
for(f=1;f<p.floors;f++)s+='<rect x="'+(X-2)+'" y="'+(gy-fh*f-3)+'" width="'+(bw+4)+'" height="6" fill="#fff" opacity=".6"/><rect x="'+X+'" y="'+(gy-fh*f+3)+'" width="'+bw+'" height="5" fill="#000" opacity=".15"/>';
if(p.roof!='flat')s+='<rect x="'+(X+bw-72)+'" y="'+(top-112)+'" width="26" height="92" fill="#8a4a38"/><rect x="'+(X+bw-72)+'" y="'+(top-112)+'" width="26" height="92" fill="url(#br)"/><rect x="'+(X+bw-75)+'" y="'+(top-116)+'" width="32" height="7" fill="#555"/>';
if(p.roof=='flat')s+='<rect x="'+(X-8)+'" y="'+(top-14)+'" width="'+(bw+16)+'" height="14" fill="'+p.roofC+'"/><rect x="'+(X-8)+'" y="'+(top-14)+'" width="'+(bw+16)+'" height="14" fill="url(#rg)"/>'+(p.garage?'<rect x="'+(gx-4)+'" y="'+(gt-10)+'" width="'+(gw+12)+'" height="10" fill="'+p.roofC+'"/><rect x="'+(gx-4)+'" y="'+(gt-10)+'" width="'+(gw+12)+'" height="10" fill="url(#rg)"/>':'');
else if(p.roof=='hip')s+=RF((X-16)+','+top+' '+(X+60)+','+(top-62)+' '+(X+bw-60)+','+(top-62)+' '+(X+bw+16)+','+top)+(p.garage?RF((gx-4)+','+gt+' '+(gx+26)+','+(gt-34)+' '+(gx+gw-18)+','+(gt-34)+' '+(gx+gw+14)+','+gt):'');
else s+=RF((X-16)+','+top+' '+(X+bw/2)+','+(top-84)+' '+(X+bw+16)+','+top)+(p.garage?RF((gx-4)+','+gt+' '+(gx+gw/2+4)+','+(gt-48)+' '+(gx+gw+14)+','+gt):'');
s+='<rect x="'+X+'" y="'+top+'" width="'+bw+'" height="10" fill="#000" opacity=".2"/>';
if(p.garage){s+='<rect x="'+(gx+14)+'" y="'+(gt+16)+'" width="'+(gw-28)+'" height="'+(gy-gt-16)+'" fill="#eceae4" stroke="#0005" stroke-width="2"/>';
for(i=1;i<4;i++)s+='<line x1="'+(gx+14)+'" x2="'+(gx+gw-14)+'" y1="'+(gt+16+i*(gy-gt-16)/4)+'" y2="'+(gt+16+i*(gy-gt-16)/4)+'" stroke="#0004"/>';
for(i=0;i<4;i++)s+='<rect x="'+(gx+22+i*27)+'" y="'+(gt+22)+'" width="22" height="10" fill="url(#gl)" stroke="#0005"/>'}
s+='<rect x="'+(dx-6)+'" y="'+(gy-78)+'" width="56" height="78" fill="#f4f4f4"/><rect x="'+dx+'" y="'+(gy-72)+'" width="44" height="72" fill="'+p.door+'"/><rect x="'+dx+'" y="'+(gy-72)+'" width="44" height="72" fill="url(#wl)"/>';
for(i=0;i<4;i++)s+='<rect x="'+(dx+6+(i%2)*19)+'" y="'+(gy-66+(i>1?32:0))+'" width="13" height="27" fill="#fff" fill-opacity=".1" stroke="#000" stroke-opacity=".35"/>';
s+='<circle cx="'+(dx+37)+'" cy="'+(gy-34)+'" r="2.6" fill="#e8c860"/><rect x="'+(dx-12)+'" y="'+(gy-4)+'" width="68" height="4" fill="#cfc8bb"/>';
[X+8,X+66,X+bw-70,X+bw-14].forEach(function(x){s+='<ellipse cx="'+x+'" cy="'+(gy-6)+'" rx="27" ry="19" fill="url(#bs)"/>'});
s+='<ellipse cx="'+(X-74)+'" cy="'+(gy+4)+'" rx="52" ry="8" fill="#000" opacity=".22"/><rect x="'+(X-79)+'" y="'+(gy-72)+'" width="10" height="72" fill="#6b4a2b"/><circle cx="'+(X-74)+'" cy="'+(gy-104)+'" r="40" fill="url(#bs)"/><circle cx="'+(X-98)+'" cy="'+(gy-80)+'" r="28" fill="url(#bs)"/><circle cx="'+(X-50)+'" cy="'+(gy-82)+'" r="30" fill="url(#bs)"/>';
s+='<rect x="'+(X+tw+52)+'" y="'+(gy-50)+'" width="7" height="50" fill="#6b4a2b"/><circle cx="'+(X+tw+55)+'" cy="'+(gy-74)+'" r="30" fill="url(#bs)"/>';
if(nt)s+='<rect width="760" height="420" fill="#07102e" opacity=".4"/>';else if(tod=='sunset')s+='<rect width="760" height="420" fill="#ff7a30" opacity=".14"/>';
var ww=p.style=='modern'?74:58,sh=(p.style=='farmhouse'||p.style=='traditional');
function wn(x,y,w,h){var r='';if(nt)r+='<circle cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" r="'+(w+6)+'" fill="url(#gw)"/>';
if(sh)r+='<rect x="'+(x-16)+'" y="'+(y-3)+'" width="12" height="'+(h+6)+'" fill="'+p.roofC+'" stroke="#0005"/><rect x="'+(x+w+4)+'" y="'+(y-3)+'" width="12" height="'+(h+6)+'" fill="'+p.roofC+'" stroke="#0005"/>';
return r+'<rect x="'+(x-3)+'" y="'+(y-3)+'" width="'+(w+6)+'" height="'+(h+6)+'" fill="#f2f2f2"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#gl)"/><polygon points="'+x+','+(y+h)+' '+x+','+(y+h*.45)+' '+(x+w*.55)+','+y+' '+(x+w*.8)+','+y+'" fill="#fff" opacity=".3"/><path d="M'+(x+w/2)+' '+y+'V'+(y+h)+'M'+x+' '+(y+h/2)+'H'+(x+w)+'" stroke="#f2f2f2" stroke-width="2.5"/><rect x="'+(x-7)+'" y="'+(y+h+3)+'" width="'+(w+14)+'" height="5" fill="#e6e6e6" stroke="#0003"/>'}
for(f=0;f<p.floors;f++)for(i=0;i<3;i++){if(f==0&&i==1)continue;s+=wn(X+bw/3*(i+.5)-ww/2,gy-fh*(f+1)+20,ww,50)}
if(nt)s+='<circle cx="'+(dx-12)+'" cy="'+(gy-54)+'" r="34" fill="url(#gw)"/><rect x="'+(dx-15)+'" y="'+(gy-58)+'" width="6" height="9" fill="#ffe9a8"/>';
return s+'<text x="16" y="408" font-family="Courier New,monospace" font-size="12" fill="'+(nt?'#cfe8d8':'#1f3b1f')+'">FRONT ELEVATION · '+p.style.toUpperCase()+'</text></svg>'}
var AUTO=true,CAM={th:.6,ph:1.15,r:135},RN=null,RAF=0;
function stop3D(){cancelAnimationFrame(RAF);if(RN){RN.dispose();RN=null}}
function tx(kind,col){var c=document.createElement('canvas');c.width=c.height=128;var g=c.getContext('2d'),x,y,i;g.fillStyle=col;g.fillRect(0,0,128,128);
if(kind=='brick'){g.strokeStyle='rgba(235,225,205,.55)';g.lineWidth=2;for(y=0;y<128;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke();for(x=(y/16%2)*32;x<128;x+=64){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+16);g.stroke()}}}
else if(kind=='sid'){for(y=0;y<128;y+=16){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,y,128,3);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,y+3,128,2)}}
else if(kind=='shg'){g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=2;for(y=0;y<128;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke();for(x=(y/16%2)*16;x<128;x+=32){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+16);g.stroke()}}}
else{for(i=0;i<900;i++){g.fillStyle='rgba(0,0,0,'+Math.random()*.07+')';g.fillRect(Math.random()*128,Math.random()*128,2,2)}}
var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function mount3D(){var el=$('v3');if(!window.THREE){el.innerHTML='<p style="color:#fff;padding:20px">The 3D engine could not load.</p>';return}
var T=THREE,w=el.clientWidth||600,h=440,k=SK[tod],nt=tod=='night',R=RN=new T.WebGLRenderer({antialias:true}),f;
R.setSize(w,h);R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.shadowMap.enabled=true;el.appendChild(R.domElement);
var S=new T.Scene();S.background=new T.Color(k[0]);S.fog=new T.Fog(k[1],160,450);
var cam=new T.PerspectiveCamera(45,w/h,1,1000);
S.add(new T.HemisphereLight(nt?0x4a5a99:0xffffff,0x3a5a2a,nt?.55:.8));
var sun=new T.DirectionalLight(nt?0x8fa0ff:tod=='sunset'?0xffb070:0xffffff,nt?.4:1);sun.position.set(tod=='sunset'?-90:70,90,80);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
var sc=sun.shadow.camera;sc.left=sc.bottom=-100;sc.right=sc.top=100;sc.far=350;S.add(sun);
var M=function(c,o){return new T.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{}))};
var add=function(g,m,x,y,z){var o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;S.add(o);return o};
var Bx=function(a,b,c){return new T.BoxGeometry(a,b,c)};
var gw=P.garage?22:0,mw=44,W=mw+gw,D=P.beds>3?38:32,H=10*P.floors,x0=-W/2,mx=x0+mw/2,gx=x0+mw+gw/2,fz=D/2;
var kind=P.style=='traditional'?'brick':(P.style=='farmhouse'||P.style=='cabin')?'sid':'stu';
var wt=tx(kind,P.wall);wt.repeat.set(4,P.floors*1.4);var wm=M(0xffffff,{map:wt});
var gr=add(new T.PlaneGeometry(700,700),M(0x5f9b4b),0,0,0);gr.rotation.x=-Math.PI/2;gr.castShadow=false;
function flat(a,b,x,z,c){var o=add(new T.PlaneGeometry(a,b),M(c),x,.06,z);o.rotation.x=-Math.PI/2;o.castShadow=false}
flat(5,26,mx,fz+13,0xd8d0c0);if(gw)flat(gw-3,40,gx,fz+24,0x9a9892);
add(Bx(mw,H,D),wm,mx,H/2,0);if(gw)add(Bx(gw,10,26),wm,gx,5,fz-9);
for(f=1;f<P.floors;f++)add(Bx(mw+.8,.7,D+.8),M(0xf4f4f4),mx,10*f,0);
var rt=tx('shg',P.roofC);rt.repeat.set(5,5);var rm=M(0xffffff,{map:rt});
function roof(a,d,y,x,z){if(P.roof=='flat'){add(Bx(a+2.5,1.4,d+2.5),M(P.roofC),x,y+.7,z);return}
var rh=Math.min(13,a*.3);
if(P.roof=='hip'){var g=new T.ConeGeometry(1,rh,4);g.rotateY(Math.PI/4);var c=add(g,rm,x,y+rh/2,z);c.scale.set((a+3)/1.414,1,(d+3)/1.414)}
else{var sh=new T.Shape();sh.moveTo(-(a/2+1.5),0);sh.lineTo(a/2+1.5,0);sh.lineTo(0,rh);sh.closePath();add(new T.ExtrudeGeometry(sh,{depth:d+3,bevelEnabled:false}),rm,x,y,z-(d+3)/2)}}
roof(mw,D,H,mx,0);if(gw)roof(gw,26,10,gx,fz-9);
if(P.roof!='flat')add(Bx(3,14,3),M(0xffffff,{map:tx('brick','#8a4a38')}),mx+mw/2-8,H+7,-5);
var gm=M(nt?0xffe08a:0xa5d2f2,{roughness:.15,metalness:.5,emissive:nt?0xffc24a:0x000000,emissiveIntensity:nt?.9:0}),fm=M(0xf4f4f4);
function wn(x,y,z,ry){var g=new T.Group();g.add(new T.Mesh(Bx(5.4,6.4,.5),fm),new T.Mesh(Bx(4.4,5.4,.7),gm),new T.Mesh(Bx(.35,5.4,.8),fm),new T.Mesh(Bx(4.4,.35,.8),fm));g.position.set(x,y,z);g.rotation.y=ry;S.add(g)}
for(f=0;f<P.floors;f++){var y=10*f+5.6;[-14,0,14].forEach(function(d){if(f==0&&d==0)return;wn(mx+d,y,fz+.2,0);wn(mx+d,y,-fz-.2,Math.PI)});[-8,8].forEach(function(z){wn(x0-.2,y,z,-Math.PI/2);if(!gw)wn(x0+mw+.2,y,z,Math.PI/2)})}
add(Bx(6.2,9,.5),fm,mx,4.5,fz+.15);add(Bx(5,8.4,.7),M(P.door),mx,4.2,fz+.3);add(new T.SphereGeometry(.28,8,8),M(0xe8c860,{metalness:.8}),mx+1.7,4,fz+.8);add(Bx(9,.7,3),M(0xcfc8bb),mx,.35,fz+1.5);
if(gw){var gz=fz+4.3;add(Bx(17,8,.5),M(0xeceae4),gx,4,gz);for(var i=1;i<4;i++)add(Bx(17,.25,.6),M(0x9a9a9a),gx,i*2,gz+.05)}
if(nt){var pl=new T.PointLight(0xffc870,.8,40);pl.position.set(mx-5,6,fz+3);S.add(pl);add(new T.SphereGeometry(.5,8,8),M(0xffe9a8,{emissive:0xffd070,emissiveIntensity:1}),mx-3.5,6.5,fz+.8)}
[[x0-16,-9],[W/2+16,16],[x0-8,26]].forEach(function(t){add(new T.CylinderGeometry(.8,1.1,7,8),M(0x6b4a2b),t[0],3.5,t[1]);[[0,10,0,7],[3,13,1,5],[-3,12,-1,5]].forEach(function(c){add(new T.IcosahedronGeometry(c[3],1),M(0x3f7d3a,{flatShading:true}),t[0]+c[0],c[1],t[1]+c[2])})});
for(var bx=x0+5;bx<x0+mw-3;bx+=8){if(Math.abs(bx-mx)<6)continue;add(new T.SphereGeometry(2.2,10,8),M(0x3f7d3a),bx,1.6,fz+2)}
var pt={};
el.addEventListener('pointerdown',function(e){el.setPointerCapture(e.pointerId);pt[e.pointerId]=[e.clientX,e.clientY];el.style.cursor='grabbing'});
el.addEventListener('pointermove',function(e){var q=pt[e.pointerId];if(!q)return;var ids=Object.keys(pt);
if(ids.length==1){CAM.th-=(e.clientX-q[0])*.008;CAM.ph=Math.max(.25,Math.min(1.5,CAM.ph-(e.clientY-q[1])*.006))}
else{var o=pt[ids[0]==e.pointerId?ids[1]:ids[0]],d0=Math.hypot(q[0]-o[0],q[1]-o[1]),d1=Math.hypot(e.clientX-o[0],e.clientY-o[1]);if(d1)CAM.r=Math.max(50,Math.min(260,CAM.r*d0/d1))}
pt[e.pointerId]=[e.clientX,e.clientY]});
['pointerup','pointercancel'].forEach(function(n){el.addEventListener(n,function(e){delete pt[e.pointerId];el.style.cursor='grab'})});
el.addEventListener('wheel',function(e){e.preventDefault();CAM.r=Math.max(50,Math.min(260,CAM.r*(1+e.deltaY*.001)))},{passive:false});
(function loop(){RAF=requestAnimationFrame(loop);if(AUTO&&!Object.keys(pt).length)CAM.th+=.004;var r=CAM.r,sp=Math.sin(CAM.ph);cam.position.set(r*sp*Math.sin(CAM.th),H/2+r*Math.cos(CAM.ph),r*sp*Math.cos(CAM.th));cam.lookAt(0,H/2,0);R.render(S,cam)})();}
var SW=['#f3f1ec','#cfd2d4','#a9adb1','#ead2a8','#e3d3b3','#8fb0cf','#8fae8a','#e8d48a','#a9553c','#8b5a2b','#2b2b2b'];
var STY={modern:['Modern','🏙️','#6c5ce7'],farmhouse:['Farmhouse','🌾','#e1a62f'],mediterranean:['Mediterranean','🌴','#e8743b'],cabin:['Cabin','🌲','#2f8f5b'],traditional:['Traditional','🏡','#3b82c4']};
var PAL={modern:['#cfd2d4','#2b2f33','#3a3f45','flat'],farmhouse:['#f3f1ec','#2d2d2d','#8a6a4a','gable'],mediterranean:['#ead2a8','#b5532f','#6b4226','hip'],cabin:['#8b5a2b','#4a3220','#5a3a1a','gable'],traditional:['#a9553c','#4b4f55','#2f3a4a','gable']};
var SK={day:['#8ec5f0','#e9f4fb','#fff4b8','#9cc7e4'],sunset:['#ff8a5c','#ffd9a0','#fff1b0','#ffd88a'],night:['#0e1a3a','#33477a','#e8ecff','#ffe28a']};
var LAB=['🌾 Farmhouse','🌴 Mediterranean','🌲 Cabin','🧱 Brick 3-story'];
var P,FL,tab='look',tod='day',fi=0;
function $(i){return document.getElementById(i)}
function all(s){return [].slice.call(document.querySelectorAll(s))}
function calc(){var rh=(P.beds>3?38:32)/2,tot=0,W=44+(P.garage?20:0);
FL.forEach(function(f){f.rows.forEach(function(row,ri){var t=row.reduce(function(a,r){return a+r.w},0),wu=(ri==0&&f.name=='Ground floor')?W:44;row.forEach(function(r){if(!r.g)tot+=r.w/t*wu*rh})})});return Math.round(tot/10)*10}
function setCtl(){['floors','beds','baths'].forEach(function(k){$('v-'+k).textContent=P[k]});
$('t-garage').checked=P.garage;$('t-office').checked=P.office;
all('.sty').forEach(function(b){b.classList.toggle('on',b.dataset.s==P.style)});
all('[data-roof]').forEach(function(b){b.classList.toggle('on',b.dataset.roof==P.roof)});
all('.sw').forEach(function(b){b.classList.toggle('on',b.dataset.c==P.wall)});
all('[data-tab]').forEach(function(b){b.classList.toggle('on',b.dataset.tab==tab)})}
function render(){stop3D();FL=build(P);if(fi>=FL.length)fi=0;setCtl();
var rooms=0;FL.forEach(function(f){f.rows.forEach(function(r){rooms+=r.length})});
$('stats').innerHTML='<div class="stat"><b>~'+calc().toLocaleString()+'</b><span>sq ft living area</span></div><div class="stat"><b>'+P.floors+'</b><span>floor'+(P.floors>1?'s':'')+' · '+rooms+' rooms</span></div><div class="stat"><b>'+P.beds+' bd / '+P.baths+' ba</b><span>bedrooms / baths</span></div><div class="stat"><b>'+STY[P.style][1]+' '+STY[P.style][0]+'</b><span>'+P.roof+' roof</span></div>';
var h,info;
if(tab=='look'){h='<div class="wrap">'+elevSVG(P)+'</div><div class="pills">'+['day','sunset','night'].map(function(t){return '<button data-tod="'+t+'" class="'+(t==tod?'on':'')+'">'+({day:'☀️ Day',sunset:'🌇 Sunset',night:'🌙 Night'})[t]+'</button>'}).join('')+'</div>';info='Try the time-of-day buttons, or change anything in the controls.'}
else if(tab=='3d'){h='<div class="v3" id="v3"></div><div class="pills">'+['day','sunset','night'].map(function(t){return '<button data-tod="'+t+'" class="'+(t==tod?'on':'')+'">'+({day:'☀️ Day',sunset:'🌇 Sunset',night:'🌙 Night'})[t]+'</button>'}).join('')+'<button data-act="rot" class="'+(AUTO?'on':'')+'">🔄 Auto-rotate</button><button data-act="reset">↺ Reset view</button></div>';info='Drag to look around · scroll or pinch to zoom.'}else{h=(FL.length>1?'<div class="pills">'+FL.map(function(f,i){return '<button data-fl="'+i+'" class="'+(i==fi?'on':'')+'">'+f.name+'</button>'}).join('')+'</div>':'')+'<div class="wrap">'+planSVG(FL[fi],P)+'</div>';info='Hover or tap a room to see its size.'}
$('view').innerHTML=h;$('info').innerHTML=info;if(tab=='3d')mount3D();
$('view').classList.remove('pop');void $('view').offsetWidth;$('view').classList.add('pop')}
function show(t){var w=+t.dataset.w,d=+t.dataset.d;$('info').innerHTML='<b>'+t.dataset.n+'</b> · '+w+"' × "+d+"' · about "+(w*d)+' sq ft'}
function gen(){P=parse($('desc').value);fi=0;render()}
document.addEventListener('click',function(e){var t=e.target.closest('button,.rm');if(!t)return;var d=t.dataset;
if(d.k){var lim={floors:[1,3],beds:[1,8],baths:[1,6]}[d.k];P[d.k]=Math.max(lim[0],Math.min(lim[1],P[d.k]+(+d.d)));render()}
else if(d.tab){tab=d.tab;render()}
else if(d.tod){tod=d.tod;render()}
else if(d.fl){fi=+d.fl;render()}
else if(d.roof){P.roof=d.roof;render()}
else if(d.s){var a=PAL[d.s];P.style=d.s;P.wall=a[0];P.roofC=a[1];P.door=a[2];P.roof=a[3];render()}
else if(d.c){P.wall=d.c;render()}
else if(d.act){if(d.act=='rot'){AUTO=!AUTO;t.classList.toggle('on',AUTO)}else{CAM.th=.6;CAM.ph=1.15;CAM.r=135}}else if(d.ex){$('desc').value=EX[+d.ex];gen()}
else if(t.id=='go'){gen()}
else if(t.classList.contains('rm')){show(t)}});
document.addEventListener('mouseover',function(e){var t=e.target;if(t.classList&&t.classList.contains('rm'))show(t)});
$('t-garage').onchange=function(){P.garage=this.checked;render()};
$('t-office').onchange=function(){P.office=this.checked;render()};
$('chips').innerHTML=LAB.map(function(l,i){return '<button class="chip" data-ex="'+i+'">'+l+'</button>'}).join('');
$('styles').innerHTML=Object.keys(STY).map(function(k){return '<button class="sty" data-s="'+k+'" style="--c:'+STY[k][2]+'">'+STY[k][1]+' '+STY[k][0]+'</button>'}).join('');
$('sws').innerHTML=SW.map(function(c){return '<button class="sw" data-c="'+c+'" style="background:'+c+'" aria-label="Wall color '+c+'"></button>'}).join('');
gen();