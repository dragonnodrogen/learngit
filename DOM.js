function init(){
  var obj;
  obj = document.getElementById('title');
  alert(obj.innerHTML);
  obj.innerHTML = 'learn js again'
}
window.onload = init;