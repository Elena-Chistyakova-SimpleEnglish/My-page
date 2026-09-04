const prizes=[
  'Скидка 10% на первый месяц',
  'Бесплатный пробный урок',
  'Полезный PDF-материал',
  'Скидка 15% на летний курс',
  'Скидка 50% на одно занятие'
];
const wheelColors=['#7fba70','#e99b82','#d6bd68','#8d79c9','#64a9b5'];
const spinStorageKey='elena-simple-english-prize-v1';
const giftModal=document.querySelector('#giftModal');
const wheel=document.querySelector('#prizeWheel');
const spinButton=document.querySelector('[data-spin]');
const result=document.querySelector('[data-gift-result]');
const prizeLabel=document.querySelector('[data-prize]');
const wheelStatus=document.querySelector('[data-wheel-status]');
let currentRotation=0;
let spinning=false;
let organizerMode=false;
let lastPrizeIndex=-1;
let rightClicks=[];

function storedPrize(){
  try{return JSON.parse(localStorage.getItem(spinStorageKey));}catch{return null;}
}

function wrapCanvasText(context,text,maxWidth){
  const words=text.split(' ');
  const lines=[];
  let line='';
  words.forEach(word=>{
    const candidate=line?`${line} ${word}`:word;
    if(context.measureText(candidate).width>maxWidth&&line){lines.push(line);line=word;}else{line=candidate;}
  });
  if(line)lines.push(line);
  return lines.slice(0,3);
}

function drawWheel(){
  if(!wheel)return;
  const context=wheel.getContext('2d');
  const size=wheel.width;
  const center=size/2;
  const radius=center-10;
  const arc=(Math.PI*2)/prizes.length;
  context.clearRect(0,0,size,size);
  prizes.forEach((prize,index)=>{
    const start=-Math.PI/2+index*arc;
    context.beginPath();
    context.moveTo(center,center);
    context.arc(center,center,radius,start,start+arc);
    context.closePath();
    context.fillStyle=wheelColors[index];
    context.fill();
    context.strokeStyle='rgba(255,255,255,.82)';
    context.lineWidth=7;
    context.stroke();
    context.save();
    context.translate(center,center);
    context.rotate(start+arc/2);
    context.textAlign='center';
    context.textBaseline='middle';
    context.fillStyle='#fff';
    context.font='700 27px Quicksand, sans-serif';
    context.shadowColor='rgba(24,52,28,.35)';
    context.shadowBlur=4;
    const lines=wrapCanvasText(context,prize,220);
    lines.forEach((line,lineIndex)=>context.fillText(line,radius*.62,(lineIndex-(lines.length-1)/2)*31));
    context.restore();
  });
  context.beginPath();
  context.arc(center,center,radius,0,Math.PI*2);
  context.strokeStyle='#fff';
  context.lineWidth=12;
  context.stroke();
}

function showPrize(prize,index){
  lastPrizeIndex=index;
  prizeLabel.textContent=prize;
  result.hidden=false;
}

function refreshSpinState(){
  if(!spinButton)return;
  const saved=storedPrize();
  if(saved&&!organizerMode){
    spinButton.disabled=true;
    wheelStatus.textContent='Ваше вращение уже использовано. Сохраните полученный приз.';
    showPrize(saved.prize,saved.index);
  }else{
    spinButton.disabled=false;
    wheelStatus.textContent=organizerMode?'Режим организатора активирован: повторные вращения доступны.':'Нажмите кнопку — колесо выберет ваш подарок.';
  }
}

function openGiftModal(){
  giftModal.classList.add('open');
  giftModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  refreshSpinState();
}

function closeGiftModal(){
  if(!giftModal)return;
  giftModal.classList.remove('open');
  giftModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

function chooseDifferentPrize(){
  const blocked=lastPrizeIndex>=0?lastPrizeIndex:storedPrize()?.index;
  const choices=prizes.map((_,index)=>index).filter(index=>index!==blocked);
  return choices[Math.floor(Math.random()*choices.length)];
}

function spinWheel(){
  if(spinning||(!organizerMode&&storedPrize()))return;
  spinning=true;
  spinButton.disabled=true;
  result.hidden=true;
  wheelStatus.textContent='Колесо вращается…';
  const winner=chooseDifferentPrize();
  const segment=360/prizes.length;
  const landing=-(winner+.5)*segment;
  const normalized=((currentRotation%360)+360)%360;
  const targetNormalized=((landing%360)+360)%360;
  const adjustment=(targetNormalized-normalized+360)%360;
  currentRotation+=360*(6+Math.floor(Math.random()*3))+adjustment;
  wheel.style.transform=`rotate(${currentRotation}deg)`;
  window.setTimeout(()=>{
    const wonPrize=prizes[winner];
    showPrize(wonPrize,winner);
    localStorage.setItem(spinStorageKey,JSON.stringify({prize:wonPrize,index:winner,wonAt:new Date().toISOString()}));
    wheelStatus.textContent='Поздравляем! Сохраните результат и отправьте его преподавателю.';
    spinning=false;
    spinButton.disabled=!organizerMode;
  },5500);
}

function createPrizeImage(){
  const canvas=document.createElement('canvas');
  canvas.width=1200;
  canvas.height=675;
  const context=canvas.getContext('2d');
  const gradient=context.createLinearGradient(0,0,1200,675);
  gradient.addColorStop(0,'#fbfbea');
  gradient.addColorStop(1,'#dff1d4');
  context.fillStyle=gradient;
  context.fillRect(0,0,1200,675);
  context.fillStyle='#ffffff';
  context.shadowColor='rgba(48,78,42,.18)';
  context.shadowBlur=35;
  context.beginPath();
  context.roundRect(90,70,1020,535,42);
  context.fill();
  context.shadowBlur=0;
  context.textAlign='center';
  context.fillStyle='#e3957c';
  context.font='700 30px Quicksand, sans-serif';
  context.fillText('КОЛЕСО УДАЧИ',600,155);
  context.fillStyle='#1e4a2a';
  context.font='700 62px Quicksand, sans-serif';
  context.fillText('Ваш подарок',600,240);
  context.fillStyle='#eef7e8';
  context.beginPath();
  context.roundRect(165,290,870,155,30);
  context.fill();
  context.fillStyle='#1e4a2a';
  context.font='700 42px Quicksand, sans-serif';
  const lines=wrapCanvasText(context,prizeLabel.textContent,760);
  lines.forEach((line,index)=>context.fillText(line,600,355+index*50));
  context.fillStyle='#5e7659';
  context.font='600 26px Quicksand, sans-serif';
  context.fillText('Елена Чистякова · Простой английский',600,520);
  context.fillStyle='#8c9b82';
  context.font='500 20px Quicksand, sans-serif';
  context.fillText('Покажите эту картинку преподавателю',600,560);
  return canvas;
}

function prizeFile(){
  return new Promise(resolve=>createPrizeImage().toBlob(blob=>resolve(new File([blob],'my-english-prize.png',{type:'image/png'})),'image/png'));
}

async function savePrize(){
  const file=await prizeFile();
  const link=document.createElement('a');
  link.href=URL.createObjectURL(file);
  link.download=file.name;
  link.click();
  window.setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

async function sharePrize(){
  const file=await prizeFile();
  if(navigator.share&&navigator.canShare?.({files:[file]})){
    try{await navigator.share({title:'Мой приз от Елены Чистяковой',text:`Мне выпал приз: ${prizeLabel.textContent}`,files:[file]});return;}catch(error){if(error.name==='AbortError')return;}
  }
  await savePrize();
  window.open('https://t.me/Elena_Simple_english','_blank','noopener');
}

document.querySelector('[data-open-gift]')?.addEventListener('click',openGiftModal);
document.querySelector('[data-close-modal]')?.addEventListener('click',closeGiftModal);
giftModal?.addEventListener('click',event=>{if(event.target===giftModal)closeGiftModal();});
spinButton?.addEventListener('click',spinWheel);
document.querySelector('[data-save-prize]')?.addEventListener('click',savePrize);
document.querySelector('[data-share-prize]')?.addEventListener('click',sharePrize);
wheel?.addEventListener('contextmenu',event=>{
  event.preventDefault();
  const now=Date.now();
  rightClicks=rightClicks.filter(time=>now-time<1100);
  rightClicks.push(now);
  if(rightClicks.length>=3){organizerMode=true;rightClicks=[];refreshSpinState();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeGiftModal();});
drawWheel();

const certificateModal=document.querySelector('#certificateModal');
const certificateImage=document.querySelector('[data-certificate-image]');
const certificateTitle=document.querySelector('#certificateTitle');
function closeCertificate(){if(!certificateModal)return;certificateModal.classList.remove('open');certificateModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-certificate]').forEach(card=>card.addEventListener('click',()=>{certificateImage.src=card.dataset.certificate;certificateTitle.textContent=card.dataset.title;certificateModal.classList.add('open');certificateModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));
document.querySelector('[data-close-certificate]')?.addEventListener('click',closeCertificate);
certificateModal?.addEventListener('click',event=>{if(event.target===certificateModal)closeCertificate();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCertificate();});
