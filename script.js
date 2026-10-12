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
p.balcony=/balcon/.test(t);p.patio=/patio|terrace/.test(t);
p.windowStyle=/dormer/.test(t)?'dormer':/oriel/.test(t)?'oriel':/egress/.test(t)?'egress':/circle|circular|round/.test(t)?'circle':/two[- ]panel slider|slider/.test(t)?'slider':'fixed';
p.buildingType=/restaurant|dining room/.test(t)?'restaurant':/\bcafe\b|coffee shop/.test(t)?'cafe':/\boffice\b|workspaces|meeting rooms/.test(t)?'office':/\bshop\b|\bstore\b|retail/.test(t)?'shop':'house';
p.style=/modern|contemporary/.test(t)?'modern':/farm/.test(t)?'farmhouse':/mediterr|spanish|villa/.test(t)?'mediterranean':/cabin|lodge|rustic/.test(t)?'cabin':'traditional';
p.roof=/flat/.test(t)?'flat':/hip/.test(t)?'hip':/gable|pitched/.test(t)?'gable':({modern:'flat',farmhouse:'gable',mediterranean:'hip',cabin:'gable',traditional:'gable'})[p.style];
if(p.windowStyle=='dormer')p.roof='gable';
var pal={modern:['#c9d3ce','#777f7a','#59635d'],farmhouse:['#f5f3eb','#b6ad9d','#8b806d'],mediterranean:['#e8ddc8','#899b8f','#6d786f'],cabin:['#c8b99f','#77766e','#5f665f'],traditional:['#d6d6cf','#717873','#515c55']}[p.style];
p.wall=pal[0];p.roofC=pal[1];p.door=pal[2];
var cols={white:'#f5f5ef',gr:'#aeb5b0',blue:'#b8c9c1',red:'#b8b7ad',brick:'#9da69f',beige:'#e8ddc8',green:'#a8c7b5',black:'#686f6b',yellow:'#e5dcc6',wood:'#b9a98e',brown:'#908879'};
for(var k in cols){if(t.indexOf(k)>-1){p.wall=cols[k];break}}
if(p.buildingType!='house'&&/\b(house|home|cabin|villa|farmhouse)\b/.test(t)&&!/office building|restaurant|cafe|shop|store/.test(t))p.buildingType='house';
p.sqft=null;m=t.match(/(\d[\d,]{2,5})\s*(?:sq|square)/);if(m)p.sqft=Math.max(400,Math.min(12000,parseInt(m[1].replace(/,/g,''),10)||0))||null;
p.land=/wildflower|meadow|wild/.test(t)?'wild':/hardscape|gravel|zen garden|paver/.test(t)?'modern':null;
p.opts=optDefaults(p.buildingType);
return p}
function build(p){var f=[],bl=p.beds,ba=p.baths,bi=0,pub=[{n:'Living',w:3},{n:'Kitchen',w:2.2},{n:'Dining',w:2}];
if(p.buildingType!='house')return buildCommercial(p);
if(p.garage)pub.push({n:'Garage',w:2.4,g:1});
if(p.floors==1){var r2=[];for(var i=0;i<bl;i++)r2.push({n:i?'Bedroom '+(i+1):'Primary Bed',w:2});for(i=0;i<ba;i++)r2.push({n:'Bath',w:1});if(p.office)r2.push({n:'Office',w:1.6});f.push({name:'Ground floor',rows:[pub,r2]});return f}
var g2=[{n:'Utility',w:1},{n:p.office?'Office':'Flex',w:2},{n:'Entry',w:1.4},{n:'Powder',w:1}];
f.push({name:'Ground floor',rows:[pub,g2]});
for(var fl=1;fl<p.floors;fl++){var left=p.floors-fl,nb=Math.ceil(bl/left),nba=Math.max(1,Math.ceil(ba/left));bl-=nb;ba-=nba;var r=[];
for(var j=0;j<nb;j++){r.push({n:bi?'Bedroom '+(bi+1):'Primary Bed',w:2});bi++}
var r3=[];for(j=0;j<nba;j++)r3.push({n:'Bath',w:1});r3.push({n:'Landing',w:1.4});
f.push({name:(fl==1?'Second':'Third')+' floor',rows:[r.length?r:[{n:'Loft',w:2}],r3]})}
return f}
function planSVG(fl,p){var S=10,gnd=fl.name=='Ground floor',W=44+(gnd&&p.garage?20:0),D=p.beds>3?38:32,out=(p.patio&&gnd)||(p.balcony&&!gnd),pad=60,ext=out?80:0,rows=fl.rows,rh=D/rows.length,hall=rows.length>1?40:0,planH=D*S+hall*(rows.length-1);
var tw=W*S+pad*2+ext,th=planH+pad*2+30,s='<svg viewBox="0 0 '+tw+' '+th+'" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">';
s+='<defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#2a5db0" stroke-width=".6"/></pattern></defs>';
s+='<rect width="100%" height="100%" fill="#0b3d91"/><rect width="100%" height="100%" fill="url(#g)"/>';
if(hall)s+='<rect x="'+pad+'" y="'+(pad+rh*S)+'" width="'+W*S+'" height="'+hall+'" fill="#103f86"/>';
function door(x,y,w,opensDown){var transform=opensDown?'translate('+(x+w)+' '+y+') rotate(180)':'translate('+x+' '+y+')';return '<g transform="'+transform+'"><path d="M0 0h'+w+'" fill="none" stroke="#0b3d91" stroke-width="5"/><path d="M0 0v-'+w+'a'+w+' '+w+' 0 0 1 '+w+' '+w+'" fill="none" stroke="#e6f0ff" stroke-width="1.5"/></g>'}
rows.forEach(function(row,ri){var tot=row.reduce(function(a,r){return a+r.w},0),x=0;
row.forEach(function(r,ci){var w=r.w/tot*W,X=pad+x*S,Y=pad+ri*(rh*S+hall),ww=w*S,hh=rh*S,fs=Math.max(7,Math.min(12,ww/(r.n.length*.62)));
s+='<rect class="rm" data-n="'+r.n+'" data-w="'+Math.round(w*SC)+'" data-d="'+Math.round(rh*SC)+'" x="'+X+'" y="'+Y+'" width="'+ww+'" height="'+hh+'" fill="'+(r.g?'#1a4fa8':'none')+'" stroke="#e6f0ff" stroke-width="3"/>';
s+='<text x="'+(X+ww/2)+'" y="'+(Y+hh/2)+'" fill="#e6f0ff" font-size="'+fs+'" text-anchor="middle">'+r.n.toUpperCase()+'</text>';
s+='<text x="'+(X+ww/2)+'" y="'+(Y+hh/2+14)+'" fill="#9fc2ff" font-size="'+Math.min(10,fs)+'" text-anchor="middle">'+Math.round(w*SC)+"' x "+Math.round(rh*SC)+"'</text>";
var doorW=Math.min(30,ww*.45,hh*.4);
if(hall){if(ri%2==0)s+=door(X+(ww-doorW)/2,Y+hh,doorW,false);else s+=door(X+(ww-doorW)/2,Y,doorW,true)}
if(gnd&&r.n=='Entry')s+=door(X+(ww-doorW)/2,Y+hh,doorW,false);
x+=w})});
if(hall)s+='<text x="'+(pad+W*S/2)+'" y="'+(pad+rh*S+hall/2+4)+'" fill="#9fc2ff" font-size="10" text-anchor="middle">HALL · 4\' WIDE</text>';
if(out){var ox=pad+W*S+10,oy=pad+planH/2-25;s+='<rect x="'+ox+'" y="'+oy+'" width="70" height="50" fill="#315f9d" stroke="#e6f0ff" stroke-width="3"/><text x="'+(ox+35)+'" y="'+(oy+23)+'" fill="#e6f0ff" font-size="10" text-anchor="middle">'+(gnd?'PATIO':'BALCONY')+'</text><text x="'+(ox+35)+'" y="'+(oy+38)+'" fill="#9fc2ff" font-size="9" text-anchor="middle">'+Math.round(7*SC)+"' x "+Math.round(5*SC)+"'</text>"}
var by=pad+planH;s+='<line x1="'+pad+'" y1="'+(by+18)+'" x2="'+(pad+W*S)+'" y2="'+(by+18)+'" stroke="#9fc2ff"/><text x="'+(pad+W*S/2)+'" y="'+(by+32)+'" fill="#9fc2ff" font-size="11" text-anchor="middle">'+Math.round(W*SC)+"' - 0\"</text>";
s+='<text x="'+pad+'" y="30" fill="#fff" font-size="15" font-weight="bold">'+fl.name.toUpperCase()+'</text>';
s+='<text x="'+(tw-pad)+'" y="30" fill="#9fc2ff" font-size="11" text-anchor="end">SCALE 1/8" = 1\'</text></svg>';return s}
function buildCommercial(p){var o=p.opts||{},t=p.buildingType,a,b,f=[],i;
p.patio=!!o.outdoor;p.balcony=!!o.terrace&&p.floors>1;
if(t=='office'){a=[{n:'Reception',w:2}];if(o.open)a.push({n:'Open Office',w:3});for(i=1;i<=o.meet;i++)a.push({n:'Meeting Room'+(o.meet>1?' '+i:''),w:1.8});if(o.lounge)a.push({n:'Lounge',w:1.6});
b=[];for(i=1;i<=o.priv;i++)b.push({n:'Office '+i,w:1.2});b.push({n:'Break Room',w:1.6},{n:'Restrooms',w:1.4});if(o.server)b.push({n:'Server Room',w:1.2});b.push({n:'Storage',w:1})}
else if(t=='restaurant'){a=[{n:'Dining',w:1.5+(o.tables||12)/8}];if(o.bar)a.push({n:'Bar',w:1.5});a.push({n:'Waiting',w:1.2});if(o.pdr)a.push({n:'Private Dining',w:2});
b=[{n:'Kitchen',w:2.4},{n:'Prep',w:1.5}];if(o.walkin)b.push({n:'Walk-in Cooler',w:1.2});b.push({n:'Restrooms',w:1.4})}
else if(t=='cafe'){a=[{n:'Cafe Seating',w:1.5+(o.seats||20)/12},{n:'Coffee Counter',w:1.8}];if(o.bakery)a.push({n:'Bakery Case',w:1});if(o.nook)a.push({n:'Book Nook',w:1.4});
b=[{n:'Prep Kitchen',w:2},{n:'Restrooms',w:1.4},{n:'Storage',w:1}];if(o.drive)b.push({n:'Drive-Thru',w:1.3})}
else{a=[{n:'Retail Floor',w:2+(o.aisles||3)*.5}];if(o.window)a.push({n:'Display Window',w:1});a.push({n:'Checkout',w:.8+(o.reg||2)*.5});
b=[];if(o.stock)b.push({n:'Stockroom',w:2});b.push({n:'Staff Room',w:1.4});if(o.restroom)b.push({n:'Restroom',w:1});if(o.fit)b.push({n:'Fitting Rooms',w:1.6})}
for(i=0;i<p.floors;i++)f.push({name:['Ground floor','Second floor','Third floor'][i],rows:[a,b]});return f}
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
s+='<rect y="'+gy+'" width="760" height="'+(420-gy)+'" fill="'+(p.land=='modern'?'#bdb8aa':'url(#gr)')+'"/>';
if(p.land=='modern')for(i=0;i<8;i++)s+='<path d="M0 '+(gy+10+i*10)+'H760" stroke="#8c8778" stroke-opacity=".35"/>';
if(p.land=='wild')for(i=0;i<70;i++)s+='<circle cx="'+((i*131)%760)+'" cy="'+(gy+8+(i*37)%70)+'" r="2.4" fill="'+['#f2b6c9','#fff3a8','#d9c4f2','#ffffff'][i%4]+'"/>';
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
if(p.windowStyle=='dormer'){var dormerX=X+bw/2-40,dormerY=top-50;s+='<polygon points="'+(dormerX-7)+','+(dormerY+27)+' '+(dormerX+40)+','+dormerY+' '+(dormerX+87)+','+(dormerY+27)+' '+(dormerX+78)+','+(top+2)+' '+(dormerX+2)+','+(top+2)+'" fill="'+p.wall+'" stroke="#4d4d4d" stroke-width="3"/><polygon points="'+(dormerX-12)+','+(dormerY+29)+' '+(dormerX+40)+','+(dormerY-3)+' '+(dormerX+92)+','+(dormerY+29)+'" fill="'+p.roofC+'" stroke="#333" stroke-width="3"/><rect x="'+(dormerX+25)+'" y="'+(dormerY+27)+'" width="30" height="24" fill="#f2f2f2" stroke="#555" stroke-width="3"/><rect x="'+(dormerX+29)+'" y="'+(dormerY+30)+'" width="22" height="18" fill="url(#gl)"/><path d="M'+(dormerX+40)+' '+(dormerY+30)+'V'+(dormerY+48)+'" stroke="#f2f2f2" stroke-width="2"/>'}
if(p.garage){s+='<rect x="'+(gx+14)+'" y="'+(gt+16)+'" width="'+(gw-28)+'" height="'+(gy-gt-16)+'" fill="#eceae4" stroke="#0005" stroke-width="2"/>';
for(i=1;i<4;i++)s+='<line x1="'+(gx+14)+'" x2="'+(gx+gw-14)+'" y1="'+(gt+16+i*(gy-gt-16)/4)+'" y2="'+(gt+16+i*(gy-gt-16)/4)+'" stroke="#0004"/>';
for(i=0;i<4;i++)s+='<rect x="'+(gx+22+i*27)+'" y="'+(gt+22)+'" width="22" height="10" fill="url(#gl)" stroke="#0005"/>'}
s+='<rect x="'+(dx-6)+'" y="'+(gy-78)+'" width="56" height="78" fill="#f4f4f4"/><rect x="'+dx+'" y="'+(gy-72)+'" width="44" height="72" fill="'+p.door+'"/><rect x="'+dx+'" y="'+(gy-72)+'" width="44" height="72" fill="url(#wl)"/>';
for(i=0;i<4;i++)s+='<rect x="'+(dx+6+(i%2)*19)+'" y="'+(gy-66+(i>1?32:0))+'" width="13" height="27" fill="#fff" fill-opacity=".1" stroke="#000" stroke-opacity=".35"/>';
s+='<circle cx="'+(dx+37)+'" cy="'+(gy-34)+'" r="2.6" fill="#e8c860"/><rect x="'+(dx-12)+'" y="'+(gy-4)+'" width="68" height="4" fill="#cfc8bb"/>';
if(p.buildingType!='house'){var sn={office:'OFFICE',restaurant:'RESTAURANT',cafe:'CAFE',shop:'SHOP'}[p.buildingType],ac={office:'#6d786f',restaurant:'#b5532f',cafe:'#5b9b80',shop:'#9a8660'}[p.buildingType];s+='<rect x="'+(dx-26)+'" y="'+(gy-96)+'" width="96" height="17" rx="3" fill="'+ac+'"/><text x="'+(dx+22)+'" y="'+(gy-83)+'" font-family="Arial" font-weight="700" font-size="11" fill="#fff" text-anchor="middle">'+sn+'</text>';if(p.buildingType!='office')for(i=0;i<6;i++)s+='<polygon points="'+(dx-8+i*10)+','+(gy-78)+' '+(dx+2+i*10)+','+(gy-78)+' '+(dx+4+i*10)+','+(gy-65)+' '+(dx-6+i*10)+','+(gy-65)+'" fill="'+(i%2?'#fff':ac)+'"/>'}
[X+8,X+66,X+bw-70,X+bw-14].forEach(function(x){s+='<ellipse cx="'+x+'" cy="'+(gy-6)+'" rx="27" ry="19" fill="url(#bs)"/>'});
s+='<ellipse cx="'+(X-74)+'" cy="'+(gy+4)+'" rx="52" ry="8" fill="#000" opacity=".22"/><rect x="'+(X-79)+'" y="'+(gy-72)+'" width="10" height="72" fill="#6b4a2b"/><circle cx="'+(X-74)+'" cy="'+(gy-104)+'" r="40" fill="url(#bs)"/><circle cx="'+(X-98)+'" cy="'+(gy-80)+'" r="28" fill="url(#bs)"/><circle cx="'+(X-50)+'" cy="'+(gy-82)+'" r="30" fill="url(#bs)"/>';
s+='<rect x="'+(X+tw+52)+'" y="'+(gy-50)+'" width="7" height="50" fill="#6b4a2b"/><circle cx="'+(X+tw+55)+'" cy="'+(gy-74)+'" r="30" fill="url(#bs)"/>';
if(nt)s+='<rect width="760" height="420" fill="#07102e" opacity=".4"/>';else if(tod=='sunset')s+='<rect width="760" height="420" fill="#ff7a30" opacity=".14"/>';
var ww=p.style=='modern'?74:58,sh=(p.style=='farmhouse'||p.style=='traditional');
function wn(x,y,w,h){var cx=x+w/2,cy=y+h/2,r='';
if(nt)r+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(w+6)+'" fill="url(#gw)"/>';
if(p.windowStyle=='circle'){var cr=Math.min(w,h)*.46;return r+'<circle cx="'+cx+'" cy="'+cy+'" r="'+(cr+4)+'" fill="#f2f2f2" stroke="#555" stroke-width="2"/><circle cx="'+cx+'" cy="'+cy+'" r="'+cr+'" fill="url(#gl)"/><path d="M'+(cx-cr)+' '+cy+'H'+(cx+cr)+'M'+cx+' '+(cy-cr)+'V'+(cy+cr)+'" stroke="#f2f2f2" stroke-width="3"/>'}
if(sh)r+='<rect x="'+(x-16)+'" y="'+(y-3)+'" width="12" height="'+(h+6)+'" fill="'+p.roofC+'" stroke="#0005"/><rect x="'+(x+w+4)+'" y="'+(y-3)+'" width="12" height="'+(h+6)+'" fill="'+p.roofC+'" stroke="#0005"/>';
if(p.windowStyle=='oriel')r+='<polygon points="'+(x-8)+','+(y+7)+' '+x+','+y+' '+x+','+(y+h)+' '+(x-8)+','+(y+h-7)+'" fill="'+p.roofC+'" stroke="#555"/><polygon points="'+(x+w)+','+y+' '+(x+w+8)+','+(y+7)+' '+(x+w+8)+','+(y+h-7)+' '+(x+w)+','+(y+h)+'" fill="'+p.roofC+'" stroke="#555"/>';
if(p.windowStyle=='egress')r+='<rect x="'+(x-5)+'" y="'+(y+h+6)+'" width="'+(w+10)+'" height="10" fill="#aaa" stroke="#555"/><path d="M'+(x+3)+' '+(y+h+6)+'l8 10m8-10l8 10m8-10l8 10" stroke="#555" stroke-width="2"/>';
r+='<rect x="'+(x-3)+'" y="'+(y-3)+'" width="'+(w+6)+'" height="'+(h+6)+'" fill="#f2f2f2"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#gl)"/><polygon points="'+x+','+(y+h)+' '+x+','+(y+h*.45)+' '+(x+w*.55)+','+y+' '+(x+w*.8)+','+y+'" fill="#fff" opacity=".3"/>';
if(p.windowStyle=='slider')r+='<path d="M'+cx+' '+y+'V'+(y+h)+'" stroke="#f2f2f2" stroke-width="3"/>';
if(p.windowStyle=='egress')r+='<path d="M'+x+' '+(y+h*.72)+'H'+(x+w)+'" stroke="#f2f2f2" stroke-width="2.5"/>';
if(p.windowStyle=='oriel')r+='<path d="M'+(x-7)+' '+(y+h+3)+'L'+(x+w/2)+' '+(y+h+9)+'L'+(x+w+7)+' '+(y+h+3)+'" fill="none" stroke="#e6e6e6" stroke-width="5"/>';
if(p.windowStyle=='fixed')r+='<rect x="'+(x-7)+'" y="'+(y+h+3)+'" width="'+(w+14)+'" height="5" fill="#e6e6e6" stroke="#0003"/>';
return r}
for(f=0;f<p.floors;f++)for(i=0;i<3;i++){if(f==0&&i==1)continue;var winW=p.windowStyle=='egress'?ww*1.15:ww,winH=p.windowStyle=='egress'?58:50;s+=wn(X+bw/3*(i+.5)-winW/2,gy-fh*(f+1)+20,winW,winH)}
if(p.balcony&&p.floors>1){var balconyY=gy-fh*Math.min(2,p.floors)+72,bx=X+bw/2-52;s+='<rect x="'+bx+'" y="'+balconyY+'" width="104" height="9" fill="#cfc8bb" stroke="#51483e" stroke-width="2"/><path d="M'+bx+' '+balconyY+'V'+(balconyY-27)+'H'+(bx+104)+'V'+balconyY+'M'+(bx+26)+' '+(balconyY-27)+'V'+balconyY+'M'+(bx+52)+' '+(balconyY-27)+'V'+balconyY+'M'+(bx+78)+' '+(balconyY-27)+'V'+balconyY+'" fill="none" stroke="#f4f4f4" stroke-width="3"/>'}
if(p.patio)s+='<polygon points="'+(dx+52)+','+gy+' '+(dx+127)+','+gy+' '+(dx+157)+',390 '+(dx+25)+',390" fill="#b7aa91" stroke="#817762" stroke-width="2"/>';
if(nt)s+='<circle cx="'+(dx-12)+'" cy="'+(gy-54)+'" r="34" fill="url(#gw)"/><rect x="'+(dx-15)+'" y="'+(gy-58)+'" width="6" height="9" fill="#ffe9a8"/>';
return s+'<text x="16" y="408" font-family="Courier New,monospace" font-size="12" fill="'+(nt?'#cfe8d8':'#1f3b1f')+'">FRONT ELEVATION · '+p.style.toUpperCase()+'</text></svg>'}
var AUTO=false,CAM={th:.42,ph:1.32,r:135},RN=null,RAF=0;
function stop3D(){cancelAnimationFrame(RAF);if(RN){RN.dispose();RN=null}}
function tx(kind,col){var c=document.createElement('canvas');c.width=c.height=128;var g=c.getContext('2d'),x,y,i;g.fillStyle=col;g.fillRect(0,0,128,128);
if(kind=='brick'){g.strokeStyle='rgba(235,225,205,.55)';g.lineWidth=2;for(y=0;y<128;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke();for(x=(y/16%2)*32;x<128;x+=64){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+16);g.stroke()}}}
else if(kind=='sid'){for(y=0;y<128;y+=16){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,y,128,3);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,y+3,128,2)}}
else if(kind=='shg'){g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=2;for(y=0;y<128;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke();for(x=(y/16%2)*16;x<128;x+=32){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+16);g.stroke()}}}
else if(kind=='grass'){for(i=0;i<2200;i++){x=Math.random()*128;y=Math.random()*128;g.strokeStyle=i%3?'rgba(24,48,19,.22)':'rgba(199,190,118,.2)';g.lineWidth=.7;g.beginPath();g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*2,y-2-Math.random()*3);g.stroke()}}
else if(kind=='pave'){g.strokeStyle='rgba(48,45,39,.28)';g.lineWidth=1;for(y=0;y<=128;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke()}for(y=16;y<128;y+=32)for(x=0;x<=128;x+=32){g.beginPath();g.moveTo(x,y-16);g.lineTo(x,y+16);g.stroke()}}
else{for(i=0;i<2200;i++){g.fillStyle=(i%2?'rgba(0,0,0,':'rgba(255,255,255,')+(Math.random()*.12)+')';g.fillRect(Math.random()*128,Math.random()*128,1+Math.random()*2,1+Math.random()*2)}}
var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function mount3D(){var el=$('v3');if(!window.THREE){el.innerHTML='<p style="color:#fff;padding:20px">The 3D engine could not load.</p>';return}
var T=THREE,w=el.clientWidth||600,h=440,k=SK[tod],nt=tod=='night',R=RN=new T.WebGLRenderer({antialias:true}),f;
R.setSize(w,h);R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;el.appendChild(R.domElement);
var S=new T.Scene(),skyCanvas=document.createElement('canvas');skyCanvas.width=512;skyCanvas.height=256;var skyCtx=skyCanvas.getContext('2d'),skyGrad=skyCtx.createLinearGradient(0,0,0,256);skyGrad.addColorStop(0,nt?'#101a38':tod=='sunset'?'#ee916c':'#70b3e3');skyGrad.addColorStop(.58,nt?'#273653':tod=='sunset'?'#f5c095':'#c5ddec');skyGrad.addColorStop(1,nt?'#41485a':tod=='sunset'?'#efc59c':'#f0e9d8');skyCtx.fillStyle=skyGrad;skyCtx.fillRect(0,0,512,256);
if(!nt){for(var cloud=0;cloud<5;cloud++){var cx=50+cloud*105,cy=48+(cloud%2)*34,cg=skyCtx.createRadialGradient(cx,cy,4,cx,cy,50);cg.addColorStop(0,'rgba(255,255,255,.38)');cg.addColorStop(1,'rgba(255,255,255,0)');skyCtx.fillStyle=cg;skyCtx.fillRect(cx-50,cy-22,100,44)}}
var sky=new T.CanvasTexture(skyCanvas);sky.mapping=T.EquirectangularReflectionMapping;sky.encoding=T.sRGBEncoding;S.background=sky;
var cam=new T.PerspectiveCamera(45,w/h,1,1000);
S.add(new T.HemisphereLight(nt?0x53658f:0xddeaff,0x69734e,nt?.45:.7));
var fill=new T.DirectionalLight(nt?0x7182bd:0xe5edff,nt?.18:.25);fill.position.set(-55,45,-55);S.add(fill);
var sun=new T.DirectionalLight(nt?0xb0c1ff:tod=='sunset'?0xffc18a:0xfff3dc,nt?.5:1.15);sun.position.set(tod=='sunset'?-90:70,90,80);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00025;sun.shadow.radius=5;
var sc=sun.shadow.camera;sc.left=sc.bottom=-75;sc.right=sc.top=75;sc.far=350;S.add(sun);
var M=function(c,o){return new T.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{}))};
var add=function(g,m,x,y,z){var o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;S.add(o);return o};
var Bx=function(a,b,c){return new T.BoxGeometry(a,b,c)};
var gw=P.garage?22:0,mw=44,W=mw+gw,D=P.beds>3?38:32,H=10*P.floors,x0=-W/2,mx=x0+mw/2,gx=x0+mw+gw/2,fz=D/2;
var kind=P.style=='traditional'?'brick':(P.style=='farmhouse'||P.style=='cabin')?'sid':'stu';
var wt=tx(kind,P.wall);wt.repeat.set(4,P.floors*1.4);var wm=M(0xffffff,{map:wt,bumpMap:wt,bumpScale:kind=='sid'?.22:.1,transparent:true,opacity:1,depthWrite:false});
var land=P.land||'lush',grass=land=='modern'?tx('pave','#a9a597'):tx('grass','#607d4c');grass.repeat.set(land=='modern'?60:36,land=='modern'?60:36);var gr=add(new T.PlaneGeometry(700,700),M(0xffffff,{map:grass,roughness:1}),0,0,0);gr.rotation.x=-Math.PI/2;gr.castShadow=false;
var paving=tx('pave','#b0a895');paving.repeat.set(2,7);
function flat(a,b,x,z,c){var o=add(new T.PlaneGeometry(a,b),M(c==0xd8d0c0||c==0x9a9892?0xffffff:c,{map:paving,roughness:.95}),x,.06,z);o.rotation.x=-Math.PI/2;o.castShadow=false}
flat(5,26,mx,fz+13,0xd8d0c0);if(gw)flat(gw-3,40,gx,fz+24,0x9a9892);
var interiorFloor=M(0xc9c0ae,{roughness:.95}),interiorWall=M(0xd5ddd6,{roughness:.9});
var FURN=!$('t-furniture')||$('t-furniture').checked;
function fx(a,b,c,col,x,y,z){return add(Bx(a,b,c),M(col,{roughness:.8}),x,y+b/2,z)}
function furnish(n,cx,y,cz,w,d){var i,k;
if(/Bed|Primary/.test(n)){if(w>3){fx(Math.min(5,w-1.5),1.4,6,0x7d9a86,cx,y,cz-d/2+4);fx(Math.min(4,w-2.5),.6,1.1,0xffffff,cx,y+1.4,cz-d/2+1.5)}}
else if(/Living|Lounge|Waiting|Reception/.test(n)){fx(Math.min(8,w-2),1.5,2.6,0x8fae93,cx,y,cz-d/2+2);fx(3,.9,3,0xcdb891,cx,y,cz)}
else if(/Kitchen|Prep|Break/.test(n)){fx(w-2,3,1.6,0xdcd6c6,cx,y,cz-d/2+1.4);fx(Math.max(2,w*.4),2.8,2.2,0x8a948f,cx,y,cz+1)}
else if(/Dining|Seating|Private/.test(n)){k=Math.max(1,Math.min(6,Math.floor(w/5)));for(i=0;i<k;i++)fx(3,2.2,3,0xb8946a,cx-w/2+(i+.5)*w/k,y,cz)}
else if(/Bath|Restroom|Powder/.test(n)){if(w>=4)fx(2.6,1.2,Math.min(5,d-2),0xffffff,cx-w/2+2,y,cz)}
else if(/Office/.test(n)){k=Math.max(1,Math.floor(w/4.5));for(i=0;i<k;i++)fx(3,1.4,2,0xb9a98e,cx-w/2+(i+.5)*w/k,y,cz)}
else if(/Meeting/.test(n)){fx(Math.min(8,w-2),1.4,3.5,0x9c8b6e,cx,y,cz)}
else if(/Retail/.test(n)){k=Math.max(1,Math.min(8,Math.floor(w/4)));for(i=0;i<k;i++)fx(.9,4,d-5,0x9aa79e,cx-w/2+(i+.5)*w/k,y,cz)}
else if(/Stock|Storage|Server|Cooler|Staff/.test(n)){fx(w-2,4,1.2,0x8d887d,cx,y,cz-d/2+1.2)}
else if(/Bar|Counter|Checkout|Bakery|Display|Fitting|Nook|Drive/.test(n)){fx(Math.max(1.5,w-1.5),3,1.5,0x8d7a5f,cx,y,cz)}}
for(var level=0;level<P.floors;level++){
var floor=new T.Mesh(new T.PlaneGeometry(mw-1,D-1),interiorFloor);floor.rotation.x=-Math.PI/2;floor.position.set(mx,level*10+.25,0);floor.receiveShadow=true;S.add(floor);
var rows=FL[level]&&FL[level].rows||[],rowDepth=(D-2)/Math.max(1,rows.length);
rows.forEach(function(row,rowIndex){
var rooms=row.filter(function(room){return !room.g}),total=rooms.reduce(function(sum,room){return sum+room.w},0),used=0,z=-D/2+1+rowIndex*rowDepth;
rooms.slice(0,-1).forEach(function(room){used+=room.w;var divider=new T.Mesh(Bx(.2,8.4,rowDepth-.35),interiorWall);divider.position.set(x0+1+(mw-2)*used/total,level*10+4.5,z+rowDepth/2);divider.castShadow=true;divider.receiveShadow=true;S.add(divider)});
if(rowIndex<rows.length-1){var crossWall=new T.Mesh(Bx(mw-2,8.4,.2),interiorWall);crossWall.position.set(mx,level*10+4.5,z+rowDepth);crossWall.castShadow=true;crossWall.receiveShadow=true;S.add(crossWall)}
var acc=0;rooms.forEach(function(room){var rw=(mw-2)*room.w/total;if(FURN)furnish(room.n,x0+1+(mw-2)*acc/total+rw/2,level*10+.4,z+rowDepth/2,rw,rowDepth);acc+=room.w});
})}
add(Bx(mw,H,D),wm,mx,H/2,0);if(gw)add(Bx(gw,10,26),wm,gx,5,fz-9);
var trim=M(P.style=='modern'?0x474b4e:0xe7e1d4),stone=M(0x8d887d),base=M(0x77766e);
add(Bx(mw+1.4,1.1,D+1.4),base,mx,.1,0);
add(Bx(mw+.8,.55,.7),trim,mx,.7,fz+.12);add(Bx(mw+.8,.55,.7),trim,mx,.7,-fz-.12);
[-mw/2+.35,mw/2-.35].forEach(function(offset){add(Bx(.55,H-.9,.5),trim,mx+offset,H/2,fz+.12)});
if(kind=='sid')for(var course=1.5;course<H;course+=2){add(Bx(mw,.07,.08),M(0xddd3c4),mx,course,fz+.16);add(Bx(mw,.07,.08),M(0xddd3c4),mx,course,-fz-.16)}
for(f=1;f<P.floors;f++)add(Bx(mw+.8,.7,D+.8),M(0xf4f4f4),mx,10*f,0);
var rt=tx('shg',P.roofC);rt.repeat.set(5,5);var rm=M(0xffffff,{map:rt,bumpMap:rt,bumpScale:.12,roughness:.92,transparent:true,opacity:1,depthWrite:false}),shellMaterials=[wm,rm],gm=M(nt?0xffe08a:0x9ec7db,{roughness:.2,metalness:.05,emissive:nt?0xffc24a:0x000000,emissiveIntensity:nt?.65:0}),fm=M(0xf4f4f4);
function roof(a,d,y,x,z){if(P.roof=='flat'){add(Bx(a+2.5,1.4,d+2.5),rm,x,y+.7,z);return}
var rh=Math.min(13,a*.3);
if(P.roof=='hip'){var g=new T.ConeGeometry(1,rh,4);g.rotateY(Math.PI/4);var c=add(g,rm,x,y+rh/2,z);c.scale.set((a+3)/1.414,1,(d+3)/1.414)}
else{var sh=new T.Shape();sh.moveTo(-(a/2+1.5),0);sh.lineTo(a/2+1.5,0);sh.lineTo(0,rh);sh.closePath();add(new T.ExtrudeGeometry(sh,{depth:d+3,bevelEnabled:false}),rm,x,y,z-(d+3)/2)}}
roof(mw,D,H,mx,0);if(gw)roof(gw,26,10,gx,fz-9);
if(P.roof!='flat'){add(Bx(mw+4,.55,.8),trim,mx,H-.15,fz+1.4);add(Bx(mw+4,.55,.8),trim,mx,H-.15,-fz-1.4)}
if(P.windowStyle=='dormer'){var dormerZ=fz*.38,ds=new T.Shape();ds.moveTo(-6,0);ds.lineTo(6,0);ds.lineTo(0,4);ds.closePath();add(Bx(10,6,1.4),wm,mx,H+3,dormerZ);add(new T.ExtrudeGeometry(ds,{depth:9,bevelEnabled:false}),rm,mx,H+6,dormerZ-4.5);add(Bx(4,4,.35),fm,mx,H+3.2,dormerZ+.9);add(Bx(3.5,3.5,.45),gm,mx,H+3.2,dormerZ+1.15);add(Bx(.25,3.5,.5),fm,mx,H+3.2,dormerZ+1.3)}
if(P.balcony&&P.floors>1){var balconyFloor=Math.min(1,P.floors-1),by=10*balconyFloor+1.4,bz=fz+3.4,bm=M(0xcfc8bb),rail=M(0xf4f4f4);add(Bx(19,.8,7),bm,mx,by,bz);add(Bx(19,.5,.5),rail,mx,by+3.8,bz+3.2);[-8,-4,0,4,8].forEach(function(offset){add(Bx(.35,4,.35),rail,mx+offset,by+1.8,bz+3.2)})}
if(P.patio)add(Bx(24,.35,12),M(0xb7aa91),mx+16,.2,fz+10);
if(P.roof!='flat')add(Bx(3,14,3),M(0xffffff,{map:tx('brick','#8a4a38')}),mx+mw/2-8,H+7,-5);
function wn(x,y,z,ry){var g=new T.Group(),style=P.windowStyle;
if(style=='circle'){var pane=new T.Mesh(new T.CylinderGeometry(2.1,2.1,.25,32),gm);pane.rotation.x=Math.PI/2;pane.position.z=.45;g.add(pane);g.add(new T.Mesh(new T.TorusGeometry(2.45,.35,10,32),fm));g.add(new T.Mesh(Bx(.25,4.8,.45),fm));g.add(new T.Mesh(Bx(4.8,.25,.45),fm))}
else{var ww=style=='egress'?5.4:4.4,hh=style=='egress'?6.8:5.4;g.add(new T.Mesh(Bx(ww+1.4,hh+1.4,.5),fm),new T.Mesh(Bx(ww,hh,.7),gm));var sill=new T.Mesh(Bx(ww+1.8,.3,1.1),fm);sill.position.set(0,-hh/2-.55,.35);g.add(sill);if(style=='slider'){var stile=new T.Mesh(Bx(.22,hh,.8),fm);g.add(stile)}if(style=='egress'){var well=new T.Mesh(Bx(ww+2,.8,1.8),stone);well.position.set(0,-hh/2-1,.9);g.add(well);for(var bar=-1;bar<=1;bar++){var grate=new T.Mesh(Bx(ww+1,.18,.3),fm);grate.position.set(0,-hh/2-1.1+bar*.3,.9);g.add(grate)}}if(style=='oriel'){var leftSide=new T.Mesh(Bx(.5,hh,2.2),fm),rightSide=new T.Mesh(Bx(.5,hh,2.2),fm),baySill=new T.Mesh(Bx(ww+1,.5,2.4),fm);leftSide.position.set(-ww/2-.1,0,.8);rightSide.position.set(ww/2+.1,0,.8);baySill.position.set(0,-hh/2,.8);g.add(leftSide,rightSide,baySill)}}
g.position.set(x,y,z);g.rotation.y=ry;S.add(g)}
for(f=0;f<P.floors;f++){var y=10*f+5.6;[-14,0,14].forEach(function(d){if(f==0&&d==0)return;wn(mx+d,y,fz+.2,0);wn(mx+d,y,-fz-.2,Math.PI)});[-8,8].forEach(function(z){wn(x0-.2,y,z,-Math.PI/2);if(!gw)wn(x0+mw+.2,y,z,Math.PI/2)})}
add(Bx(6.2,9,.5),fm,mx,4.5,fz+.15);add(Bx(5,8.4,.7),M(P.door),mx,4.2,fz+.3);add(Bx(1.65,3.3,.12),gm,mx-1.45,5.4,fz+.72);
for(var panelY of [2.7,5.1])add(Bx(3.3,1.45,.12),M(P.door=='#3a3f45'?0x303438:0x71452f),mx,4.2+panelY-4.2,fz+.72);
add(new T.SphereGeometry(.28,16,12),M(0xe8c860,{metalness:.65,roughness:.3}),mx+1.7,4,fz+.8);add(Bx(9,.7,3),stone,mx,.35,fz+1.5);add(Bx(7,.5,2.2),stone,mx,1.05,fz+2.7);
if(gw){var gz=fz+4.3;add(Bx(17,8,.5),M(0xeceae4),gx,4,gz);for(var i=1;i<4;i++)add(Bx(17,.25,.6),M(0x9a9a9a),gx,i*2,gz+.05)}
if(nt){var pl=new T.PointLight(0xffc870,.8,40);pl.position.set(mx-5,6,fz+3);S.add(pl);add(new T.SphereGeometry(.5,8,8),M(0xffe9a8,{emissive:0xffd070,emissiveIntensity:1}),mx-3.5,6.5,fz+.8)}
[[x0-16,-9],[W/2+16,16],[x0-8,26]].forEach(function(t){add(new T.CylinderGeometry(.8,1.1,7,12),M(0x6b4a2b),t[0],3.5,t[1]);[[0,10,0,6],[3,13,1,4.5],[-3,12,-1,4.8],[1,15,-2,3.8],[0,9,3,3.8]].forEach(function(c,idx){var foliage=new T.Mesh(new T.SphereGeometry(c[3],18,14),M([0x315c2e,0x3f6d34,0x4b7839,0x386432,0x527d3d][idx],{roughness:1}));foliage.scale.set(.9,1.05,.8);foliage.position.set(t[0]+c[0],c[1],t[1]+c[2]);foliage.castShadow=true;S.add(foliage)})});
for(var bx=x0+5;bx<x0+mw-3;bx+=8){if(Math.abs(bx-mx)<8)continue;var bush=new T.Mesh(new T.SphereGeometry(2.2,14,10),M(0x3f682f,{roughness:1}));bush.scale.set(1,.65,.8);bush.position.set(bx,1.6,fz+2);bush.castShadow=true;S.add(bush)}
if(land=='wild'){var fc=[0xf2b6c9,0xfff3a8,0xd9c4f2,0xffffff];for(var q=0;q<110;q++){var fa=q*2.4,fr=30+(q*7)%45,fo=new T.Mesh(new T.SphereGeometry(.45,6,5),M(fc[q%4],{roughness:.8}));fo.position.set(Math.cos(fa)*fr*1.2,.6,Math.sin(fa)*fr*.9+12);S.add(fo)}}
if(land=='modern'){for(var q2=0;q2<5;q2++)add(Bx(5,.3,5),M(0xcfc9ba),mx,.2,fz+8+q2*7);[-1,1].forEach(function(sd){add(Bx(8,1.6,3),M(0x8d887d),mx+sd*14,.8,fz+4)})}
var pt={};
el.addEventListener('pointerdown',function(e){el.setPointerCapture(e.pointerId);pt[e.pointerId]=[e.clientX,e.clientY];el.style.cursor='grabbing'});
el.addEventListener('pointermove',function(e){var q=pt[e.pointerId];if(!q)return;var ids=Object.keys(pt);
if(ids.length==1){CAM.th-=(e.clientX-q[0])*.008;CAM.ph=Math.max(.25,Math.min(1.5,CAM.ph-(e.clientY-q[1])*.006))}
else{var o=pt[ids[0]==e.pointerId?ids[1]:ids[0]],d0=Math.hypot(q[0]-o[0],q[1]-o[1]),d1=Math.hypot(e.clientX-o[0],e.clientY-o[1]);if(d1)CAM.r=Math.max(50,Math.min(260,CAM.r*d0/d1))}
pt[e.pointerId]=[e.clientX,e.clientY]});
['pointerup','pointercancel'].forEach(function(n){el.addEventListener(n,function(e){delete pt[e.pointerId];el.style.cursor='grab'})});
el.addEventListener('wheel',function(e){e.preventDefault();CAM.r=Math.max(50,Math.min(260,CAM.r*(1+e.deltaY*.001)))},{passive:false});
(function loop(){RAF=requestAnimationFrame(loop);if(AUTO&&!Object.keys(pt).length)CAM.th+=.004;var r=CAM.r,sp=Math.sin(CAM.ph),shellOpacity=Math.max(.12,Math.min(1,.12+(r-50)/70*.88));shellMaterials.forEach(function(material){material.opacity=shellOpacity});cam.position.set(r*sp*Math.sin(CAM.th),H/2+r*Math.cos(CAM.ph),r*sp*Math.cos(CAM.th));cam.lookAt(0,H/2,0);R.render(S,cam)})();}
var SW=['#f5f5ef','#e8ddc8','#ded8ca','#c9d3ce','#a8c7b5','#b9c6bd','#aeb5b0','#929b95','#777f7a','#686f6b','#d0c7b6'];
var STY={modern:['Modern','🏙️','#5b9b80'],farmhouse:['Farmhouse','🌾','#b7a98d'],mediterranean:['Mediterranean','🌴','#83aa94'],cabin:['Cabin','🌲','#78857d'],traditional:['Traditional','🏡','#909992']};
var PAL={modern:['#c9d3ce','#777f7a','#59635d','flat'],farmhouse:['#f5f3eb','#b6ad9d','#8b806d','gable'],mediterranean:['#e8ddc8','#899b8f','#6d786f','hip'],cabin:['#c8b99f','#77766e','#5f665f','gable'],traditional:['#d6d6cf','#717873','#515c55','gable']};
var SK={day:['#8ec5f0','#e9f4fb','#fff4b8','#9cc7e4'],sunset:['#ff8a5c','#ffd9a0','#fff1b0','#ffd88a'],night:['#0e1a3a','#33477a','#e8ecff','#ffe28a']};
var WINDOW_TYPES={circle:'Circle window',egress:'Egress window',dormer:'Dormer window',oriel:'Oriel window',slider:'Two-panel slider window',fixed:'Fixed window'};
var BUILDINGS=[
{name:'🏠 House',prompt:'A modern two-story house with 4 bedrooms, 3 bathrooms, a garage and a flat roof, gray walls.'},
{name:'🏢 Office',prompt:'A modern two-story office building with reception, open workspaces, meeting rooms, a break room and restrooms.'},
{name:'🍽️ Restaurant',prompt:'A modern one-story restaurant with a dining room, kitchen, bar, storage and restrooms.'},
{name:'☕ Cafe',prompt:'A cozy one-story cafe with customer seating, a coffee counter, prep kitchen and restrooms.'},
{name:'🛍️ Shop',prompt:'A modern one-story shop with a retail floor, checkout, stockroom and staff room.'}
];
var LAB=['🌾 Farmhouse','🌴 Mediterranean','🌲 Cabin','🧱 Brick 3-story'];
var TYPE_OPTS={
office:{title:'🏢 Office options',steppers:[{k:'priv',l:'🚪 Private offices',v:2,min:0,max:8},{k:'meet',l:'🗣️ Meeting rooms',v:1,min:1,max:4}],toggles:[{k:'open',l:'🖥️ Open workspace',v:1},{k:'lounge',l:'🛋️ Lounge'},{k:'server',l:'🗄️ Server room'},{k:'terrace',l:'🌿 Terrace (2+ floors)'}]},
restaurant:{title:'🍽️ Restaurant options',steppers:[{k:'tables',l:'🍽️ Dining tables',v:12,min:4,max:40,step:2}],toggles:[{k:'bar',l:'🍸 Bar',v:1},{k:'pdr',l:'🥂 Private dining'},{k:'walkin',l:'❄️ Walk-in cooler',v:1},{k:'outdoor',l:'🌿 Outdoor patio'}]},
cafe:{title:'☕ Cafe options',steppers:[{k:'seats',l:'💺 Seats',v:20,min:6,max:60,step:2}],toggles:[{k:'bakery',l:'🥐 Bakery case',v:1},{k:'nook',l:'📚 Book nook'},{k:'drive',l:'🚗 Drive-thru'},{k:'outdoor',l:'🌿 Outdoor seating'}]},
shop:{title:'🛍️ Shop options',steppers:[{k:'aisles',l:'🛒 Aisles',v:3,min:1,max:8},{k:'reg',l:'💳 Checkouts',v:2,min:1,max:4}],toggles:[{k:'window',l:'🪟 Display window',v:1},{k:'stock',l:'📦 Stockroom',v:1},{k:'restroom',l:'🚻 Customer restroom',v:1},{k:'fit',l:'👗 Fitting rooms'}]}};
function optDefaults(t){var c=TYPE_OPTS[t],o={};if(c)c.steppers.concat(c.toggles).forEach(function(x){o[x.k]=x.v||0});return o}
var P,FL,tab='look',tod='day',fi=0,SC=1;
function $(i){return document.getElementById(i)}
function all(s){return [].slice.call(document.querySelectorAll(s))}
function chooseWindowStyle(style){P.windowStyle=style;var source=$('desc').value;if(style=='dormer'){P.roof='gable';source=source.replace(/\b(?:flat|hip|gable|pitched)\s+roof\b/gi,'gable roof')}
var desc=source.replace(/\b(?:circle|circular|round|egress|dormer|oriel|two[- ]panel slider|slider|fixed)\s+windows?\b/gi,'').replace(/\s+/g,' ').replace(/\s+([,.;])/g,'$1').replace(/[,. ;]+\s*$/,'').trim();
$('desc').value=(desc?desc+', ':'')+WINDOW_TYPES[style].toLowerCase()+'s';render()}
function calc(){var rh=(P.beds>3?38:32)/2,tot=0,W=44+(P.garage?20:0);
FL.forEach(function(f){f.rows.forEach(function(row,ri){var t=row.reduce(function(a,r){return a+r.w},0),wu=(ri==0&&f.name=='Ground floor')?W:44;row.forEach(function(r){if(!r.g)tot+=r.w/t*wu*rh})})});return Math.round(tot/10)*10}
function setCtl(){['floors','beds','baths'].forEach(function(k){$('v-'+k).textContent=P[k]});
$('t-garage').checked=P.garage;$('t-office').checked=P.office;
$('t-balcony').checked=P.balcony;$('t-patio').checked=P.patio;$('t-balcony').disabled=P.floors<2;
all('.window-type').forEach(function(b){var selected=b.dataset.windowStyle==P.windowStyle;b.classList.toggle('on',selected);b.setAttribute('aria-pressed',selected)});
all('[data-residential]').forEach(function(el){el.hidden=P.buildingType!='house'});
all('.chip').forEach(function(b){var selected=b.dataset.type==P.buildingType;b.classList.toggle('on',selected);b.setAttribute('aria-pressed',selected)});
all('.sty').forEach(function(b){b.classList.toggle('on',b.dataset.s==P.style)});
all('[data-roof]').forEach(function(b){b.classList.toggle('on',b.dataset.roof==P.roof)});
all('.sw').forEach(function(b){b.classList.toggle('on',b.dataset.c==P.wall)});
all('[data-tab]').forEach(function(b){b.classList.toggle('on',b.dataset.tab==tab)});
all('[data-land]').forEach(function(b){b.classList.toggle('on',b.dataset.land==P.land)});renderTypeOpts()}
function renderTypeOpts(){var box=$('type-options'),c=TYPE_OPTS[P.buildingType];box.hidden=!c;if(!c)return;
var key=P.buildingType+JSON.stringify(P.opts);if(box.dataset.k==key)return;box.dataset.k=key;
box.innerHTML='<h2>'+c.title+'</h2>'+c.steppers.map(function(s){var st=s.step||1;return '<div class="ctl"><span>'+s.l+'</span><div class="st"><button data-ok="'+s.k+'" data-od="-'+st+'" aria-label="Decrease">−</button><b>'+P.opts[s.k]+'</b><button data-ok="'+s.k+'" data-od="'+st+'" aria-label="Increase">+</button></div></div>'}).join('')+'<div class="otg">'+c.toggles.map(function(t){return '<label class="tg"><input type="checkbox" data-otoggle="'+t.k+'"'+(P.opts[t.k]?' checked':'')+'><span>'+t.l+'</span></label>'}).join('')+'</div>'}
function render(){try{draw()}catch(e){console.error(e);stop3D();var v=$('view');if(v)v.innerHTML='<div class="err"><b>Could not draw this design.</b><br>'+String(e&&e.message||e)+'</div>'}}
function draw(){stop3D();FL=build(P);if(fi>=FL.length)fi=0;var raw=calc(),tgt=P.sqft||Math.round(raw/100)*100;SC=Math.sqrt(tgt/Math.max(raw,1));$('v-sqft').textContent=tgt;setCtl();
var rooms=0;FL.forEach(function(f){f.rows.forEach(function(r){rooms+=r.length})});
var roomStat=P.buildingType=='house'?'<b>'+P.beds+' bd / '+P.baths+' ba</b><span>bedrooms / bathrooms</span>':'<b>'+rooms+' zones</b><span>planned spaces</span>';
$('stats').innerHTML='<div class="stat"><b>~'+tgt.toLocaleString()+'</b><span>sq ft floor area</span></div><div class="stat"><b>'+P.floors+'</b><span>floor'+(P.floors>1?'s':'')+' · '+rooms+' rooms</span></div><div class="stat">'+roomStat+'</div><div class="stat"><b>'+P.roof.charAt(0).toUpperCase()+P.roof.slice(1)+'</b><span>roof type · '+STY[P.style][1]+' '+STY[P.style][0]+'</span></div>';
var h,info;
if(tab=='look'){h='<div class="wrap">'+elevSVG(P)+'</div><div class="pills">'+['day','sunset','night'].map(function(t){return '<button data-tod="'+t+'" class="'+(t==tod?'on':'')+'">'+({day:'☀️ Day',sunset:'🌇 Sunset',night:'🌙 Night'})[t]+'</button>'}).join('')+'</div>';info='Try the time-of-day buttons, or change anything in the controls.'}
else if(tab=='3d'){h='<div class="v3" id="v3"></div><div class="pills">'+['day','sunset','night'].map(function(t){return '<button data-tod="'+t+'" class="'+(t==tod?'on':'')+'">'+({day:'☀️ Day',sunset:'🌇 Sunset',night:'🌙 Night'})[t]+'</button>'}).join('')+'<button data-act="rot" class="'+(AUTO?'on':'')+'">🔄 Auto-rotate</button><button data-act="reset">↺ Reset view</button></div>';info='Drag to look around · zoom in to see inside the house.'}else{h='<div class="pills">'+(FL.length>1?FL.map(function(f,i){return '<button type="button" data-fl="'+i+'" class="'+(i==fi?'on':'')+'">'+f.name+'</button>'}).join(''):'')+'<button type="button" data-act="download">⬇️ Download blueprint</button></div><div class="wrap">'+planSVG(FL[fi],P)+'</div>';info='Hover or tap a room to see its size.'}
$('view').innerHTML=h;$('info').innerHTML=info;if(tab=='3d')mount3D();
$('view').classList.remove('pop');void $('view').offsetWidth;$('view').classList.add('pop')}
function show(t){var w=+t.dataset.w,d=+t.dataset.d;$('info').innerHTML='<b>'+t.dataset.n+'</b> · '+w+"' × "+d+"' · about "+(w*d)+' sq ft'}
function downloadBlueprint(){var gap=24,width=0,height=0,floors=FL.map(function(fl){var svg=planSVG(fl,P),viewBox=svg.match(/<svg viewBox="0 0 (\d+) (\d+)"/);if(!viewBox)throw new Error('Could not prepare the blueprint for download.');var floor={svg:svg,width:+viewBox[1],height:+viewBox[2],y:height};width=Math.max(width,floor.width);height+=floor.height+gap;return floor});
height-=gap;var out='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" font-family="Courier New,monospace"><title>'+P.buildingType+' blueprint</title>';
floors.forEach(function(fl){out+='<svg x="'+(width-fl.width)/2+'" y="'+fl.y+'" width="'+fl.width+'" height="'+fl.height+'" viewBox="0 0 '+fl.width+' '+fl.height+'">'+fl.svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')+'</svg>'});
out+='</svg>';var url=URL.createObjectURL(new Blob([out],{type:'image/svg+xml;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='formivue-'+P.buildingType+'-blueprint.svg';document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000)}
function gen(){var pl=P&&P.land;P=parse($('desc').value);P.land=P.land||pl||'lush';fi=0;render()}
document.addEventListener('click',function(e){var t=e.target.closest('button,.rm');if(!t)return;var d=t.dataset;
if(d.k=='sqft'){var cur=P.sqft||Math.round(calc()/100)*100;P.sqft=Math.max(400,Math.min(12000,cur+(+d.d)));render()}
else if(d.k){var lim={floors:[1,3],beds:[1,8],baths:[1,6]}[d.k];P[d.k]=Math.max(lim[0],Math.min(lim[1],P[d.k]+(+d.d)));P.sqft=null;render()}
else if(d.land){P.land=d.land;render()}
else if(d.ok){var oc=TYPE_OPTS[P.buildingType],os=oc.steppers.filter(function(x){return x.k==d.ok})[0];P.opts[d.ok]=Math.max(os.min,Math.min(os.max,(P.opts[d.ok]||0)+(+d.od)));P.sqft=null;render()}
else if(d.tab){tab=d.tab;render()}
else if(d.tod){tod=d.tod;render()}
else if(d.fl){fi=+d.fl;render()}
else if(d.roof){P.roof=d.roof;if(d.roof=='flat'&&P.windowStyle=='dormer'){$('desc').value=$('desc').value.replace(/\bgable roof\b/i,'flat roof');chooseWindowStyle('fixed')}else render()}
else if(d.windowStyle){chooseWindowStyle(d.windowStyle)}
else if(d.s){var a=PAL[d.s];P.style=d.s;P.wall=a[0];P.roofC=a[1];P.door=a[2];P.roof=a[3];render()}
else if(d.c){P.wall=d.c;render()}
else if(d.act){if(d.act=='rot'){AUTO=!AUTO;t.classList.toggle('on',AUTO)}else if(d.act=='download'){downloadBlueprint()}else{CAM.th=.6;CAM.ph=1.15;CAM.r=135}}else if(d.building!==undefined){$('desc').value=BUILDINGS[+d.building].prompt;gen()}else if(d.ex!==undefined){$('desc').value=EX[+d.ex];gen()}
else if(t.id=='go'){gen()}
else if(t.classList.contains('rm')){show(t)}});
document.addEventListener('mouseover',function(e){var t=e.target;if(t.classList&&t.classList.contains('rm'))show(t)});
$('t-garage').onchange=function(){P.garage=this.checked;render()};
$('t-office').onchange=function(){P.office=this.checked;render()};
$('t-balcony').onchange=function(){P.balcony=this.checked;render()};
$('t-patio').onchange=function(){P.patio=this.checked;render()};
$('t-furniture').onchange=function(){render()};
document.addEventListener('change',function(e){var k=e.target.dataset&&e.target.dataset.otoggle;if(k){P.opts[k]=e.target.checked?1:0;P.sqft=null;render()}});
var themeToggle=$('theme-toggle'),savedTheme=localStorage.getItem('formivue-theme');
document.documentElement.dataset.theme=savedTheme=='dark'?'dark':'light';
function updateThemeToggle(){var dark=document.documentElement.dataset.theme=='dark';themeToggle.textContent=dark?'☀️ Light mode':'🌙 Dark mode';themeToggle.setAttribute('aria-pressed',dark)}
themeToggle.addEventListener('click',function(){var dark=document.documentElement.dataset.theme!='dark';document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('formivue-theme',dark?'dark':'light');updateThemeToggle()});
updateThemeToggle();
$('chips').innerHTML=BUILDINGS.map(function(b,i){return '<button class="chip" data-building="'+i+'" data-type="'+['house','office','restaurant','cafe','shop'][i]+'" aria-pressed="false">'+b.name+'</button>'}).join('');
$('styles').innerHTML=Object.keys(STY).map(function(k){return '<button class="sty" data-s="'+k+'" style="--c:'+STY[k][2]+'">'+STY[k][1]+' '+STY[k][0]+'</button>'}).join('');
$('window-options').innerHTML=Object.keys(WINDOW_TYPES).map(function(k){return '<button class="window-type" data-window-style="'+k+'" aria-pressed="false">'+WINDOW_TYPES[k]+'</button>'}).join('');
$('sws').innerHTML=SW.map(function(c){return '<button class="sw" data-c="'+c+'" style="background:'+c+'" aria-label="Wall color '+c+'"></button>'}).join('');
gen();