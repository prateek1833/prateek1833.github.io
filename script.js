document.querySelector('.hasburger').addEventListener("click",()=>{
    document.querySelector(".sidebar").classList.toggle("sidebarGo");
})
document.querySelector('.pages').addEventListener("click",()=>{
    document.querySelector(".sidebar").classList.toggle("sidebarGo");
})
var element = document.getElementById("menu");

element.addEventListener("click",()=>{
    document.querySelector(".sidebar").classList.remove("sidebarGo");
})

