'use strict';
const storageKey='math-brackets-grade5-v1';
let saved={};
try{const value=JSON.parse(localStorage.getItem(storageKey)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{}
const lookup=new Map(tasks.map(t=>[t.id,t]));
const forms=[...document.querySelectorAll('.exercise')];
function normalize(value){return value.toLowerCase().replace(/[х]/g,'x').replace(/а/g,'a').replace(/у/g,'y').replace(/в/g,'b').replace(/[−–]/g,'-').replace(/[·×]/g,'*').replace(/\s+/g,'');}
function polynomial(value){
 const text=normalize(value);
 if(!text||!/^[+\-\d.*abxy]+$/.test(text))return null;
 const parts=text.match(/[+-]?[^+-]+/g);
 if(!parts||parts.join('')!==text)return null;
 const result={};
 for(const part of parts){const match=part.match(/^([+-]?)(?:(\d+(?:\.\d+)?)\*?)?([abxy])$/);let key,number;
 if(match){key=match[3];number=(match[1]==='-'?-1:1)*(match[2]?Number(match[2]):1);}
 else if(/^[+-]?\d+(?:\.\d+)?$/.test(part)){key='constant';number=Number(part);}
 else return null;
 result[key]=(result[key]||0)+number;
 }
 return result;
}
function matches(input,task){
 if(task.equation){const text=normalize(input).replace(/^x=/,'').replace(',','.');if(!/^[+-]?\d+(?:\.\d+)?$/.test(text))return false;return Number(text)===Number(task.answer);}
 const a=polynomial(input),b=polynomial(task.answer);return a!==null&&b!==null&&[...new Set([...Object.keys(a),...Object.keys(b)])].every(k=>(a[k]||0)===(b[k]||0));
}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}}
function update(){const count=tasks.filter(t=>saved[t.id]?.correct).length;document.getElementById('progress-label').textContent=`Верно: ${count} из ${tasks.length}`;document.getElementById('progress-bar').style.width=count/tasks.length*100+'%';}
function check(form){
 const input=form.querySelector('input'),task=lookup.get(form.dataset.id),feedback=form.querySelector('.feedback');
 const correct=matches(input.value,task);saved[task.id]={value:input.value,correct};form.classList.toggle('is-correct',correct);
 feedback.textContent=correct?'Верно! Отличная работа.':input.value.trim()?'Пока не сходится. Проверь знаки и вычисления.':'Сначала введи ответ.';
 feedback.className='feedback '+(correct?'good':'bad');input.setAttribute('aria-invalid',String(!correct));persist();update();return correct;
}
forms.forEach(form=>{
 const input=form.querySelector('input'),entry=saved[form.dataset.id];
 if(entry&&typeof entry.value==='string'){input.value=entry.value;entry.correct=matches(entry.value,lookup.get(form.dataset.id));if(entry.correct){form.classList.add('is-correct');form.querySelector('.feedback').textContent='Верно!';form.querySelector('.feedback').className='feedback good';}}
 form.addEventListener('submit',e=>{e.preventDefault();check(form);});
 input.addEventListener('input',()=>{saved[form.dataset.id]={value:input.value,correct:false};form.classList.remove('is-correct');form.querySelector('.feedback').textContent='';input.removeAttribute('aria-invalid');persist();update();});
});
document.querySelectorAll('.check-section').forEach(button=>button.addEventListener('click',()=>{const section=button.closest('section');section.querySelectorAll('.exercise').forEach(check);section.querySelector('.exercise:not(.is-correct) input')?.focus();}));
document.getElementById('reset-progress').addEventListener('click',()=>{if(!confirm('Сбросить ответы и прогресс этого занятия?'))return;saved={};forms.forEach(form=>{form.reset();form.classList.remove('is-correct');form.querySelector('.feedback').textContent='';form.querySelector('input').removeAttribute('aria-invalid');form.querySelector('.solution').open=false;});persist();update();});
update();
