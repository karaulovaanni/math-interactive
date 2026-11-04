'use strict';
(()=>{
 const root=document.getElementById('worksheet');
 const divisors=[2,3,4,5,6,9,10];
 const same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
 function report(id,ok,text){const f=document.getElementById(id);f.className='feedback '+(ok?'good':'bad');f.textContent=(ok?'Верно! ':'Проверь ещё раз. ')+text;return ok?1:0;}
 function invalidate(){root.querySelectorAll('.feedback:not(#worksheet-score)').forEach(e=>{e.className='feedback';e.textContent='';});document.getElementById('worksheet-score').textContent='Ответы изменены. Проверь задания.';}
 root.querySelectorAll('.digit-choice').forEach(button=>button.addEventListener('click',()=>{button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')==='true'?'false':'true');invalidate();}));
 root.addEventListener('change',invalidate);
 document.getElementById('worksheet-check').addEventListener('click',()=>{
  let correct=0;
  for(const n of [120,234,315,408]){
   const expected=divisors.filter(d=>n%d===0),selected=[...root.querySelectorAll(`[data-number="${n}"]:checked`)].map(e=>Number(e.dataset.divisor));
   correct+=report('row-'+n,same(selected,expected),'Делители из таблицы: '+expected.join(', ')+'.');
  }
  const truth=[true,false,false,true];
  const reasons=['Делимость на 9 означает делимость на 3: сумма цифр кратна 9 и 3.','Например, 26 — чётное, но сумма цифр 8 не делится на 3, поэтому 26 не делится на 6.','Например, 10 оканчивается на 0, но не делится на 4. Проверять нужно две последние цифры.','Число с 0 в конце делится и на 10, и на 5.'];
  truth.forEach((expected,i)=>{const input=root.querySelector(`[name="ws-truth-${i}"]:checked`);correct+=report('truth-'+i,!!input&&(input.value==='yes')===expected,reasons[i]);});
  root.querySelectorAll('.digit-options').forEach((bank,i)=>{
   const d=Number(bank.dataset.divisor),pattern=bank.dataset.pattern;
   const expected=Array.from({length:10},(_,x)=>x).filter(x=>Number(pattern.replace('□',x))%d===0);
   const selected=[...bank.querySelectorAll('[aria-pressed="true"]')].map(e=>Number(e.dataset.digit));
   const rule=d===4?'Проверь две последние цифры.':d===6?'Нужны чётность и сумма цифр, кратная 3.':'Сумма цифр должна делиться на 9.';
   correct+=report('digits-'+i,same(selected,expected),'Подходят цифры '+expected.join(', ')+'. '+rule);
  });
  const opinion=root.querySelector('[name="ws-misha"]:checked');
  const checks=[...root.querySelectorAll('[name="ws-misha-divisor"]:checked')].map(e=>Number(e.value));
  correct+=report('misha-feedback',opinion?.value==='no'&&same(checks,[2,3]),'Миша неправ. 326 делится на 2, но 3 + 2 + 6 = 11 не делится на 3. Значит, 326 не делится на 6.');
  const score=document.getElementById('worksheet-score');score.textContent=`Выполнено верно: ${correct} из 12`;score.className='feedback '+(correct===12?'good':'bad');
 });
 document.getElementById('worksheet-reset').addEventListener('click',()=>{
  root.querySelectorAll('input').forEach(e=>{e.checked=false;});
  root.querySelectorAll('.digit-choice').forEach(e=>e.setAttribute('aria-pressed','false'));
  root.querySelectorAll('.feedback').forEach(e=>{e.className='feedback';e.textContent='';});
  document.getElementById('worksheet-score').textContent='Выполнено верно: 0 из 12';
 });
})();
