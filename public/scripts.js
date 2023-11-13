const a = document.querySelectorAll("#a");
const imgs = document.querySelectorAll("#imgs");
const atras = document.getElementById("atras");
const adelante = document.getElementById("adelante");

let counter = 0;

adelante.addEventListener('click', function () {
   if(counter<4){
      a[counter].classList.remove("active");
      a[counter+1].classList.add("active");
      imgs[counter].classList.remove("active");
      imgs[counter+1].classList.add("active");
      counter++;
      console.log(counter);
   }
})

atras.addEventListener('click', function(){
   if(counter>0){
      a[counter].classList.remove("active");
      a[counter-1].classList.add("active");
      imgs[counter].classList.remove("active");
      imgs[counter-1].classList.add("active");
      counter--;
      console.log(counter);
   }
})

a.forEach(function(e){
    e.addEventListener('click', function(){
        console.log(e.index)
    })
})