(() => {

if (document.getElementById("shuoweb-tg-fab")) {
    return;
}

const style = document.createElement("style");

style.textContent = `

#shuoweb-tg-fab{

position:fixed;

right:16px;
bottom:calc(env(safe-area-inset-bottom,0px) + 16px);

width:58px;
height:58px;

border-radius:50%;

z-index:999999;

cursor:pointer;

display:flex;
align-items:center;
justify-content:center;

backdrop-filter:blur(20px);
-webkit-backdrop-filter:blur(20px);

background:
    linear-gradient(
        135deg,
        #229ED9,
        #1A8CD8
    );

box-shadow:
    0 10px 30px rgba(34,158,217,.35);

transition:
    transform .3s cubic-bezier(.34,1.56,.64,1),
    box-shadow .3s;

}

#shuoweb-tg-fab:hover{

transform:
    translateY(-3px)
    scale(1.06);

box-shadow:
    0 18px 40px rgba(34,158,217,.45);

}

#shuoweb-tg-fab:active{

transform:
    scale(.94);

}

#shuoweb-tg-fab svg{
    width:22px;
    height:22px;

    fill:white;

    position:relative;

    left:-1px;
    top:-1px;
}

#shuoweb-tg-fab::before{

content:"";

position:absolute;

inset:-8px;

border-radius:50%;

background:
    radial-gradient(
        circle,
        rgba(34,158,217,.25),
        transparent 70%
    );

z-index:-1;

animation:
    shuowebPulse 3s infinite ease-in-out;

}

@keyframes shuowebPulse{

0%{
    transform:scale(.9);
    opacity:.4;
}

50%{
    transform:scale(1.15);
    opacity:1;
}

100%{
    transform:scale(.9);
    opacity:.4;
}

}

@media(max-width:768px){

#shuoweb-tg-fab{

    width:54px;
    height:54px;

    right:14px;
    bottom:calc(env(safe-area-inset-bottom,0px) + 14px);
}

}
`;

document.head.appendChild(style);

const btn = document.createElement("div");

btn.id = "shuoweb-tg-fab";

btn.innerHTML = `
    <svg viewBox="0 0 24 24">
        <path d="M21.5 3.5L3.8 10.3C2.6 10.8 2.6 11.6 3.6 11.9L8.1 13.3L18.4 6.8C18.9 6.5 19.3 6.7 18.9 7L10.5 14.5V18.4C10.5 19.1 10.8 19.4 11.4 19.4C11.8 19.4 12 19.2 12.3 18.9L14.5 16.8L18.9 20C19.7 20.4 20.3 20.2 20.5 19L23 4.8C23.3 3.7 22.7 3.1 21.5 3.5Z"/>
    </svg>
`;

btn.addEventListener("click", () => {

    window.open(
        "https://t.me/shuoweb",
        "_blank"
    );

});

document.body.appendChild(btn);

})();